import { signSlugs, type Copy } from "./explore-config";
import { SIGN_NAMES, SIGN_SYMBOLS } from "./sky";

export const zodiacLinks = signSlugs.map((slug, index) => ({
  href: `/stella/zodiac/${slug}`,
  label: {
    en: `${SIGN_SYMBOLS[index]} ${SIGN_NAMES.en[index]}`,
    zh: `${SIGN_SYMBOLS[index]} ${SIGN_NAMES.zh[index]}`,
  } satisfies Copy,
}));
export function horoscopeLinks(year: number) {
  return [
    {
      href: "/stella/horoscope",
      label: { en: "Today's Horoscope", zh: "今日运势" },
    },
    {
      href: "/stella/horoscope/monthly",
      label: { en: "Monthly Horoscope", zh: "每月运势" },
    },
    {
      href: "/stella/horoscope/yearly",
      label: { en: `${year} Yearly Horoscope`, zh: `${year}年度运势` },
    },
    ...signSlugs
      .slice(0, 4)
      .map((slug, index) => ({
        href: `/stella/horoscope/${slug}`,
        label: {
          en: `${SIGN_NAMES.en[index]} Horoscope`,
          zh: `${SIGN_NAMES.zh[index]}运势`,
        },
      })),
  ];
}
