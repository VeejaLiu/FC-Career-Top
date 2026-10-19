import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loginDestination } from '../src/common/login-destination.ts';
test('login resumes setup and player history without losing selection', () => {
  assert.equal(loginDestination({ pathname:'/get-started', search:'', hash:'' }), '/get-started');
  assert.equal(loginDestination({ pathname:'/players-detail', search:'?id=42&view=history', hash:'' }), '/players-detail?id=42&view=history');
  assert.equal(loginDestination({ pathname:'/career', search:'', hash:'#career-compare' }), '/career#career-compare');
});
test('other login entry paths use the Career hub', () => {
  for (const pathname of ['/', '/demo', '//example.com', 'https://example.com']) {
    assert.equal(loginDestination({ pathname, search:'?next=https://example.com', hash:'' }), '/career');
  }
});
