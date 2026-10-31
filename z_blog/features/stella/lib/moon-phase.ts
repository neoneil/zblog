export function phaseIndex(phase: number): number {
  const angle = ((phase % 360) + 360) % 360;
  return Math.floor(angle / 45);
}
