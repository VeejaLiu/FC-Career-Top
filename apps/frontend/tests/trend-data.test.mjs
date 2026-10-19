import assert from 'node:assert/strict';
import { test } from 'node:test';
import { gameDateTime, trendPoints } from '../src/components/trend-data.ts';
test('actual calendar gaps survive sorting and leap days', () => {
  const input = [{inGameDate:'2026-10-02',overallRating:69},{inGameDate:'2026-07-01',overallRating:65},{inGameDate:'2026-09-25',overallRating:68}];
  const result = trendPoints(input);
  assert.equal((result[1].time-result[0].time)/86400000, 86);
  assert.equal((result[2].time-result[1].time)/86400000, 7);
  assert.equal(input[0].inGameDate, '2026-10-02');
  assert.equal(gameDateTime('2024-02-29'), Date.UTC(2024,1,29));
});
test('invalid dates cannot turn into misleading chart observations', () => {
  for (const date of ['2026-02-29','2026-02-30','2026-13-01','not-a-date','2026-1-1']) assert.equal(gameDateTime(date),null);
  assert.deepEqual(trendPoints([{inGameDate:'bad',overallRating:1}]),[]);
  assert.equal(trendPoints([{inGameDate:'2026-10-19',overallRating:1}])[0].overallRating,1);
});
