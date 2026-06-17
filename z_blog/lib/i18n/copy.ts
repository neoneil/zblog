import type { LocalizedCopy } from "@/components/site/preferences-provider";

export const siteCopy = {
  brand: { zh: "星语童年", en: "Cosmic Childhood" },
  navHome: { zh: "首页", en: "Home" },
  navCategories: { zh: "主要分类", en: "Categories" },
  navResources: { zh: "资源", en: "Resources" },
  navAbout: { zh: "关于我们", en: "About" },
  navAstroplate: { zh: "星盘解析", en: "Natal Chart" },
  navTarot: { zh: "塔罗 AI", en: "Tarot AI" },
  navTarotLibrary: { zh: "塔罗牌库", en: "Tarot Library" },
  navClassroom: { zh: "在线课堂", en: "Online Class" },
  navAdmin: { zh: "管理后台", en: "Admin" },
  navLogin: { zh: "登录", en: "Log in" },
  navSignup: { zh: "注册", en: "Sign up" },
  heroBadge: { zh: "星语童年", en: "Cosmic Childhood" },
  heroTitleLineOne: { zh: "用智慧、自然与星辰", en: "Wisdom, nature, and the stars" },
  heroTitleLineTwo: { zh: "陪伴孩子成长", en: "for a child's growing world" },
  heroDescription: {
    zh: "一个关于幼儿教育、创意学习与星象育儿的温柔空间。",
    en: "A gentle space for early learning, creative growth, and cosmic parenting.",
  },
  heroPrimaryCta: { zh: "开始阅读", en: "Start reading" },
  heroSecondaryCta: { zh: "浏览分类", en: "Browse categories" },
  footerDescription: {
    zh: "一个关于童年、学习、情绪与想象力的温柔空间。",
    en: "A gentle space for childhood, learning, emotional wisdom, and imagination.",
  },
  footerRights: { zh: "保留所有权利。", en: "All rights reserved." },
  footerBuiltBy: { zh: "制作：", en: "Built by " },
} satisfies Record<string, LocalizedCopy>;

export const footerColumns = [
  {
    title: { zh: "主要分类", en: "Categories" },
    links: [
      { label: { zh: "理解儿童", en: "Understanding Children" }, href: "/" },
      { label: { zh: "学习与教育", en: "Learning & Education" }, href: "/" },
      { label: { zh: "情绪智慧", en: "Emotional Wisdom" }, href: "/" },
      { label: { zh: "宇宙想象", en: "Cosmic Imagination" }, href: "/" },
    ],
  },
  {
    title: { zh: "探索", en: "Explore" },
    links: [
      { label: { zh: "最新文章", en: "Latest Posts" }, href: "/" },
      { label: { zh: "精选主题", en: "Featured Topics" }, href: "/" },
      { label: { zh: "资源", en: "Resources" }, href: "/" },
      { label: { zh: "阅读指南", en: "Reading Guide" }, href: "/" },
    ],
  },
  {
    title: { zh: "社区", en: "Community" },
    links: [
      { label: { zh: "合作伙伴", en: "Partners" }, href: "/" },
      { label: { zh: "协作者", en: "Collaborators" }, href: "/" },
      { label: { zh: "特邀作者", en: "Guest Writers" }, href: "/" },
      { label: { zh: "订阅通讯", en: "Newsletter" }, href: "/" },
    ],
  },
  {
    title: { zh: "关于", en: "About" },
    links: [
      { label: { zh: "我们的故事", en: "Our Story" }, href: "/" },
      { label: { zh: "使命", en: "Mission" }, href: "/" },
      { label: { zh: "联系", en: "Contact" }, href: "/" },
      { label: { zh: "支持", en: "Support" }, href: "/" },
    ],
  },
  {
    title: { zh: "更多", en: "More" },
    links: [
      { label: { zh: "隐私", en: "Privacy" }, href: "/" },
      { label: { zh: "条款", en: "Terms" }, href: "/" },
      { label: { zh: "常见问题", en: "FAQ" }, href: "/" },
      { label: { zh: "首页", en: "Home" }, href: "/" },
    ],
  },
] as const;
