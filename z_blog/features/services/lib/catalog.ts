import type { LocalizedCopy as Copy } from "@/components/site/preferences-provider";

export type Product = {
  id: string;
  slug: string;
  title: Copy;
  image: string;
  priceCents: number;
  category: "courses" | "readings" | "physical";
  date: string;
  intro: Copy;
  sections: { title: Copy; paragraphs?: Copy[]; bullets?: Copy[] }[];
};
const legacyProducts: Product[] = [
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

const offerings = [
  { id: legacyProducts[0].id, slug: legacyProducts[0].slug, category: "courses", image: "zhanxingyanxi", priceCents: 29900, title: { en: "ASTROLOGY COURSES", zh: "占星研习" }, intro: { en: "Explore Astrology Through Live, One-on-One Online Lessons with Professional Astrologers — Learn at Your Own Pace and Unlock Cosmic Wisdom.", zh: "与专业占星师一对一在线实时授课，按照自己的节奏探索占星奥秘，开启星象智慧之旅。" } },
  { id: legacyProducts[1].id, slug: legacyProducts[1].slug, category: "readings", image: "chart-consultation", priceCents: 18900, title: { en: "CHART CONSULTATION", zh: "星盘咨询" }, intro: { en: "Explore Your Birth Chart Through Live, One-on-One Online Consultations with Professional Astrologers — Discover Cosmic Insights and Gain Deeper Self-Understanding.", zh: "与专业占星师一对一在线实时咨询，深入解读个人星盘，探索星象奥秘，开启更深层的自我认知之旅。" } },
  { id: "tarot-course", slug: "tarot-course", category: "courses", image: "tarot-course", priceCents: 24900, title: { en: "TAROT COURSES", zh: "塔罗研习" }, intro: { en: "Explore Tarot Through Live, One-on-One Online Lessons with Professional Tarot Readers — Learn at Your Own Pace and Unlock Tarot Wisdom.", zh: "与专业塔罗师一对一在线实时授课，按照自己的节奏探索塔罗奥秘，开启塔罗智慧之旅。" } },
{ id: legacyProducts[2].id, slug: legacyProducts[2].slug, category: "readings", image: "taoluozixun", priceCents: 14378, title: { en: "TAROT CONSULTATION", zh: "塔罗咨询" }, intro: { en: "Explore Tarot Through Live, One-on-One Online Consultations with Professional Tarot Readers — Gain Clarity, Discover New Perspectives, and Find Guidance for Your Journey.", zh: "与专业塔罗师一对一在线实时咨询，探索塔罗智慧，获得清晰洞察与全新视角，为人生旅程寻找指引。" } },
  { id: "celestial-jewelry", slug: "celestial-jewelry", category: "physical", image: "celestial-jewelry", priceCents: 6900, title: { en: "Celestial Jewelry", zh: "星辰首饰" }, intro: { en: "Jewelry inspired by celestial symbols. Materials, sizing and availability will be confirmed before ordering opens.", zh: "以星辰符号为灵感的首饰。材质、尺寸及供货信息将在开放购买前确认。" } },
  { id: "mystic-fragrances", slug: "mystic-fragrances", category: "physical", image: "mystic-fragrances", priceCents: 4900, title: { en: "Mystic Fragrances", zh: "神秘香氛" }, intro: { en: "Fragrances inspired by the mysteries. Ingredients, sizes and product details will be confirmed before ordering opens.", zh: "以神秘意象为灵感的香氛。成分、规格及商品详情将在开放购买前确认。" } },
  { id: "arcane-creations", slug: "arcane-creations", category: "physical", image: "arcane-creations", priceCents: 3900, title: { en: "Arcane Creations", zh: "神秘文创" }, intro: { en: "Creative objects inspired by tarot and the stars. Final designs and specifications will be confirmed before ordering opens.", zh: "以塔罗与星辰为灵感的文创商品。最终设计及规格将在开放购买前确认。" } },
] satisfies Omit<Product, "date" | "sections">[];

export const products: Product[] = offerings.map((item, index) => ({
  ...item, image: `/products/${item.image}.png`, date: `2026-01-0${index + 1}`,
  sections: [{ title: { en: "Details & Arrangements", zh: "详情与安排" }, paragraphs: [item.intro, { en: "This is a product preview with an example AUD price. Checkout is not available yet. Contact us for availability, booking or delivery details.", zh: "目前为商品预览，AUD 价格仅为示例，尚未开放结算。课程预约、供货与配送安排请联系我们确认。" }] }],
}));

export const getProduct = (id: string) =>
  products.find((product) => product.id === id);
export const productHref = (product: Product) => `/services/${product.slug}`;
export const formatPrice = (cents: number, language = "en") =>
  new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-AU", {
    style: "currency",
    currency: "AUD",
    currencyDisplay: "code",
  }).format(cents / 100);
export type ProductFilter = "all" | "courses" | "readings" | "physical";
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
