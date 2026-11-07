export function retrogradeReferenceDate(year: number, now: Date): Date {
  if (!Number.isInteger(year) || year < 1900 || year > 2100 || !Number.isFinite(now.getTime())) throw new RangeError("Invalid retrograde reference date");
  if (year === now.getUTCFullYear()) return new Date(now.getTime());
  const month = now.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(now.getUTCDate(), lastDay), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()));
}
