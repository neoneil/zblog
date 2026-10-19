import type { TarotCard, TarotSuit } from "@/types/tarot";

type MajorSeed = {
  number: number;
  name: string;
  nameCn: string;
  meaningUp: string[];
  meaningReversed: string[];
};

const majorSeeds: MajorSeed[] = [
  {
    number: 0,
    name: "The Fool",
    nameCn: "愚人",
    meaningUp: ["新的开始", "勇气", "冒险", "自由"],
    meaningReversed: ["冲动", "轻率", "方向感不足", "逃避现实"],
  },
  {
    number: 1,
    name: "The Magician",
    nameCn: "魔术师",
    meaningUp: ["行动力", "创造力", "掌控资源", "自信"],
    meaningReversed: ["操控", "自我怀疑", "虚张声势", "能量分散"],
  },
  {
    number: 2,
    name: "The High Priestess",
    nameCn: "女祭司",
    meaningUp: ["直觉", "洞察", "神秘", "内在智慧"],
    meaningReversed: ["压抑直觉", "困惑", "隐藏信息", "情绪封闭"],
  },
  {
    number: 3,
    name: "The Empress",
    nameCn: "皇后",
    meaningUp: ["丰盛", "滋养", "温柔", "成长"],
    meaningReversed: ["依赖", "过度付出", "停滞", "情绪化"],
  },
  {
    number: 4,
    name: "The Emperor",
    nameCn: "皇帝",
    meaningUp: ["秩序", "责任", "稳定", "领导力"],
    meaningReversed: ["控制欲", "僵化", "压迫", "缺乏弹性"],
  },
  {
    number: 5,
    name: "The Hierophant",
    nameCn: "教皇",
    meaningUp: ["传统", "规则", "学习", "信念"],
    meaningReversed: ["抗拒规则", "盲从", "价值冲突", "形式主义"],
  },
  {
    number: 6,
    name: "The Lovers",
    nameCn: "恋人",
    meaningUp: ["关系", "选择", "契合", "真诚"],
    meaningReversed: ["犹豫", "关系失衡", "价值观不合", "逃避承诺"],
  },
  {
    number: 7,
    name: "The Chariot",
    nameCn: "战车",
    meaningUp: ["推进", "意志力", "胜利", "目标明确"],
    meaningReversed: ["失控", "阻碍", "急躁", "方向偏移"],
  },
  {
    number: 8,
    name: "Strength",
    nameCn: "力量",
    meaningUp: ["温柔的力量", "耐心", "勇敢", "自我掌控"],
    meaningReversed: ["焦虑", "自我怀疑", "失去耐心", "情绪波动"],
  },
  {
    number: 9,
    name: "The Hermit",
    nameCn: "隐士",
    meaningUp: ["独处", "反思", "寻找答案", "沉淀"],
    meaningReversed: ["孤立", "逃避", "封闭", "过度退缩"],
  },
  {
    number: 10,
    name: "Wheel of Fortune",
    nameCn: "命运之轮",
    meaningUp: ["转机", "变化", "机会", "命运流动"],
    meaningReversed: ["停滞", "反复", "失去节奏", "时机未到"],
  },
  {
    number: 11,
    name: "Justice",
    nameCn: "正义",
    meaningUp: ["公平", "理性", "责任", "结果显现"],
    meaningReversed: ["失衡", "偏见", "逃避责任", "判断失准"],
  },
  {
    number: 12,
    name: "The Hanged Man",
    nameCn: "倒吊人",
    meaningUp: ["暂停", "换角度", "等待", "觉察"],
    meaningReversed: ["拖延", "僵持", "无谓牺牲", "不愿放手"],
  },
  {
    number: 13,
    name: "Death",
    nameCn: "死神",
    meaningUp: ["结束", "蜕变", "更新", "断舍离"],
    meaningReversed: ["抗拒改变", "停在过去", "无法放下", "消耗"],
  },
  {
    number: 14,
    name: "Temperance",
    nameCn: "节制",
    meaningUp: ["平衡", "疗愈", "融合", "循序渐进"],
    meaningReversed: ["失衡", "过度", "节奏紊乱", "不协调"],
  },
  {
    number: 15,
    name: "The Devil",
    nameCn: "恶魔",
    meaningUp: ["欲望", "束缚", "沉迷", "执念"],
    meaningReversed: ["挣脱束缚", "觉醒", "看清问题", "慢慢脱离"],
  },
  {
    number: 16,
    name: "The Tower",
    nameCn: "高塔",
    meaningUp: ["突变", "打破旧结构", "真相显现", "重建"],
    meaningReversed: ["延迟爆发", "内在震荡", "害怕变化", "勉强维持"],
  },
  {
    number: 17,
    name: "The Star",
    nameCn: "星星",
    meaningUp: ["希望", "疗愈", "信心", "愿景"],
    meaningReversed: ["迷茫", "失望", "信念不足", "情绪低落"],
  },
  {
    number: 18,
    name: "The Moon",
    nameCn: "月亮",
    meaningUp: ["潜意识", "不确定", "情绪", "直觉波动"],
    meaningReversed: ["看清迷雾", "真相浮现", "焦虑缓解", "误会减少"],
  },
  {
    number: 19,
    name: "The Sun",
    nameCn: "太阳",
    meaningUp: ["喜悦", "成功", "清晰", "能量提升"],
    meaningReversed: ["短暂低落", "延迟成果", "过度乐观", "表现受阻"],
  },
  {
    number: 20,
    name: "Judgement",
    nameCn: "审判",
    meaningUp: ["觉醒", "总结", "重新开始", "回应召唤"],
    meaningReversed: ["迟疑", "自责", "错过信号", "无法释怀"],
  },
  {
    number: 21,
    name: "The World",
    nameCn: "世界",
    meaningUp: ["完成", "圆满", "整合", "进入新阶段"],
    meaningReversed: ["未完成", "循环未闭合", "拖尾", "差最后一步"],
  },
];

