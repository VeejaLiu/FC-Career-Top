export function encode(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function decode(value: string): Uint8Array {
    return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
}

async function key(secret: string) {
    if (!secret || secret.length < 32) throw new Error('SECRET_JWT must contain at least 32 characters');
    return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
        'sign',
        'verify',
    ]);
}

export async function signToken(id: number, secret: string): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const header = encode(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const payload = encode(
        new TextEncoder().encode(JSON.stringify({ id, iat: now, exp: now + 7 * 86400, jti: crypto.randomUUID() })),
    );
    const data = `${header}.${payload}`;
    const signature = await crypto.subtle.sign('HMAC', await key(secret), new TextEncoder().encode(data));
    return `${data}.${encode(new Uint8Array(signature))}`;
}

export async function tokenId(token: string, secret: string): Promise<number | null> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
        if (header.alg !== 'HS256' || header.typ !== 'JWT') return null;
        if (
            !(await crypto.subtle.verify(
                'HMAC',
                await key(secret),
                decode(parts[2]),
                new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
            ))
        )
            return null;
        const payload = JSON.parse(new TextDecoder().decode(decode(parts[1])));
        if (
            !Number.isSafeInteger(payload.id) ||
            payload.id < 1 ||
            !Number.isFinite(payload.exp) ||
            payload.exp <= Date.now() / 1000
        )
            return null;
        return payload.id;
    } catch {
        return null;
    }
}

export function passwordValid(password: unknown): password is string {
    if (typeof password !== 'string' || password.length < 6 || new TextEncoder().encode(password).length > 72)
        return false;
    return [/[A-Z]/, /[a-z]/, /\d/, /[!@#$%^&*(),.?":{}|<>]/].filter((test) => test.test(password)).length >= 3;
}
