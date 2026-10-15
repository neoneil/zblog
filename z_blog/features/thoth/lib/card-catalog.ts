import { tarotData, type TarotCard } from '../data/tarotData';
import authorizedMeanings from '../data/authorized-card-meanings.json';
import { cardMeaningsZh } from '../data/card-meanings-zh';

const ranks: Record<string, string> = {
  ace: 'Ace', two: '2', three: '3', four: '4', five: '5', six: '6',
  seven: '7', eight: '8', nine: '9', ten: '10',
  princess: 'Princess', prince: 'Prince', queen: 'Queen', knight: 'Knight',
};

export function cardImagePath(card: TarotCard) {
  if (card.arcana === 'Major') {
    const name = card.id === '2-the-high-priestess' ? 'The Priestess' : card.name.split(' (')[0];
    return `/Thoth_Tarot/Major cards/${name}.jpg`;
  }
  const rank = card.id.split('-')[0];
  // The supplied Cups/Wands Knight images are named King. Keep original assets intact.
  const imageRank = rank === 'knight' && (card.suit === 'Cups' || card.suit === 'Wands')
    ? 'King' : ranks[rank];
  return `/Thoth_Tarot/Minor Cards/${card.suit}/${imageRank} of ${card.suit}.jpg`;
}

export const cardGroups = [
  {id:'Major', zh:'大阿尔卡那', en:'Major Arcana'},
  {id:'Wands', zh:'权杖 · 火', en:'Wands · Fire'},
  {id:'Cups', zh:'圣杯 · 水', en:'Cups · Water'},
  {id:'Swords', zh:'宝剑 · 风', en:'Swords · Air'},
  {id:'Disks', zh:'圆盘 · 土', en:'Disks · Earth'},
];

const rankOrder = Object.keys(ranks);
export const catalogCards = cardGroups.flatMap(group => tarotData
  .filter(card => group.id === 'Major' ? card.arcana === 'Major' : card.suit === group.id)
  .sort((a,b) => group.id === 'Major' ? Number(a.id.split('-')[0])-Number(b.id.split('-')[0])
    : rankOrder.indexOf(a.id.split('-')[0])-rankOrder.indexOf(b.id.split('-')[0])));

export function cardSlug(card: TarotCard) {
  return card.id.replace(/^\d+-/, '').replace('the-high-priestess', 'the-priestess')
    .replace(/^(two|three|four|five|six|seven|eight|nine|ten)-/, rank=>`${ranks[rank.slice(0,-1)]}-`);
}

export function cardMeaning(card: TarotCard, language: 'zh' | 'en' = 'en') {
  const original = (authorizedMeanings as Record<string, {
    title:string; keywords:string[]; meaning:string[];
    wellDignified:string; illDignified:string; source:string;
  }>)[cardSlug(card)];
  return language === 'zh' ? {...original, ...cardMeaningsZh[cardSlug(card)]} : original;
}

export function cardElement(card: TarotCard) {
  if (card.suit) return {Wands:'fire',Cups:'water',Swords:'air',Disks:'earth'}[card.suit];
  const elements: Record<string,string> = {
    '0-the-fool':'air','1-the-magus':'air','2-the-high-priestess':'water',
    '3-the-empress':'earth','4-the-emperor':'fire','5-the-hierophant':'earth',
    '6-the-lovers':'air','7-the-chariot':'water','8-adjustment':'air',
    '9-the-hermit':'earth','10-fortune':'fire','11-lust':'fire',
    '12-the-hanged-man':'water','13-death':'water','14-art':'fire',
    '15-the-devil':'earth','16-the-tower':'fire','17-the-star':'air',
    '18-the-moon':'water','19-the-sun':'fire','20-the-aeon':'fire','21-the-universe':'earth',
  };
  return elements[card.id];
}
