export const wishLimit = 100;
const words = new Intl.Segmenter("en", { granularity: "word" });

export function limitWish(value: string) {
  let count = 0;
  for (const { segment, index, isWordLike } of words.segment(value)) {
    if (!isWordLike) continue;
    const hanCharacters = [...segment.matchAll(/\p{Script=Han}/gu)];
    const length = hanCharacters.length || 1;
    if (count + length > wishLimit) {
      const cutoff = hanCharacters[wishLimit - count]?.index ?? 0;
      return { value: value.slice(0, index + cutoff).trimEnd(), count: wishLimit };
    }
    count += length;
  }

  return { value, count };
}

