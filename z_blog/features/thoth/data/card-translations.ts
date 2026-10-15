import type { TarotCard } from './tarotData';
import { translateTerm } from './translations';

const ranks: Record<string,string> = {ace:'王牌',two:'二',three:'三',four:'四',five:'五',six:'六',seven:'七',eight:'八',nine:'九',ten:'十',knight:'骑士',queen:'女王',prince:'王子',princess:'公主'};
const suits: Record<string,string> = {wands:'权杖',cups:'圣杯',swords:'宝剑',disks:'圆盘'};
const keywords: Record<string,string> = {Dominion:'统治',Virtue:'美德',Completion:'完成',Strife:'纷争',Victory:'胜利',Valour:'勇气',Swiftness:'迅捷',Strength:'力量',Oppression:'压迫',Love:'爱',Abundance:'丰盛',Luxury:'奢华',Disappointment:'失望',Pleasure:'愉悦',Debauch:'放纵',Indolence:'怠惰',Happiness:'幸福',Satiety:'饱和',Peace:'和平',Sorrow:'悲伤',Truce:'休战',Defeat:'失败',Science:'科学',Futility:'徒劳',Interference:'干扰',Cruelty:'残酷',Ruin:'毁灭',Change:'变化',Work:'工作',Power:'力量',Worry:'忧虑',Success:'成功',Failure:'失败',Prudence:'谨慎',Gain:'收获',Wealth:'财富'};
const majorNames: Record<string,string> = {'0-the-fool':'愚者','1-the-magus':'魔术师','2-the-high-priestess':'女祭司','3-the-empress':'女皇','4-the-emperor':'皇帝','5-the-hierophant':'教皇','6-the-lovers':'恋人','7-the-chariot':'战车','8-adjustment':'调整','9-the-hermit':'隐士','10-fortune':'命运','11-lust':'欲望','12-the-hanged-man':'倒吊人','13-death':'死亡','14-art':'艺术','15-the-devil':'恶魔','16-the-tower':'高塔','17-the-star':'星星','18-the-moon':'月亮','19-the-sun':'太阳','20-the-aeon':'新纪元','21-the-universe':'宇宙'};

export function cardNameZh(card: Pick<TarotCard,'id'|'name'>) {
  if (majorNames[card.id]) return majorNames[card.id];
  const [rank,,suit] = card.id.split('-');
  const keyword = card.name.split(' — ')[1];
  return `${suits[suit] ?? suit}${ranks[rank] ?? rank}${keyword && keywords[keyword] ? ` · ${keywords[keyword]}` : ''}`;
}