const majorArcana: TarotCard[] = majorSeeds.map((card) => ({
  id: `major-${card.number}`,
  name: card.name,
  nameCn: card.nameCn,
  arcana: "major",
  imageSrc: `/NEW CARDS/${card.name}.png`,
  meaningUp: card.meaningUp,
  meaningReversed: card.meaningReversed,
}));

type SuitConfig = {
  suit: TarotSuit;
  suitCn: string;
  suitEn: string;
  emotionalUp: string[];
  emotionalReversed: string[];
};

const suitConfigs: SuitConfig[] = [
  {
    suit: "cups",
    suitCn: "圣杯",
    suitEn: "Cups",
    emotionalUp: ["情感流动", "关系连结", "感受力", "温柔回应"],
    emotionalReversed: ["情绪失衡", "敏感过度", "关系卡住", "内心压抑"],
  },
  {
    suit: "wands",
    suitCn: "权杖",
    suitEn: "Wands",
    emotionalUp: ["行动推进", "热情", "创造冲劲", "外在扩张"],
    emotionalReversed: ["急躁", "消耗", "冲动行事", "推进受阻"],
  },
  {
    suit: "swords",
    suitCn: "宝剑",
    suitEn: "Swords",
    emotionalUp: ["理性判断", "沟通", "决断", "看清事实"],
    emotionalReversed: ["思虑过重", "冲突", "言语受伤", "判断偏差"],
  },
  {
    suit: "pentacles",
    suitCn: "星币",
    suitEn: "Pentacles",
    emotionalUp: ["现实建设", "资源", "稳定", "长期积累"],
    emotionalReversed: ["拖延", "匮乏焦虑", "现实压力", "节奏迟缓"],
  },
];

