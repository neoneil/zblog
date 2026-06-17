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
};

export const categories: CategoryItem[] = [
  {
    slug: "understanding-children",
    title: {
      zh: "理解儿童",
      en: "Understanding Children",
    },
    description: {
      zh: "理解游戏为什么对幼儿发展至关重要，也更细腻地看见儿童的情绪需要。",
      en: "Why play is essential for early childhood development and how to better understand children’s emotional needs.",
    },
    backgroundImage: "/category-cards/understanding-bg.png",
    buttonVariant: "green",
  },
  {
    slug: "teaching-practice",
    title: {
      zh: "教学实践",
      en: "Teaching Practice",
    },
    description: {
      zh: "记录以游戏为本的学习、课堂策略，以及如何设计更有意义的学习经验。",
      en: "Reflections on play-based learning, classroom strategies, and designing meaningful learning experiences.",
    },
    backgroundImage: "/category-cards/teaching-bg.png",
    buttonVariant: "gold",
  },
  {
    slug: "family-education",
    title: {
      zh: "家庭教育",
      en: "Family Education",
    },
    description: {
      zh: "分享父母如何在家庭中支持学习，并建立积极的家园合作关系。",
      en: "Ideas on how parents can support learning at home and build positive parent-teacher partnerships.",
    },
    backgroundImage: "/category-cards/family-bg.png",
    buttonVariant: "blue",
  },
  {
    slug: "teacher-reflection",
    title: {
      zh: "教师反思",
      en: "Teacher Reflection",
    },
    description: {
      zh: "留给反思性实践、身心照顾，以及在幼教工作中培养耐心与成长的空间。",
      en: "A space for reflective practice, mindful self-care, and cultivating patience and growth in childcare.",
    },
    backgroundImage: "/category-cards/reflection-bg.png",
    buttonVariant: "rose",
  },
];
