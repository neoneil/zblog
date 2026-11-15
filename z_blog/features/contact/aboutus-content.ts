import type { LocalizedCopy } from "@/components/site/preferences-provider";
import { aboutUsCopy } from "./aboutus-copy";

const c = (zh: string, en: string): LocalizedCopy => ({ zh, en });
function text(id: number): LocalizedCopy {
  const row = aboutUsCopy.find((item) => item.id === id);
  if (!row) throw new Error(`Missing About Us copy: ${id}`);
  if (id === 15)
    return c(
      row.zh,
      "One side of me is rooted in reality. The other looks to the stars.",
    );
  if (id === 36) return c(row.zh, "One side of me is rooted in reality.");
  if (id === 37) return c(row.zh, "The other looks to the stars.");
  return c(row.zh, row.en);
}
function paragraph(ids: number[]): LocalizedCopy {
  return c(
    ids.map((id) => text(id).zh).join(""),
    ids.map((id) => text(id).en).join(" "),
  );
}

export const aboutUsContent = {
  title: c("两个我，一个宇宙。", "TWO SIDES OF ME, ONE UNIVERSE."),
  declaration: text(15),
  promise: text(17),
  reflection: text(21),
  portrait: {
    title: c(
      "现实中的我，与灵魂深处的另一个我",
      "THE WOMAN I AM & THE SOUL WITHIN",
    ),
    paragraphs: [
      [29, 30, 31],
      [32, 33, 34, 35],
      [36, 37, 38, 39],
    ].map(paragraph),
  },
  purpose: {
    title: c("为什么创立星辰之巢？", "WHY I CREATED STELLARNESTS"),
    paragraphs: [
      [44, 45],
      [46, 47, 48, 49, 50],
      [51, 52, 53, 54, 55, 56, 57],
    ].map(paragraph),
    moreTitle: c("不止于塔罗与占星", "MORE THAN TAROT & ASTROLOGY"),
    moreIntroduction: paragraph([60, 61]),
    experiences: [
      { copy: text(62), href: "/parentinglab/asktarotmom" },
      { copy: text(63), href: "/stella" },
      { copy: text(64), href: "/services/personal-tarot-reading-by-email" },
      { copy: text(65), href: "/tarot-novel" },
      { copy: text(66), href: "/services/mystic-fragrances" },
      { copy: text(67), href: "/services/lectures-and-mystic-salons" },
    ],
    invitation: text(68),
  },
  letter: {
    title: c("写给每一位来到这里的你", "A LETTER FROM ME TO YOU"),
    salutation: text(73),
    paragraphs: [
      [74, 75, 76],
      [77, 78, 79, 80, 81, 82],
      [83, 84, 85, 86, 87],
      [88, 89, 90, 91],
      [92, 93],
    ].map(paragraph),
    signoff: c("怀着温暖，", "With warmth,"),
    signature: c("星辰之巢创始人", "The Founder of STELLARNESTS"),
  },
};
