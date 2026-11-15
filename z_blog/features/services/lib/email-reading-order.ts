export const EMAIL_READING_PRODUCT_ID = "personal-tarot-email";
export type EmailReadingDraft = {
  name: string;
  birthDate: string;
  email: string;
  background: string;
  questions: string[];
};

export function normaliseEmailReadingDraft(
  value: unknown,
  today: string,
): EmailReadingDraft | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (
    ["name", "birthDate", "email", "background"].some(
      (key) => typeof item[key] !== "string",
    ) ||
    !Array.isArray(item.questions)
  )
    return null;
  const name = (item.name as string).trim(),
    email = (item.email as string).trim(),
    birthDate = item.birthDate as string,
    background = (item.background as string).trim();
  if (
    !name ||
    name.length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    background.length > 4000
  )
    return null;
  if (birthDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || birthDate > today)
      return null;
    const date = new Date(`${birthDate}T00:00:00Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== birthDate
    )
      return null;
  }
  if (
    !item.questions.length ||
    item.questions.length > 99 ||
    item.questions.some(
      (question) =>
        typeof question !== "string" ||
        !question.trim() ||
        question.trim().length > 2000,
    )
  )
    return null;
  return {
    name,
    email,
    birthDate,
    background,
    questions: item.questions.map((question) => (question as string).trim()),
  };
}