// Editorial reading notes. Original visual/esoteric/Jungian texts remain available.
export const majorNotes: Record<string,[string,string,string]> = {
  '0-the-fool':['绿色衣服、金色鞋子、螺旋与动物共同表现尚未定形的生命力。画面充满运动，而不是一位已经确定目的的旅行者。','愚者对应风元素与 Aleph，是结构出现之前的零与创造潜能，连接王冠和智慧。','象征神圣儿童和未分化的整体，也象征离开旧身份、开始个体化的冲动。开放需要勇气，但不能把盲目行动等同于成长。'],
  '1-the-magus':['四元素工具围绕持续运动的魔术师展开，书写与传递的符号指向赫尔墨斯和透特。','对应水星与 Beth，连接王冠和理解。它表现意志通过语言、符号与技巧变为形式的过程。','象征意识组织经验的能力，也提醒人们辨别沟通与操纵、创造与幻象之间的界限。'],
  '2-the-high-priestess':['帷幕、月亮与弓的意象呈现隐藏、接纳和反映的力量。','对应月亮与 Gimel，连接王冠和美，是意识与深层来源之间的通道。','象征直觉与无意识的中介。倾听内在图像并不意味着把每个感受都当作外部事实。'],
  '3-the-empress':['女皇与丰饶、花草和成对的象征一起出现，表现生命的滋养与生长。','对应金星与 Daleth，连接智慧和理解，是力量与形式之间的创造性结合。','象征母性、关系和创造力。健康的滋养使生命独立，阴影则是以爱为名的占有。'],
  '4-the-emperor':['公羊、王座和统治符号构成有组织的火，强调建立秩序而非任意爆发。','对应白羊座与 Tzaddi；透特体系将它放在路径 28，与传统韦特的字母归属不同。','象征自我主张和父性秩序。领导需要界限和责任，失衡时成为僵硬的控制。'],
  '5-the-hierophant':['祭司、神圣结构与仪式意象呈现传统知识的传授。','对应金牛座与 Vau，连接智慧和仁慈，将超越原则转化为可以实践的系统。','象征文化和传统塑造人格的作用。学习需要传承，也需要辨别个人经验与集体权威。'],
  '6-the-lovers':['成对人物与婚姻意象呈现相反原则的相遇和区分。','对应双子座与 Zain，连接理解和美；炼金术中的分离与结合是重要线索。','象征对立的认识、关系中的投射和选择。完整性要求看见差异，而非抹去差异。'],
  '7-the-chariot':['战车、盔甲和承载容器表现运动与保护之间的平衡。','对应巨蟹座与 Cheth，连接理解和严厉，强调容器使力量能够被承载。','象征自我组织冲动、维持方向的能力。保护也可能变成封闭，因此行动需要保持与感受的联系。'],
  '8-adjustment':['剑、秤与精确对称的形态表达持续调整的平衡。','对应天秤座与 Lamed，连接严厉和美。透特将其称为调整，而非静态的正义。','象征对行为后果的意识，以及承认自身在关系中的责任。平衡需要持续校正。'],
  '9-the-hermit':['灯、隐士与种子意象表现内向的光和孕育中的生命。','对应处女座与 Yod，连接仁慈和美，指向提炼与独立观察。','象征从集体期待中退开，寻找内在方向。独处可支持成长，但不应固化成隔绝。'],
  '10-fortune':['轮与循环中的形象表现变化、升降和彼此转化的力量。','对应木星与 Kaph，连接仁慈和胜利；命运不是固定结果，而是循环中的关系。','象征自我面对不可控制变化时的态度。辨认模式比强迫一切不变更有帮助。'],
  '11-lust':['女性与兽的结合表现对生命能量的接纳，而不是简单压制。','对应狮子座与 Teth，连接仁慈和严厉。透特将力量主题重新表述为欲望与生命的热情。','象征意识与本能力量的结合。整合冲动并不等于毫无限制地行动。'],
  '12-the-hanged-man':['倒悬与停滞的姿态使熟悉的观看方式被翻转。','对应水元素与 Mem，连接严厉和荣耀。牺牲与视角转换构成它的核心主题。','象征旧自我策略无法继续时的停顿。放下控制可以带来新理解，但被动受困不是成长本身。'],
  '13-death':['骨骼与舞动的变化意象表现分解，同时暗示重新组织。','对应天蝎座与 Nun，连接美和胜利；结束是转化过程的一部分。','象征过时身份和依附的终结。它通常讨论心理与象征的转化，不是对现实死亡的预测。'],
  '14-art':['不同元素在容器中相遇，炼金意象呈现融合和重新生成。','对应射手座与 Samekh，连接美和基础。艺术强调有意识地协调相反力量。','象征超越功能：承受对立张力，直到第三种形式出现。整合不是把差异混成一团。'],
  '15-the-devil':['山羊与强烈的生命符号呈现物质、欲望和创造冲动。','对应摩羯座与 Ayin，连接美和荣耀。原作强调生命力与物质形态，并非只将其解释为邪恶。','象征被排斥的本能和阴影。看清依附与投射，使人更有能力选择，而不是被冲动支配。'],
  '16-the-tower':['崩裂的结构与火焰表现既有形式无法继续维持。','对应火星与 Peh，连接胜利和荣耀。破坏在此揭露僵化形式的局限。','象征旧信念受到现实冲击。失去确定性可能打开更新空间，但破坏本身并不自动产生智慧。'],
  '17-the-star':['流动的水和星辰将个体与更宽广的生命秩序连接。','对应水瓶座与 Heh；透特将星星置于路径 15，连接智慧和美。','象征重新建立希望与内在信任。开放要与实际生活结合，避免理想化的逃避。'],
  '18-the-moon':['夜路、守卫与月光构成不确定的通道，隐藏与显现同时存在。','对应双鱼座与 Qoph，连接胜利和王国，强调穿越想象和恐惧的门槛。','象征梦境、无意识和投射。模糊时需要辨别与耐心，而不是把恐惧当作证据。'],
  '19-the-sun':['太阳与儿童意象呈现光明、开放和生命的再生。','对应太阳与 Resh，连接荣耀和基础，表现意识照亮经验的力量。','象征较清晰的自我认识和整合后的活力。光明并不要求否认阴影，而是更能面对它。'],
  '20-the-aeon':['神圣儿童及新纪元意象表现对旧时代公式的重述。','对应火元素与 Shin，连接荣耀和王国。它是透特体系中的新纪元，并非简单沿用审判牌。','象征旧身份结束后更大的意义框架出现。更新要求承担现实责任，而不是宣称自己已超越一切。'],
  '21-the-universe':['舞动、环形与整体结构表现力量获得完成的形式。','对应土星与 Tau，连接基础和王国，将整个旅程落实到物质与具身经验。','象征整合和完成，同时包含新周期的种子。整体性最终体现在生活方式，而不只在理解中。'],
};

