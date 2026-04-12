export type CategoryItem = {
  slug: string;
  title: string;
  description: string;
  backgroundImage: string;
  buttonVariant: "green" | "gold" | "blue" | "rose";
};

export const categories: CategoryItem[] = [
  {
    slug: "understanding-children",
    title: "Understanding Children",
    description:
      "Why play is essential for early childhood development and how to better understand children’s emotional needs.",
    backgroundImage: "/category-cards/understanding-bg.png",
    buttonVariant: "green",
  },
  {
    slug: "teaching-practice",
    title: "Teaching Practice",
    description:
      "Reflections on play-based learning, classroom strategies, and designing meaningful learning experiences.",
    backgroundImage: "/category-cards/teaching-bg.png",
    buttonVariant: "gold",
  },
  {
    slug: "family-education",
    title: "Family Education",
    description:
      "Ideas on how parents can support learning at home and build positive parent-teacher partnerships.",
    backgroundImage: "/category-cards/family-bg.png",
    buttonVariant: "blue",
  },
  {
    slug: "teacher-reflection",
    title: "Teacher Reflection",
    description:
      "A space for reflective practice, mindful self-care, and cultivating patience and growth in childcare.",
    backgroundImage: "/category-cards/reflection-bg.png",
    buttonVariant: "rose",
  },
];