const numberRanks = [
  {
    num: 1,
    en: "Ace",
    cn: "一",
    up: ["新的种子", "机会浮现", "开始萌芽"],
    rev: ["起步迟缓", "机会未稳", "能量堵塞"],
  },
  {
    num: 2,
    en: "Two",
    cn: "二",
    up: ["平衡", "两方互动", "选择出现"],
    rev: ["摇摆", "失衡", "迟疑不决"],
  },
  {
    num: 3,
    en: "Three",
    cn: "三",
    up: ["成长", "合作", "扩展"],
    rev: ["分散", "配合不足", "推进不顺"],
  },
  {
    num: 4,
    en: "Four",
    cn: "四",
    up: ["稳定", "停下来整理", "边界感"],
    rev: ["停滞过久", "僵住", "不愿调整"],
  },
  {
    num: 5,
    en: "Five",
    cn: "五",
    up: ["摩擦", "变化", "压力中的学习"],
    rev: ["冲突加剧", "失控", "卡在消耗中"],
  },
  {
    num: 6,
    en: "Six",
    cn: "六",
    up: ["修复", "流动改善", "阶段性和谐"],
    rev: ["旧问题反复", "修复受阻", "关系拉扯"],
  },
  {
    num: 7,
    en: "Seven",
    cn: "七",
    up: ["评估", "坚持", "重新定位"],
    rev: ["怀疑", "防御过度", "方向模糊"],
  },
  {
    num: 8,
    en: "Eight",
    cn: "八",
    up: ["推进", "加速", "进入下一阶段"],
    rev: ["节奏失衡", "停顿", "推进受卡"],
  },
  {
    num: 9,
    en: "Nine",
    cn: "九",
    up: ["阶段成果", "临界点", "成熟"],
    rev: ["压力累积", "担忧", "收尾困难"],
  },
  {
    num: 10,
    en: "Ten",
    cn: "十",
    up: ["完成", "结果显现", "循环到顶点"],
    rev: ["负担过重", "尾声拖长", "难以放下"],
  },
];

const courtRanks = [
  {
    key: "page",
    en: "Page",
    cn: "侍从",
    up: ["讯息", "学习", "新的体验", "好奇心"],
    rev: ["不成熟", "消息不稳", "执行不足", "心态浮动"],
  },
  {
    key: "knight",
    en: "Knight",
    cn: "骑士",
    up: ["行动", "推进", "目标感", "执行力"],
    rev: ["急冲", "反复", "不够稳", "方向偏移"],
  },
  {
    key: "queen",
    en: "Queen",
    cn: "女王",
    up: ["内在成熟", "掌控力", "感知细腻", "稳定输出"],
    rev: ["情绪化", "防备", "内耗", "过度控制"],
  },
  {
    key: "king",
    en: "King",
    cn: "国王",
    up: ["成熟担当", "管理能力", "稳定掌舵", "决策"],
    rev: ["专断", "僵化", "控制感太强", "失去弹性"],
  },
];

function buildMinorArcana(): TarotCard[] {
  const numbered = suitConfigs.flatMap((suit) =>
    numberRanks.map((rank) => ({
      id: `${suit.suit}-${rank.num}`,
      name: `${rank.en} of ${suit.suitEn}`,
      nameCn: `${suit.suitCn}${rank.cn}`,
      arcana: "minor" as const,
      suit: suit.suit,
      imageSrc: `/NEW CARDS/${suit.suitEn}/${suit.suit === "wands" && rank.num === 4 ? "Fourth" : rank.en} of ${suit.suitEn}.png`,
      meaningUp: [...rank.up, ...suit.emotionalUp.slice(0, 2)],
      meaningReversed: [...rank.rev, ...suit.emotionalReversed.slice(0, 2)],
    }))
  );

  const courts = suitConfigs.flatMap((suit) =>
    courtRanks.map((rank) => ({
      id: `${suit.suit}-${rank.key}`,
      name: `${rank.en} of ${suit.suitEn}`,
      nameCn: `${suit.suitCn}${rank.cn}`,
      arcana: "minor" as const,
      suit: suit.suit,
      imageSrc: `/NEW CARDS/${suit.suitEn}/${rank.en} of ${suit.suitEn}.png`,
      meaningUp: [...rank.up, ...suit.emotionalUp.slice(0, 2)],
      meaningReversed: [...rank.rev, ...suit.emotionalReversed.slice(0, 2)],
    }))
  );

  return [...numbered, ...courts];
}

export const tarotDeck: TarotCard[] = [
  ...majorArcana,
  ...buildMinorArcana(),
];

export const tarotCardBack = "/tarot-cards/card-back.jpg";
