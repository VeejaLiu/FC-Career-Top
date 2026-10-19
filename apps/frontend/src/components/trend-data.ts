// UTC dates avoid daylight-saving shifts and keep gaps proportional to game time.
export function gameDateTime(date: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const timestamp = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === date
    ? timestamp
    : null;
}
export function trendPoints<T extends { inGameDate: string }>(data: T[]) {
  return data
    .flatMap((point) => {
      const time = gameDateTime(point.inGameDate);
      return time == null ? [] : [{ ...point, time }];
    })
    .sort((a, b) => a.time - b.time);
}
