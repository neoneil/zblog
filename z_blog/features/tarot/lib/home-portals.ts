import { getProduct, productHref } from "@/features/services/lib/catalog";
import { tarotCollections, tarotEntries } from "./entry-catalog";

const email = getProduct("personal-tarot-email");
const voice = getProduct("tarot-reading");
if (!email || !voice)
  throw new Error(
    "The tarot home entries require the existing email and voice products.",
  );

export const tarotHomePortals = [
  {
    id: "online",
    title: tarotCollections.readings.title,
    description: {
      zh: "即时解读 · 快速指引",
      en: "Instant insight · Clear guidance",
    },
    image: tarotEntries[0].image,
    href: tarotCollections.readings.href,
    action: { zh: "立即测算", en: "Start reading" },
    containImage: false,
  },
  {
    id: "email",
    title: email.title,
    description: email.intro,
    image: email.image,
    href: productHref(email),
    action: { zh: "邮件咨询", en: "Email reading" },
    containImage: true,
  },
  {
    id: "voice",
    title: voice.title,
    description: voice.intro,
    image: voice.image,
    href: productHref(voice),
    action: { zh: "立即预约", en: "View consultation" },
    containImage: true,
  },
  {
    id: "library",
    title: tarotCollections.library.title,
    description: {
      zh: "系统课程 · 图文精解",
      en: "Structured study · Illustrated wisdom",
    },
    image: tarotEntries[1].image,
    href: tarotCollections.library.href,
    action: { zh: "了解更多", en: "Explore meanings" },
    containImage: false,
  },
];
