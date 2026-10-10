export const DateUtils = {
  // Same game-day epoch used by Live Editor's DATE:FromGregorianDays.
  fromGameDays(days: number): string {
    const a = days + 2331205;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = Math.floor((-b * 146097) / 4 + a);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = Math.floor((-1461 * d) / 4 + c);
    const m = Math.floor((5 * e + 2) / 153);
    const day = Math.ceil(-(153 * m + 2) / 5) + e + 1;
    const month = Math.ceil(-m / 10) * 12 + m + 3;
    const year = b * 100 + d - 4800 + Math.floor(m / 10);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  },
};
