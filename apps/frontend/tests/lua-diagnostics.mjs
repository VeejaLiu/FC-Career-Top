import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const lua = process.env.LUA_BIN || 'lua';
const output = execFileSync(lua, [
  fileURLToPath(new URL('./lua-diagnostics.lua', import.meta.url)),
  fileURLToPath(new URL('../lua-scripts/client-script.lua', import.meta.url)),
], { encoding: 'utf8' });
for (const line of output.trim().split('\n')) {
  const report = JSON.parse(line);
  assert.ok([24, 25, 26, 27].includes(report.gameVersion));
  assert.ok(report.scriptVersion && report.editorVersion && report.stage && report.message && report.traceback);
  assert.ok(Buffer.byteLength(line) <= 16 * 1024);
  assert.ok(!line.includes('fct-' + 'a'.repeat(64)));
  assert.ok(!('players' in report || 'headers' in report || 'secretKey' in report));
}
console.log('PASS: FC 24–27 snapshots, import/collection/encoding/event/HTTP failures, traceback, redaction, UTF-8, dedupe, cap, reporting failure/recovery and curl cleanup.');
