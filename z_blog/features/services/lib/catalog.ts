import type { LocalizedCopy as Copy } from "@/components/site/preferences-provider";

export type Product = {
  id: string;
  slug: string;
  title: Copy;
  image: string;
  priceCents: number;
  category: "courses" | "readings";
  date: string;
  intro: Copy;
  sections: { title: Copy; paragraphs?: Copy[]; bullets?: Copy[] }[];
};
export const products: Product[] = [
  {
    id: "transits-course",
    slug: "astrological-forecasting-with-transits",
    category: "courses",
    date: "2026-01-01",
    priceCents: 52900,
    title: {
      en: "Astrological Forecasting with Transits Online Course",
      zh: "行运占星预测线上课程",
    },
    image: "/category-cards/family-bg.png",
    intro: {
      en: "A five-part recorded course exploring how planetary transits and solar returns can be organised into a thoughtful forecasting framework. Approximately twelve hours of material, with worked chart examples.",
      zh: "五部分录播课程，探索如何把行星行运与太阳返照组织成清晰的预测框架。约十二小时内容，结合星盘实例展开学习。",
    },
    sections: [
      {
        title: { en: "Course Content", zh: "课程内容" },
        bullets: [
          {
            en: "Planetary cycles, aspects and their relationship to natal placements.",
            zh: "行星周期、相位及其与本命配置的关系。",
          },
          {
            en: "House transits, planetary groups, the nodes and Chiron.",
            zh: "行运穿越宫位、不同类型行星、交点与凯龙星。",
          },
          {
            en: "Fast and slow transits, retrogrades, lunar phases and eclipses.",
            zh: "快速与缓慢行运、逆行、月相与食相。",
          },
          {
            en: "Solar-return charts, annual priorities, chart software and responsible interpretation.",
            zh: "太阳返照盘、年度重点、星盘软件与负责任的解读。",
          },
        ],
      },
      {
        title: { en: "Who Is This Course For?", zh: "适合谁学习？" },
        paragraphs: [
          {
            en: "Intermediate students who already understand planets, zodiac signs, houses, aspects and basic ephemeris use. Familiarity with natal-chart interpretation is recommended.",
            zh: "适合已经了解行星、星座、宫位、相位与基础星历使用方法的进阶学习者，建议具备本命盘解读基础。",
          },
        ],
      },
      {
        title: { en: "Course Access", zh: "课程获取" },
        paragraphs: [
          {
            en: "Delivery details will be confirmed before paid enrolment opens. You can contact us with questions about the course or its prerequisites.",
            zh: "付费报名开放前将确认课程交付安排。如有课程内容或学习基础方面的问题，欢迎联系我们。",
          },
        ],
      },
    ],
  },
  {
    id: "natal-masterclass",
    slug: "natal-chart-interpretation-masterclass",
    category: "courses",
    date: "2026-02-01",
    priceCents: 31900,
    title: {
      en: "Natal Chart Interpretation Masterclass",
      zh: "本命星盘解读大师课",
    },
    image: "/astroplate3.png",
    intro: {
      en: "A two-part recorded class with more than six hours of study, focused on bringing separate chart factors into a coherent interpretation.",
      zh: "两部分录播大师课，学习时长超过六小时，重点练习如何把分散的星盘因素整合成连贯的解读。",
    },
    sections: [
      {
        title: { en: "What You Will Explore", zh: "学习内容" },
        bullets: [
          {
            en: "Begin with the chart as a whole: elemental balance, prominent planets and the overall pattern.",
            zh: "从整体星盘开始：元素平衡、显著行星与整体模式。",
          },
          {
            en: "Connect rulership, aspects and aspect patterns with recurring life themes.",
            zh: "将守护关系、相位与相位格局连接到反复出现的生活主题。",
          },
          {
            en: "Develop an organised note-taking method and practise with examples.",
            zh: "建立有条理的笔记方法，通过实例进行练习。",
          },
          {
            en: "Build a repeatable reading structure while recognising the limits of interpretation.",
            zh: "建立可重复运用的解盘结构，同时认识诠释的边界。",
          },
        ],
      },
      {
        title: { en: "Who Is This Masterclass For?", zh: "适合谁学习？" },
        paragraphs: [
          {
            en: "Students who know the basic symbolism of planets, signs and houses and want to synthesise those building blocks. This is an intermediate class rather than an introduction to astrology.",
            zh: "适合掌握行星、星座与宫位基本象征，希望进一步整合这些知识的学习者。这是一门进阶课程，而非占星入门。",
          },
        ],
      },
      {
        title: { en: "Course Access", zh: "课程获取" },
        paragraphs: [
          {
            en: "Course availability and delivery will be confirmed before checkout opens. Ask us if you are unsure whether this is the right next step for your studies.",
            zh: "结算开放前将确认课程可用时间与交付方式。如果不确定是否适合目前的学习阶段，可以先联系我们。",
          },
        ],
      },
    ],
  },
  {
    id: "tarot-reading",
    slug: "tarot-reading",
    category: "readings",
    date: "2026-03-01",
    priceCents: 14378,
    title: { en: "Tarot Reading", zh: "塔罗解读" },
    image: "/tarotCover.png",
    intro: {
      en: "A thirty-minute video conversation centred on a question or area of life you would like to explore. Tarot imagery offers a starting point for reflection, perspective and a clearer conversation with yourself.",
      zh: "三十分钟视频交流，围绕你想探索的问题或生活领域展开。塔罗图像为反思、拓展视角及更清晰的自我对话提供起点。",
    },
    sections: [
      {
        title: { en: "Your Session", zh: "你的解读" },
        paragraphs: [
          {
            en: "Bring a clear question and enough context to make the discussion useful. The session focuses on exploring possibilities rather than promising a fixed outcome.",
            zh: "带着清晰的问题与适当背景信息参与交流。解读侧重探索可能性，而不承诺某个确定结果。",
          },
        ],
      },
      {
        title: { en: "Booking & Rescheduling", zh: "预约与改期" },
        paragraphs: [
          {
            en: "Appointment availability, video-call arrangements and rescheduling terms will be confirmed before paid bookings become available. For now, use our contact form to ask about the service.",
            zh: "付费预约开放前，将确认可预约时间、视频通话安排与改期条款。目前可以通过联系表单咨询服务。",
          },
        ],
      },
      {
        title: { en: "A Reflective Practice", zh: "用于自我探索" },
        paragraphs: [
          {
            en: "Tarot is an interpretive practice, not a substitute for professional advice or a guarantee of future events. Your choices remain your own.",
            zh: "塔罗是一种诠释性实践，不替代专业建议，也不保证未来事件。你始终保有自己的选择。",
          },
        ],
      },
    ],
  },
];

export const getProduct = (id: string) =>
  products.find((product) => product.id === id);
export const productHref = (product: Product) => `/services/${product.slug}`;
export const formatPrice = (cents: number, language = "en") =>
  new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-AU", {
    style: "currency",
    currency: "AUD",
    currencyDisplay: "code",
  }).format(cents / 100);
export type ProductFilter = "all" | "courses" | "readings";
export type ProductSort =
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc";
export function selectProducts(filter: ProductFilter, sort: ProductSort) {
  const selected = products.filter(
    (product) => filter === "all" || product.category === filter,
  );
  return selected.sort((a, b) => {
    if (sort.startsWith("price"))
      return (a.priceCents - b.priceCents) * (sort === "price-asc" ? 1 : -1);
    if (sort.startsWith("date"))
      return a.date.localeCompare(b.date) * (sort === "date-asc" ? 1 : -1);
    return (
      a.title.en.localeCompare(b.title.en, "en") *
      (sort === "title-desc" ? -1 : 1)
    );
  });
}
