import { generateUploadKey as uploadKey } from '../utils/UploadKey';
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import { HttpError } from './http';

// Only Google's public signing keys are cached; user credentials are never cached.
const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export async function verifyGoogleCredential(
    credential: unknown,
    clientId: string,
    nonce: string,
    keys: JWTVerifyGetKey = googleKeys,
) {
    if (typeof credential !== 'string' || credential.length > 8192 || !nonce)
        throw new HttpError(400, 'Invalid Google sign-in request');
    try {
        const { payload } = await jwtVerify(credential, keys, {
            algorithms: ['RS256'],
            issuer: ['https://accounts.google.com', 'accounts.google.com'],
            audience: clientId,
            requiredClaims: ['sub', 'iat', 'exp', 'nonce', 'email', 'email_verified'],
            maxTokenAge: '10m',
        });
        if (
            payload.nonce !== nonce ||
            typeof payload.sub !== 'string' ||
            !payload.sub ||
            payload.sub.length > 255 ||
            typeof payload.email !== 'string' ||
            payload.email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
            payload.email_verified !== true
        )
            throw new Error('Invalid identity claims');
        const email = payload.email.trim().toLowerCase();
        return {
            subject: payload.sub,
            email,
            emailAuthority: email.endsWith('@gmail.com') || (typeof payload.hd === 'string' && payload.hd.length > 0),
        };
    } catch {
        throw new HttpError(401, 'Google sign-in could not be verified. Please try again.');
    }
}

export async function googleAccount(
    db: D1Database,
    identity: { subject: string; email: string; emailAuthority: boolean },
    authenticatedAccountId?: number,
) {
    type Account = {
        id: number;
        username: string;
        email: string;
        password: string;
        google_sub: string | null;
        is_deleted: number;
        is_disabled: number;
        is_email_verified: number;
    };
    const linked = await db.prepare('SELECT * FROM user WHERE google_sub=?').bind(identity.subject).first<Account>();
    let account =
        linked ||
        (await db.prepare('SELECT * FROM user WHERE email=? COLLATE NOCASE').bind(identity.email).first<Account>());
    if (authenticatedAccountId !== undefined && account?.id !== authenticatedAccountId)
        throw new HttpError(409, 'Choose the Google account with the same email as your current account.');
    if (account && (account.is_deleted || account.is_disabled)) throw new HttpError(403, 'This account is unavailable');
    if (account && !linked) {
        if (account.google_sub) throw new HttpError(409, 'This email is already linked to another Google account');
        if (!identity.emailAuthority && authenticatedAccountId !== account.id)
            throw new HttpError(
                409,
                'Sign in to your existing account first to link this Google email.',
                'GOOGLE_EXISTING_EMAIL_LOGIN_REQUIRED',
            );
        // A prior unverified registration may belong to someone else. Do not leave
        // its password usable after Google establishes the email owner's identity.
        const password = account.is_email_verified || authenticatedAccountId === account.id ? account.password : '';
        const updates = [
            db
                .prepare(
                    'UPDATE user SET google_sub=?,password=?,is_email_verified=1,update_time=CURRENT_TIMESTAMP WHERE id=?',
                )
                .bind(identity.subject, password, account.id),
        ];
        if (!account.is_email_verified && authenticatedAccountId !== account.id) {
            updates.push(
                db
                    .prepare('UPDATE user_secret_key SET secret_key=?,update_time=CURRENT_TIMESTAMP WHERE user_id=?')
                    .bind(uploadKey(), account.id),
            );
        }
        await db.batch(updates);
        account = { ...account, password, google_sub: identity.subject, is_email_verified: 1 };
    }
    if (!account) {
        const username = `${identity.email.split('@')[0].slice(0, 40)}_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
        const key = uploadKey();
        await db.batch([
            db
                .prepare("INSERT INTO user(username,email,password,google_sub,is_email_verified) VALUES (?,?,'',?,1)")
                .bind(username, identity.email, identity.subject),
            db
                .prepare(
                    'INSERT INTO user_secret_key(user_id,secret_key) VALUES ((SELECT id FROM user WHERE google_sub=?),?)',
                )
                .bind(identity.subject, key),
            db
                .prepare(
                    'INSERT INTO user_setting(user_id,default_game_version,enable_notification,notification_items) VALUES ((SELECT id FROM user WHERE google_sub=?),25,1,?)',
                )
                .bind(
                    identity.subject,
                    JSON.stringify([
                        'PlayerUpdate.Overall',
                        'PlayerUpdate.SkillMove',
                        'PlayerUpdate.WeakFoot',
                        'PlayerUpdate.PlayStyles',
                    ]),
                ),
        ]);
        account = await db.prepare('SELECT * FROM user WHERE google_sub=?').bind(identity.subject).first<Account>();
    }
    if (!account) throw new HttpError(503, 'Please try signing in again');
    return account;
}
