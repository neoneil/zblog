import type { ServiceGuide } from "./service-guides";
import { emailReadingCopy } from "./email-reading-copy";

const text = (id: number) => {
  const row = emailReadingCopy.find((item) => item.id === id);
  if (!row) throw new Error(`Missing email reading copy: ${id}`);
  return { zh: row.zh.replace(/^✦\s*/, ""), en: row.en };
};
const copy = (zh: string, en: string) => ({ zh, en });

export const emailReadingGuide: ServiceGuide = {
  tagline: copy(
    "无需预约，无需视频通话。只需写下你的疑问，一份专属于你的塔罗解读便会送达邮箱。",
    "NO APPOINTMENTS. NO VIDEO CALLS. JUST YOUR QUESTIONS AND A PERSONAL TAROT READING DELIVERED TO YOUR INBOX.",
  ),
  introduction: [10, 11, 12, 13, 14, 15].map(text),
  sections: [
    {
      id: "email-benefits",
      title: copy(
        "为什么选择邮件塔罗占卜？",
        "WHY CHOOSE EMAIL TAROT READING?",
      ),
      highlights: [19, 21, 23, 25, 27, 29].map((id) => ({
        label: text(id),
        text: text(id + 1),
      })),
    },
    {
      id: "email-questions",
      title: copy("四个简单步骤，开启你的私人塔罗之旅", "HOW IT WORKS"),
      tagline: copy("01 · 选择问题数量", "STEP 01 · CHOOSE YOUR QUESTIONS"),
      paragraphs: [35, 36, 37].map(text),
    },
    {
      id: "email-story",
      title: copy("02 · 写下你的故事", "STEP 02 · SHARE YOUR STORY"),
      paragraphs: [text(39), text(45)],
      lists: [
        {
          title: copy("咨询资料", "Consultation Details"),
          items: [40, 41, 42, 43, 44].map(text),
        },
      ],
    },
    {
      id: "email-payment",
      title: copy("03 · 确认订单与支付", "STEP 03 · COMPLETE YOUR PAYMENT"),
      paragraphs: [text(47), text(48)],
      note: copy(
        "当前为购买流程预览，尚未启用结算、银行卡付款、STARS 支付或自动订单邮件。加入购物车不代表已经下单或支付；24–48 小时交付从正式订单确认后开始。",
        "This purchase flow is a preview. Checkout, card payments, STARS payments and automatic order emails are not enabled. Adding to cart does not place or pay for an order; the 24–48-hour delivery period starts after a real order is confirmed.",
      ),
    },
    {
      id: "email-delivery",
      title: copy(
        "04 · 收到你的专属解读",
        "STEP 04 · RECEIVE YOUR PERSONAL READING",
      ),
      paragraphs: [text(50), text(51), copy("整个过程无需预约或在线等待。", "No appointment or waiting online is needed.")],
      lists: [
        {
          title: copy("邮件中你将收到", "Your Email Will Include"),
          items: [52, 53, 54, 55].map(text),
        },
      ],
    },
    {
      id: "email-topics",
      title: copy("你可以咨询哪些问题？", "WHAT CAN YOU ASK?"),
      highlights: [
        { label: copy("爱情与关系", "LOVE & RELATIONSHIPS"), text: text(67) },
        { label: copy("事业与学业", "CAREER & STUDY"), text: text(69) },
        { label: copy("自我成长", "PERSONAL GROWTH"), text: text(71) },
        { label: copy("人生选择", "LIFE DECISIONS"), text: text(73) },
      ],
    },
  ],
  closing: {
    title: copy("一封只属于你的塔罗来信", "A PRIVATE MOMENT, JUST FOR YOU"),
    tagline: copy(
      "写下你的疑问，收获一份专属于你的塔罗解读。",
      "YOUR QUESTIONS. YOUR STORY. YOUR PERSONAL TAROT READING.",
    ),
    paragraphs: [77, 78, 79].map(text),
    disclaimer: text(86),
  },
};
