import { shuffleCards } from '@/lib/tarot/shuffle';
import type { TarotCard } from '../data/tarotData';
import type { ReadingSpread } from '../data/reading-spreads';
import { cardElement } from './card-catalog';

export type DrawnThothCard = {card:TarotCard; reversed:boolean};
export type Dignity = 'well'|'ill'|'neutral'|'none';

export function prepareThothDeck(cards:readonly TarotCard[], allowReversals:boolean, random:()=>number=Math.random):DrawnThothCard[] {
  return shuffleCards(cards,random).map(card=>({card,reversed:allowReversals && random()<0.5}));
}

const relations:Record<string,{friendly:string;hostile:string}> = {
  fire:{friendly:'air',hostile:'water'},air:{friendly:'fire',hostile:'earth'},
  water:{friendly:'earth',hostile:'fire'},earth:{friendly:'water',hostile:'air'},
};

// Match the reference: cardinal grid adjacency; Majors neither receive nor modify dignity.
export function readingDignities(drawn:readonly DrawnThothCard[],spread:ReadingSpread):Dignity[] {
  return drawn.map(({card},index)=>{
    if (card.arcana==='Major') return 'none';
    const element = cardElement(card);
    const rule = relations[element];
    let well=0,ill=0;
    drawn.forEach(({card:other},neighbor)=>{
      if (neighbor===index || other.arcana==='Major') return;
      const a=spread.positions[index],b=spread.positions[neighbor];
      const adjacent = spread.successive ? Math.abs(index-neighbor)===1
        : !!a && !!b && Math.abs(a.col-b.col)+Math.abs(a.row-b.row)===1;
      if (!adjacent) return;
      const otherElement=cardElement(other);
      if (element===otherElement) well+=2;
      else if (rule.friendly===otherElement) well++;
      else if (rule.hostile===otherElement) ill++;
    });
    return well>ill ? 'well' : ill>well ? 'ill' : 'neutral';
  });
}
