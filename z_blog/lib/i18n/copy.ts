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
  navFeishuDocs: { zh: "飞书文档", en: "Feishu Docs" },
  navMembership: { zh: "成为会员", en: "Become a Member" },
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
      { label: { zh: "理解儿童", en: "Understanding Children" }, href: "/categories/understanding-children" },
      { label: { zh: "教学实践", en: "Teaching Practice" }, href: "/categories/teaching-practice" },
      { label: { zh: "家庭教育", en: "Family Education" }, href: "/categories/family-education" },
      { label: { zh: "教师反思", en: "Teacher Reflection" }, href: "/categories/teacher-reflection" },
    ],
  },
  {
    title: { zh: "探索", en: "Explore" },
    links: [
      { label: { zh: "最新文章", en: "Latest Posts" }, href: "/posts" },
      { label: { zh: "塔罗牌库", en: "Tarot Library" }, href: "/tarot" },
      { label: { zh: "资源中心", en: "Resources" }, href: "/resources" },
      { label: { zh: "飞书文档", en: "Feishu Docs" }, href: "/feishu-docs" },
    ],
  },
  {
    title: { zh: "社区", en: "Community" },
    links: [
      { label: { zh: "亲子实验室", en: "Parenting Lab" }, href: "/parentinglab" },
      { label: { zh: "每日疗愈视频", en: "Healing Daily" }, href: "/parentinglab/healingdaily/videos" },
      { label: { zh: "在线课堂", en: "Online Class" }, href: "/classroom" },
      { label: { zh: "订阅通讯", en: "Newsletter" }, href: "/newsletter" },
    ],
  },
  {
    title: { zh: "关于", en: "About" },
    links: [
      { label: { zh: "关于我们", en: "About Us" }, href: "/aboutus" },
      { label: { zh: "成为会员", en: "Membership" }, href: "/pricing" },
      { label: { zh: "星盘解析", en: "Natal Chart" }, href: "/astroplate" },
      { label: { zh: "塔罗 AI", en: "Tarot AI" }, href: "/tarot-ai" },
    ],
  },
  {
    title: { zh: "更多", en: "More" },
    links: [
      { label: { zh: "课堂通知", en: "Class Notices" }, href: "/classroom/notifications" },
      { label: { zh: "登录", en: "Log in" }, href: "/login" },
      { label: { zh: "注册", en: "Sign up" }, href: "/sign-up" },
      { label: { zh: "首页", en: "Home" }, href: "/" },
    ],
  },
] as const;
