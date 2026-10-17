/** The readable product prefix is not part of the secret's entropy. */
export function canonicalUploadKey(value: string): string {
    return value.startsWith('fcd-') ? `fct-${value.slice(4)}` : value;
}

export function uploadKeyAliases(value: string): [string, string] {
    const canonical = canonicalUploadKey(value);
    return [canonical, canonical.startsWith('fct-') ? `fcd-${canonical.slice(4)}` : canonical];
}

export function generateUploadKey(): string {
    return `fct-${Array.from(crypto.getRandomValues(new Uint8Array(32)), (n) => n.toString(16).padStart(2, '0')).join('')}`;
}
