const { spawnSync } = require('node:child_process');
const path = require('node:path');
const dotenv = require('dotenv');

const backendDir = path.resolve(__dirname, '..');
const command = process.argv[2];

if (process.argv.length !== 3 || !['migrate', 'validate', 'info'].includes(command)) {
    console.error('Usage: node scripts/flyway.cjs <migrate|validate|info>');
    process.exit(1);
}

dotenv.config({ path: path.join(backendDir, '.env') });

for (const key of ['MYSQL_HOST', 'MYSQL_DATABASE', 'MYSQL_USERNAME', 'MYSQL_PASSWORD']) {
    if (process.env[key] === undefined || (key !== 'MYSQL_PASSWORD' && !process.env[key].trim())) {
        console.error(`Set ${key} in apps/backend/.env or the process environment.`);
        process.exit(1);
    }
}

const port = process.env.MYSQL_PORT || '3306';
if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    console.error('MYSQL_PORT must be a number between 1 and 65535.');
    process.exit(1);
}

// A container's localhost is not the host running MySQL.
const mysqlHost = process.env.MYSQL_HOST;
const host = ['localhost', '127.0.0.1', '::1'].includes(mysqlHost)
    ? 'host.docker.internal'
    : mysqlHost.includes(':') ? `[${mysqlHost}]` : mysqlHost;

const result = spawnSync('docker', [
    'run', '--rm',
    '--add-host', 'host.docker.internal:host-gateway',
    '--volume', `${path.join(backendDir, 'db')}:/flyway/project:ro`,
    '--env', 'FLYWAY_URL',
    '--env', 'FLYWAY_USER',
    '--env', 'FLYWAY_PASSWORD',
    '--env', 'REDGATE_DISABLE_TELEMETRY=true',
    'flyway/flyway:13.10.0-alpine',
    '-configFiles=/flyway/project/flyway.conf',
    command,
], {
    stdio: 'inherit',
    env: {
        ...process.env,
        FLYWAY_URL: process.env.FLYWAY_URL ||
            `jdbc:mysql://${host}:${port}/${encodeURIComponent(process.env.MYSQL_DATABASE)}?permitMysqlScheme=true&allowPublicKeyRetrieval=true`,
        FLYWAY_USER: process.env.MYSQL_USERNAME,
        FLYWAY_PASSWORD: process.env.MYSQL_PASSWORD,
    },
});

if (result.error) {
    console.error('Could not run Docker. Install Docker and start its engine.');
}
process.exit(result.status ?? 1);
