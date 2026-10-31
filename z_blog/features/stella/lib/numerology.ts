export function reduceNumber(value: number, masters = true): number {
  while (value > 9 && !(masters && [11, 22, 33].includes(value)))
    value = String(value)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  return value;
}
export function lifePath(date: string): {
  number: number;
  sum: number;
  components: number[];
} {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new RangeError("Invalid birth date");
  const parsed = new Date(`${date}T12:00:00Z`);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    throw new RangeError("Invalid birth date");
  const [year, month, day] = date.split("-").map(Number);
  const components = [month, day, year].map((n) => reduceNumber(n)),
    sum = components.reduce((a, b) => a + b, 0);
  return { number: reduceNumber(sum), sum, components };
}
