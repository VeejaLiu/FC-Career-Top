import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import bcrypt from 'bcryptjs';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import { googleAccount, verifyGoogleCredential } from '../src/worker/google-auth';

async function main() {
    const { publicKey, privateKey } = await generateKeyPair('RS256');
    const jwk = await exportJWK(publicKey);
    const keys = createLocalJWKSet({ keys: [{ ...jwk, kid: 'test', alg: 'RS256' }] });
    const clientId = 'test.apps.googleusercontent.com';
    const nonce = 'test-nonce';
    const base = { sub: 'google-1', email: 'Player@GMAIL.COM', email_verified: true, nonce };
    async function signed(
        overrides = {},
        issuer = 'https://accounts.google.com',
        audience = clientId,
        expires: string | number = '5m',
    ) {
        return new SignJWT({ ...base, ...overrides })
            .setProtectedHeader({ alg: 'RS256', kid: 'test' })
            .setIssuer(issuer)
            .setAudience(audience)
            .setIssuedAt()
            .setExpirationTime(expires)
            .sign(privateKey);
    }
    assert.deepEqual(await verifyGoogleCredential(await signed(), clientId, nonce, keys), {
        subject: 'google-1',
        email: 'player@gmail.com',
        emailAuthority: true,
    });
    for (const token of [
        await signed({}, 'https://evil.example'),
        await signed({}, undefined, 'other-client'),
        await signed({ nonce: 'other' }),
        await signed({ email_verified: false }),
        await signed({ sub: '' }),
        await signed({ email: 'invalid' }),
        await signed({}, undefined, undefined, 1),
        'forged.token.signature',
    ]) {
        await assert.rejects(verifyGoogleCredential(token, clientId, nonce, keys));
    }
    const valid = await signed();
    await assert.rejects(verifyGoogleCredential(valid.slice(0, -10) + 'AAAAAAAAAA', clientId, nonce, keys));
    const migrationDb = new DatabaseSync(':memory:');
    migrationDb.exec('CREATE TABLE user_secret_key(secret_key TEXT);');
    migrationDb.prepare('INSERT INTO user_secret_key VALUES (?)').run('fcd-' + 'ab'.repeat(32));
    migrationDb.exec(readFileSync('db/d1-migrations/0009_fct_upload_key_prefix.sql', 'utf8'));
    assert.equal(
        migrationDb.prepare('SELECT secret_key FROM user_secret_key').get()?.secret_key,
        'fct-' + 'ab'.repeat(32),
    );
    migrationDb.close();
    const sql = new DatabaseSync(':memory:');
    for (const name of readdirSync('db/d1-migrations')
        .filter((n) => n.endsWith('.sql'))
        .sort())
        sql.exec(readFileSync(`db/d1-migrations/${name}`, 'utf8'));
    function statement(query: string, values: any[] = []): any {
        return {
            query,
            values,
            bind(...args: any[]) {
                return statement(query, args);
            },
            async first() {
                return sql.prepare(query).get(...values) || null;
            },
            async run() {
                const result = sql.prepare(query).run(...values);
                return { meta: { last_row_id: Number(result.lastInsertRowid), changes: Number(result.changes) } };
            },
        };
    }
    const db = {
        prepare: statement,
        async batch(items: any[]) {
            sql.exec('BEGIN');
            try {
                const result = [];
                for (const item of items) result.push(await item.run());
                sql.exec('COMMIT');
                return result;
            } catch (error) {
                sql.exec('ROLLBACK');
                throw error;
            }
        },
    } as unknown as D1Database;
    await assert.rejects(
        googleAccount(db, { subject: 'unrelated', email: 'unrelated@gmail.com', emailAuthority: true }, 123),
    );
    assert.equal(Number(sql.prepare('SELECT count(*) n FROM user').get()?.n), 0);
    const fresh = await googleAccount(
        db,
        { subject: 'google-1', email: 'player@gmail.com', emailAuthority: true },
        undefined,
    );

    assert.equal(fresh.password, '');
    assert.equal(Number(sql.prepare('SELECT count(*) n FROM user_secret_key WHERE user_id=?').get(fresh.id)?.n), 1);
    assert.equal(Number(sql.prepare('SELECT count(*) n FROM user_setting WHERE user_id=?').get(fresh.id)?.n), 1);
    const again = await googleAccount(
        db,
        { subject: 'google-1', email: 'changed@gmail.com', emailAuthority: true },
        undefined,
    );

    assert.equal(again.id, fresh.id);
    sql.prepare('INSERT INTO user(username,email,password) VALUES (?,?,?)').run(
        'existing',
        'existing@example.com',
        await bcrypt.hash('Original!123', 10),
    );
    const existingId = Number(sql.prepare('SELECT id FROM user WHERE username=?').get('existing')?.id);
    const identity = { subject: 'google-2', email: 'existing@example.com', emailAuthority: false };
    await assert.rejects(googleAccount(db, identity, undefined));
    await assert.rejects(googleAccount(db, identity, existingId + 1));
    assert.equal(sql.prepare('SELECT google_sub FROM user WHERE id=?').get(existingId)?.google_sub, null);
    const linked = await googleAccount(db, identity, existingId);
    assert.equal(linked.id, existingId);
    assert.equal(await bcrypt.compare('Original!123', linked.password), true);
    assert.equal(Number(sql.prepare('SELECT count(*) n FROM user WHERE email=?').get(identity.email)?.n), 1);
    await assert.rejects(
        googleAccount(db, { subject: 'different', email: identity.email, emailAuthority: true }, undefined),
    );
    sql.prepare('UPDATE user SET is_disabled=1 WHERE id=?').run(existingId);
    await assert.rejects(googleAccount(db, identity, undefined));
    sql.prepare('UPDATE user SET is_disabled=0,is_deleted=1 WHERE id=?').run(existingId);
    await assert.rejects(googleAccount(db, identity, undefined));
    await assert.rejects(
        googleAccount(db, { subject: 'new-google', email: identity.email, emailAuthority: true }, undefined),
    );
    sql.prepare('INSERT INTO user(username,email,password) VALUES (?,?,?)').run(
        'unverified',
        'autolink@gmail.com',
        await bcrypt.hash('Old!123', 10),
    );
    sql.prepare('INSERT INTO user_secret_key(user_id,secret_key) VALUES ((SELECT id FROM user WHERE email=?),?)').run(
        'autolink@gmail.com',
        'old-unverified-key',
    );
    const auto = await googleAccount(db, { subject: 'google-auto', email: 'autolink@gmail.com', emailAuthority: true });
    assert.equal(auto.password, '');
    assert.notEqual(
        sql.prepare('SELECT secret_key FROM user_secret_key WHERE user_id=?').get(auto.id)?.secret_key,
        'old-unverified-key',
    );
    assert.equal(auto.google_sub, 'google-auto');
    assert.equal(auto.is_email_verified, 1);
    assert.equal(Number(sql.prepare('SELECT count(*) n FROM user WHERE email=?').get('autolink@gmail.com')?.n), 1);
    sql.prepare('INSERT INTO user(username,email,password,is_email_verified) VALUES (?,?,?,1)').run(
        'verified',
        'verified@gmail.com',
        await bcrypt.hash('Verified!123', 10),
    );
    const verified = await googleAccount(db, {
        subject: 'google-verified',
        email: 'verified@gmail.com',
        emailAuthority: true,
    });
    assert.equal(await bcrypt.compare('Verified!123', verified.password), true);
    const thirdParty = await verifyGoogleCredential(
        await signed({ email: 'other@example.com' }),
        clientId,
        nonce,
        keys,
    );
    assert.equal(thirdParty.emailAuthority, false);
    const workspace = await verifyGoogleCredential(
        await signed({ email: 'work@example.com', hd: 'example.com' }),
        clientId,
        nonce,
        keys,
    );
    assert.equal(workspace.emailAuthority, true);
    console.log(
        'Google claims, stable identity, automatic linking, unverified password removal, third-party email protection and disabled/deleted account tests passed.',
    );
    sql.close();
}
void main();
