export type WelcomeTemplate = {
  subject_zh: string; subject_en: string; heading_zh: string; heading_en: string;
  body_zh: string; body_en: string; button_zh: string; button_en: string;
  button_url: string; image_url: string; image_link: string;
};
export const defaultTemplate: WelcomeTemplate = {
  subject_zh: "欢迎来到 STELLARNESTS｜星辰来信", subject_en: "Welcome to STELLARNESTS",
  heading_zh: "探索你的灵魂蓝图", heading_en: "Discover Your Soul's Blueprint",
  body_zh: "欢迎来到星辰之巢。星辰记录着你诞生时的独特故事。填写出生信息，开启属于你的自我探索之旅。",
  body_en: "Welcome to STELLARNESTS. The stars hold a unique story from the moment of your birth. Discover your cosmic blueprint and begin your journey of self-exploration.",
  button_zh: "生成出生星盘", button_en: "Generate Your Birth Chart", button_url: "/astroplate",
  image_url: "", image_link: "/astroplate",
};
export function safeLink(value: string, allowRelative = true) {
  if (allowRelative && /^\/(?!\/)[^\\\s]*$/.test(value)) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
export function welcomeContent(template: WelcomeTemplate, language: "zh" | "en", origin: string) {
  const absolute = (value: string) => new URL(value, origin).href;
  const title = template[`heading_${language}`], body = template[`body_${language}`];
  const button = template[`button_${language}`];
  const image = template.image_url && safeLink(template.image_url) ? `<img src="${escapeHtml(absolute(template.image_url))}" alt="STELLARNESTS" style="display:block;width:100%;max-width:600px;height:auto">` : "";
  const linkedImage = image && template.image_link && safeLink(template.image_link) ? `<a href="${escapeHtml(absolute(template.image_link))}">${image}</a>` : image;
  const target = safeLink(template.button_url) ? absolute(template.button_url) : absolute("/astroplate");
  return { subject: template[`subject_${language}`],
    text: `${title}\n\n${body}\n\n${button}: ${target}`,
    html: `<div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;line-height:1.8"><p>STELLARNESTS</p><h1>${escapeHtml(title)}</h1>${linkedImage}<p style="white-space:pre-wrap">${escapeHtml(body)}</p><p><a href="${escapeHtml(target)}">${escapeHtml(button)}</a></p></div>` };
}
