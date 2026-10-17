// Operator-only provisioning. No customer account is created or promoted.
import bcrypt from 'bcryptjs';
import { randomBytes, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const args = process.argv.slice(2);
const value = (name) => {
    const i = args.indexOf(name);
    return i < 0 ? undefined : args[i + 1];
};
const username = value('--username');
const role = value('--role') || 'owner';
const output = value('--output')
    ? resolve(value('--output'))
    : join(tmpdir(), `fc-admin-${username}-${randomUUID()}.json`);
if (
    !username ||
    !/^[A-Za-z][A-Za-z0-9_.-]{2,39}$/.test(username) ||
    !['owner', 'operator'].includes(role) ||
    args.some(
        (v, i) =>
            !['--username', '--role', '--output', '--remote'].includes(v) &&
            !['--username', '--role', '--output'].includes(args[i - 1]),
    )
) {
    console.error(
        'Usage: pnpm admin:create --username admin [--role owner|operator] [--remote] [--output /private/path.json]',
    );
    process.exit(1);
}
if (existsSync(output)) throw new Error('Refusing to overwrite an existing credential file.');
const tracked = spawnSync('git', ['ls-files', '--error-unmatch', output], { encoding: 'utf8' });
const ignored = spawnSync('git', ['check-ignore', '-q', output], { encoding: 'utf8' });
const root = spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).stdout.trim();
if (tracked.status === 0 || (output.startsWith(root + '/') && ignored.status !== 0))
    throw new Error('Credential output inside this repository must be Git-ignored.');
const password = 'Aa1!' + randomBytes(18).toString('base64url');
writeFileSync(
    output,
    JSON.stringify(
        { username, password, role, environment: args.includes('--remote') ? 'production' : 'local' },
        null,
        2,
    ) + '\n',
    { mode: 0o600, flag: 'wx' },
);
const directory = mkdtempSync(join(tmpdir(), 'fc-admin-create-'));
try {
    const file = join(directory, 'create.sql');
    const hash = await bcrypt.hash(password, 10);
    writeFileSync(
        file,
        `INSERT INTO admin_account(username,password_hash,role) VALUES ('${username}','${hash}','${role}');\n`,
        { mode: 0o600 },
    );
    const result = spawnSync(
        'pnpm',
        [
            'exec',
            'wrangler',
            'd1',
            'execute',
            'fc-career-top',
            args.includes('--remote') ? '--remote' : '--local',
            '--file',
            file,
        ],
        { encoding: 'utf8' },
    );
    if (result.status !== 0)
        throw new Error(
            'Administrator creation failed. Credentials retained for recovery; verify the account before retrying.',
        );
    console.log(`Independent administrator created: ${username}. Private credentials: ${output}`);
} finally {
    rmSync(directory, { recursive: true, force: true });
}