const suitNotes: Record<string,string> = {Wands:'权杖对应火，关注意志、行动和创造力。',Cups:'圣杯对应水，关注感受、接纳和关系。',Swords:'宝剑对应风，关注思想、语言和判断。',Disks:'圆盘对应土，关注身体、资源与现实工作。'};
const rankNotes: Record<string,string> = {ace:'王牌代表元素的根源和尚未展开的潜能。',two:'二号牌呈现力量最初的分化与方向。',three:'三号牌呈现初步形成的结构与展开。',four:'四号牌关注稳定、秩序与建立。',five:'五号牌使稳定受到冲突和考验。',six:'六号牌关注重新协调与较平衡的表达。',seven:'七号牌呈现欲望和力量偏离平衡的可能。',eight:'八号牌将力量带入形式、组织和智性加工。',nine:'九号牌呈现完成前的凝聚与成熟。',ten:'十号牌呈现充分显现的成果及其限制。',knight:'骑士代表本花色的火性，强调主动和驱动力。',queen:'女王代表本花色的水性，强调接纳和内在承载。',prince:'王子代表本花色的风性，强调组织、思维和表达。',princess:'公主代表本花色的土性，强调落实、孕育和具体现实。'};

export function cardNotesZh(card:TarotCard):[string,string,string] {
  if (majorNotes[card.id]) return majorNotes[card.id];
  const rank=card.id.split('-')[0];
  const keyword=card.name.split(' — ')[1];
  const theme=keywords[keyword] ?? cardNameZh(card);
  return [
    `${cardNameZh(card)}以${card.suit ? translateTerm(card.suit) : ''}的视觉符号表现“${theme}”的主题。${suitNotes[card.suit ?? ''] ?? ''}牌面的具体几何、颜色与符号可在下方英文原文中逐项核对。`,
    `${rankNotes[rank] ?? ''}${card.astrology ? `占星归属为 ${translateTerm(card.astrology)}。` : ''}主题“${theme}”描述的是这一力量的状态，不应被简化为固定的好坏结论。`,
    `以“${theme}”为线索，观察当前经验中的${card.suit==='Cups'?'感受与关系':card.suit==='Swords'?'思维与判断':card.suit==='Disks'?'资源、身体与现实条件':'意志、冲动与行动'}。区分象征引发的联想与实际事实，并结合具体问题理解它。原作的详细荣格分析保留在下方。`,
  ];
}
