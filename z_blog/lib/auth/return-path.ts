export function safeReturnPath(value: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.includes(String.fromCharCode(92)) ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  ) return "/";
  const base = "https://return.invalid";
  try {
    const target = new URL(value, base);
    return target.origin === base && !target.pathname.startsWith("//")
      ? target.pathname + target.search + target.hash
      : "/";
  } catch {
    return "/";
  }
}
