import type { ServiceGuide } from "./service-guides";
import { specialProductsCopy } from "./special-products-copy";

const c = (zh: string, en: string) => ({ zh, en });
const text = (id: number) => {
  const row = specialProductsCopy.find((item) => item.id === id);
  if (!row) throw new Error(`Missing special product copy: ${id}`);
  return c(row.zh.replaceAll("LECTURAS / SALON", "讲座与沙龙"), row.en);
};
export const lecturesGuide: ServiceGuide = {
  tagline: c(
    "不止于聆听，更是一场关于星辰、命运与自我探索的相遇。",
    "ONLINE & IN-PERSON EXPERIENCES",
  ),
  introduction: [7, 8, 9, 10, 11, 12].map(text),
  sections: [
    {
      id: "ways-to-join",
      title: c("两种参与方式，自由探索", "TWO WAYS TO JOIN"),
      lists: [
        {
          title: c("线上主题讲座与沙龙", "ONLINE LECTURES & SALONS"),
          items: [17, 18, 19].map(text),
        },
        {
          title: c("线下主题讲座与私享沙龙", "IN-PERSON LECTURES & SALONS"),
          items: [21, 22, 23].map(text),
        },
      ],
    },
    {
      id: "event-themes",
      title: c("每月探索不同的神秘主题", "WHAT WILL YOU EXPLORE?"),
      highlights: [
        { label: c("塔罗智慧", "TAROT WISDOM"), text: text(28) },
        { label: c("占星与宇宙", "ASTROLOGY & THE COSMOS"), text: text(30) },
        { label: c("神话与奥秘", "MYTHS & MYSTERIES"), text: text(32) },
        { label: c("内在探索", "PERSONAL GROWTH"), text: text(34) },
        { label: c("特别主题沙龙", "SPECIAL THEMED SALONS"), text: text(36) },
      ],
    },
    {
      id: "monthly-events",
      title: c(
        "每月新主题，每次新体验",
        "NEW THEMES. NEW EXPERIENCES. EVERY MONTH.",
      ),
      paragraphs: [text(40), text(43), text(50), text(51)],
      highlights: [
        {
          label: c("活动主题与主要内容", "EVENT THEME"),
          text: c("待公布", "To be announced"),
        },
        {
          label: c("活动日期及具体时间", "DATE & TIME"),
          text: c("待公布", "To be announced"),
        },
        {
          label: c("线上或线下参与形式", "ONLINE / IN-PERSON"),
          text: c("每场活动单独确认", "Confirmed for each event"),
        },
        {
          label: c("地点或线上参与方式", "LOCATION"),
          text: c("待公布", "To be announced"),
        },
        {
          label: c("活动费用及报名信息", "TICKET PRICE"),
          text: c(
            "当前示例价 AUD 78，正式场次票价与报名安排待确认。",
            "Current preview price: AUD 78. Final event pricing and registration arrangements are awaiting confirmation.",
          ),
        },
        {
          label: c("剩余名额及报名截止时间", "AVAILABLE PLACES"),
          text: c(
            "待公布。",
            "To be announced.",
          ),
        },
      ],
      note: c(
        "首页浮动公告将提供活动信息入口。当前未发布具体活动场次，加入购物车仅为购买预览，不会预留席位、收取费用或发送确认邮件。",
        "The homepage floating announcement provides an entry to event information. No specific event has been published yet. Adding to cart is a purchase preview only: it does not reserve a place, take payment or send a confirmation email.",
      ),
    },
    {
      id: "event-booking",
      title: c("如何参加活动？", "HOW TO JOIN"),
      highlights: [
        { label: c("01 · 发现活动", "STEP 01 · DISCOVER"), text: text(56) },
        { label: c("02 · 选择活动", "STEP 02 · CHOOSE"), text: text(58) },
        { label: c("03 · 预约席位", "STEP 03 · RESERVE"), text: text(60) },
        { label: c("04 · 加入我们", "STEP 04 · JOIN US"), text: text(62) },
      ],
      paragraphs: [text(63)],
      note: c(
        "以上为正式活动发布后的参与流程；目前结算与活动确认邮件尚未启用。",
        "These steps describe participation after an event is officially published. Checkout and event confirmation emails are not enabled yet.",
      ),
    },
  ],
  closing: {
    title: c(
      "不只是一场活动，更是一处心灵与思想的相遇之地。",
      "MORE THAN AN EVENT. A PLACE TO BELONG.",
    ),
    tagline: c(
      "循着星光，赴一场属于你的神秘之约。",
      "FOLLOW THE STARS. DISCOVER YOUR NEXT GATHERING.",
    ),
    paragraphs: [67, 68, 69, 70].map(text),
    disclaimer: c(
      "讲座与沙龙用于文化学习、交流和自我探索，不保证任何超自然结果，也不替代专业建议。",
      "Lectures and salons offer cultural learning, conversation and self-exploration, not guaranteed supernatural outcomes or a substitute for professional advice.",
    ),
  },
};

export const soulSigilGuide: ServiceGuide = {
  tagline: c("觉醒灵魂的印记。", "The Mark of an Awakened Soul."),
  introduction: [text(85)],
  sections: [
    {
      id: "sigil-symbolism",
      title: c(
        "手臂图腾的五种象征意义",
        "Five Symbolic Meanings of an Arm Sigil",
      ),
      table: {
        columns: [
          c("象征", "Symbol"),
          c(
            "文化与神秘学创作中的常见解释",
            "Common Interpretation in Cultural and Esoteric Art",
          ),
        ],
        rows: [89, 91, 93, 95, 97].map((id) => [text(id), text(id + 1)]),
      },
      note: text(99),
    },
    {
      id: "sigil-arms",
      title: c(
        "图腾出现在不同手臂上的寓意",
        "Symbolism of the Left, Right and Both Arms",
      ),
      paragraphs: [text(101)],
      lists: [
        {
          title: c(
            "现代奇幻创作中的设计参考",
            "Design Ideas in Modern Fantasy Art",
          ),
          items: [102, 103, 104].map(text),
        },
      ],
      note: text(105),
    },
    {
      id: "sigil-story",
      title: c(
        "星魂图腾的三重象征",
        "STELLAR SOUL SIGIL · Three Layers of Meaning",
      ),
      paragraphs: [text(108), text(112)],
      highlights: [
        { label: c("星辰之力", "Celestial Connection"), text: text(109) },
        { label: c("灵魂觉醒", "Soul Awakening"), text: text(110) },
        { label: c("守护契约", "A Covenant of Guardianship"), text: text(111) },
      ],
    },
  ],
  closing: {
    title: c("星魂图腾", "STELLAR SOUL SIGIL"),
    tagline: c("觉醒灵魂的印记。", "The Mark of an Awakened Soul."),
    paragraphs: [text(112)],
    disclaimer: c(
      "这些说明属于品牌故事、文化象征与艺术创作，不代表超自然能力、医疗效果或所有传统共有的规则。具体商品形式与交付方式将另行确认。",
      "These descriptions belong to brand storytelling, cultural symbolism and artistic creation. They do not establish supernatural abilities, medical effects or universal rules across traditions. The product format and delivery arrangements will be confirmed separately.",
    ),
  },
};
