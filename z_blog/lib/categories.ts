type LocalizedCategoryCopy = {
  zh: string;
  en: string;
};

export type CategoryItem = {
  slug: string;
  title: LocalizedCategoryCopy;
  description: LocalizedCategoryCopy;
  backgroundImage: string;
  buttonVariant: "green" | "gold" | "blue" | "rose";
  href?: string;
};

export const categories: CategoryItem[] = [
  {
    slug: "understanding-children",
    title: {
      zh: " Stella 独家占星工具",
      en: "Stella Astrology Tools",
    },
    description: {
      zh: "从出生星盘、星座配对到月亮日历、生命数字与日月食，探索十一项占星工具。",
      en: "Explore eleven astrology tools, from birth charts and compatibility to moon calendars, numerology and eclipses.",
    },
    backgroundImage: "/category-cards/understanding-bg.png",
    buttonVariant: "green",
  },
  {
    slug: "teaching-practice",
    href: "/stella/zodiac",
    title: {
      zh: "十二星座",
      en: "Zodiac Signs",
    },
    description: {
      zh: "认识十二星座的性格、优势与成长课题，探索太阳、月亮、上升星座及星座配对。",
      en: "Discover all twelve zodiac signs, their personalities, strengths and growth themes, with Sun, Moon, Rising and compatibility insights.",
    },
    backgroundImage: "/category-cards/teaching-bg.png",
    buttonVariant: "gold",
  },
  {
    slug: "family-education",
    href: "/stella/horoscope",
    title: {
      zh: "星座运势",
      en: "Horoscopes",
    },
    description: {
      zh: "阅读十二星座的每日、每月与年度运势，关注关系、事业、个人成长与重要星象日期。",
      en: "Read daily, monthly and yearly horoscopes for all twelve signs, exploring relationships, career, personal growth and key astrological dates.",
    },
    backgroundImage: "/category-cards/family-bg.png",
    buttonVariant: "blue",
  },
  {
    slug: "teacher-reflection",
    title: {
      zh: "书写你的内心世界",
      en: "Write Your inner World",
    },
    description: {
      zh: "留给反思性实践、身心照顾，以及在幼教工作中培养耐心与成长的空间。",
      en: "A space for reflective practice, mindful self-care, and cultivating patience and growth in childcare.",
    },
    backgroundImage: "/category-cards/reflection-bg.png",
    buttonVariant: "rose",
  },
];
