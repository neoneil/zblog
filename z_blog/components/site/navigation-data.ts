import { products, productHref } from "@/features/services/lib/catalog";
import type { LocalizedCopy } from "./preferences-provider";

export type NavigationLink = { label: LocalizedCopy; href: string; localizedQuery?: boolean };
export type NavigationEntry = { id: string; label: LocalizedCopy; href?: string; children?: NavigationLink[] };

export const siteNavigation: NavigationEntry[] = [
  { id: "home", label: { en: "HOME", zh: "首页" }, href: "/" },
  { id: "stories", label: { en: "STARDUST STORIES", zh: "星尘物语" }, href: "/tarot-novel" },
  {
    id: "archive", label: { en: "THE ESOTERIC ARCHIVE", zh: "秘学之源" }, children: [
      { label: { en: "TREE OF LIFE", zh: "生命之树" }, href: "/thoth/tree-of-life", localizedQuery: true },
      { label: { en: "THOTH WISDOM", zh: "透特奥义" }, href: "/thoth/tarot", localizedQuery: true },
      { label: { en: "ASTROLOGY", zh: "占星术" }, href: "/thoth/astrology", localizedQuery: true },
      { label: { en: "ESOTERIC LIBRARY", zh: "秘学藏书阁" }, href: "/thoth/library", localizedQuery: true },
    ],
  },
  {
    id: "tarot", label: { en: "TAROT", zh: "塔罗神谕" }, children: [
      { label: { en: "RIDER–WAITE READING", zh: "韦特占卜" }, href: "/tarot-ai" },
      { label: { en: "RIDER–WAITE LIBRARY", zh: "韦特秘典" }, href: "/feishu-docs" },
      { label: { en: "THOTH TAROT READING", zh: "透特占卜" }, href: "/thoth-tarot/readings", localizedQuery: true },
      { label: { en: "THOTH TAROT LIBRARY", zh: "透特秘典" }, href: "/thoth-tarot" },
    ],
  },
  {
    id: "blueprints", label: { en: "COSMIC BLUEPRINTS", zh: "星图与命数" }, children: [
      { label: { en: "NATAL CHART", zh: "本命星图" }, href: "/astroplate" },
      { label: { en: "SYNASTRY", zh: "双人合盘" }, href: "/synastry" },
      { label: { en: "STELLAR BIRTH CHART", zh: "星辰命盘" }, href: "/stella" },
      { label: { en: "NUMEROLOGY", zh: "生命灵数" }, href: "/stella/numerology" },
    ],
  },
  {
    id: "celestial", label: { en: "CELESTIAL INSIGHTS", zh: "星象与天机" }, children: [
      { label: { en: "STELLAR EXPLORER", zh: "星象天机" }, href: "/categories/understanding-children" },
      { label: { en: "ZODIAC SIGNS", zh: "黄道十二宫" }, href: "/stella/zodiac" },
      { label: { en: "HOROSCOPES", zh: "星辰运势" }, href: "/stella/horoscope" },
      { label: { en: "LEARNING VIDEOS", zh: "星学影苑" }, href: "/parentinglab/healingdaily/videos?category=general" },
    ],
  },
  { id: "shop", label: { en: "SHOP", zh: "奥秘商店" }, children: products.map(product => ({ label: product.title, href: productHref(product) })) },
  { id: "community", label: { en: "COMMUNITY", zh: "社群" }, href: "/community" },
  { id: "contact", label: { en: "CONTACT US", zh: "联系我们" }, children: [
    { label: { en: "ONLINE CLASS", zh: "在线课堂" }, href: "/classroom" },
    { label: { en: "ABOUT US", zh: "关于我们" }, href: "/aboutus" },
    { label: { en: "SEND A MESSAGE", zh: "星语传讯" }, href: "/contact" },
    { label: { en: "NEWSLETTER", zh: "订阅更新" }, href: "/#home-newsletter" },
  ] },
];
