export function formatDegrees(value: number): string {
  if (!Number.isFinite(value)) return "--";
  const seconds = Math.round(((value % 360 + 360) % 360) * 3600) % (360 * 3600);
  const degrees = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${degrees}° ${String(minutes).padStart(2, "0")}′ ${String(remainder).padStart(2, "0")}″`;
}
