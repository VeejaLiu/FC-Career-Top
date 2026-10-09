import assert from 'node:assert/strict';
import { test } from 'node:test';
import redirectWorker from './redirect.ts';

const env = { CANONICAL_ORIGIN: 'https://www.fccareer.top' };

for (const [source, expected] of [
  ['https://fccareer.top/', 'https://www.fccareer.top/'],
  ['http://fccareer.top/get-started', 'https://www.fccareer.top/get-started'],
  ['https://fccareer.top/posts?utm_source=test&tag=FC%2025', 'https://www.fccareer.top/posts?utm_source=test&tag=FC%2025'],
  ['https://fccareer.top/robots.txt', 'https://www.fccareer.top/robots.txt'],
  ['https://fccareer.top//example.com/path', 'https://www.fccareer.top//example.com/path'],
]) {
  test(`permanent canonical redirect: ${source}`, () => {
    const response = redirectWorker.fetch(new Request(source), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), expected);
  });
}
