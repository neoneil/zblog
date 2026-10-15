type Copy = {zh:string;en:string};
export type SpreadPosition = {name:Copy;description:Copy;col:number;row:number};
export type ReadingSpread = {id:string;name:Copy;description:Copy;columns:number;rows:number;positions:SpreadPosition[];successive?:boolean};

function position(zh:string,en:string,descriptionZh:string,descriptionEn:string,col:number,row:number):SpreadPosition {
  return {name:{zh,en},description:{zh:descriptionZh,en:descriptionEn},col,row};
}

// Position order and geometry match the authorized Crowley Thoth reference.
export const readingSpreads:ReadingSpread[] = [
  {id:'tree-of-life',name:{zh:'生命之树',en:'The Tree of Life'},columns:3,rows:6,
    description:{zh:'十张牌对应生命之树的十个质点。从王冠到王国，沿三柱探索愿望、内在动力与现实呈现。',en:'A ten-card spread mapping your situation to the ten Sephiroth of the Qabalistic Tree of Life, from Kether at the crown to Malkuth at the root.'},
    positions:[
      position('王冠 · Kether','Kether','最高愿望或神圣目的。','The Crown — your highest aspiration or divine purpose.',2,1),
      position('智慧 · Chokmah','Chokmah','男性力量、原初灵感与最初的运动。','Wisdom — masculine force, raw inspiration, the first motion.',3,2),
      position('理解 · Binah','Binah','女性的结构力量，以及赋予形式的限制。','Understanding — feminine structure, limitation that gives form.',1,2),
      position('仁慈 · Chesed','Chesed','扩展、丰盛，以及你被召唤去建立的事物。','Mercy — expansion, abundance, what you are called to build.',3,3),
      position('严厉 · Geburah','Geburah','限制、严厉，以及必须割舍的部分。','Strength — restriction, severity, what must be cut away.',1,3),
      position('美 · Tiphareth','Tiphareth','事情的核心，以及居于中心的真实自我。','Beauty — the heart of the matter, your true self at centre.',2,4),
      position('胜利 · Netzach','Netzach','情绪、欲望与本能驱动力。','Victory — emotions, desire, the instinctual drive.',3,4),
      position('荣耀 · Hod','Hod','才智、语言，以及构建形式的心智。','Splendour — intellect, language, the formulating mind.',1,4),
      position('基础 · Yesod','Yesod','星光层面、周期与隐藏的运作机制。','Foundation — the astral plane, cycles, the hidden machinery.',2,5),
      position('王国 · Malkuth','Malkuth','物质结果，以及将在现实中显现的事物。','The Kingdom — the material outcome, what manifests in the world.',2,6),
    ]},
  {id:'abyss-crossing',name:{zh:'跨越深渊',en:'The Abyss Crossing'},columns:3,rows:3,
    description:{zh:'从此岸走向彼岸的三张牌。观察你所在的位置、承载你跨越的力量，以及另一侧等待你的事物。',en:'Three cards on the path across the Abyss: where you stand, what carries you, and what awaits. Cards ascend from earth toward the supernal triangle.'},
    positions:[
      position('门槛','The Threshold','你站在何处：立于深渊边缘，望向另一侧。','Where you stand — the edge of the Abyss, looking across.',1,3),
      position('跨越','The Crossing','承载你前行的力量：意志、恩典或必要性。','The force that carries you — will, grace, or necessity.',2,2),
      position('彼岸','The Other Shore','彼岸等待你的事物：转化或消融。','What awaits beyond — transformation or dissolution.',3,1),
    ]},
  {id:'four-worlds',name:{zh:'四重世界',en:'The Four Worlds'},columns:3,rows:3,
    description:{zh:'四张牌组成菱形，从最初的神圣火花，经创造与形成，走向物质世界的显现。',en:'Four cards form a diamond: from the divine spark above, through the creative and formative worlds, to material manifestation below.'},
    positions:[
      position('原型界 · Atziluth','Atziluth','火：神圣的种子与事情的最高原因。','The Archetypal World (Fire) — the divine seed and highest cause of the matter.',2,1),
      position('创造界 · Briah','Briah','水：塑造事情的情感与想象力量。','The Creative World (Water) — the emotional and imaginative forces shaping this.',1,2),
      position('形成界 · Yetzirah','Yetzirah','风：已经形成的心智与星光模式。','The Formative World (Air) — the mental and astral patterns already forming.',3,2),
      position('行动界 · Assiah','Assiah','土：物质显现，以及将出现在生活中的事物。','The Active World (Earth) — the material manifestation, what will appear in life.',2,3),
    ]},
  {id:'golden-dawn-15',name:{zh:'黄金黎明十五牌阵',en:'The Golden Dawn Thoth 15-Card Method'},columns:7,rows:5,
    description:{zh:'五组三张牌组成梅花式布局，围绕问卜者，探索当前道路、替代道路、心理基础与业力。',en:'Five groups of three in a quincunx: the Querent at centre, Current and Alternate Paths above, Psychological Basis and Karma below.'},
    positions:[
      position('问卜者 · 指示牌','The Significator','此刻的你：所有力量从中展开的中心自我。','Who you are in this moment — the central self from which all else radiates.',4,3),
      position('问卜者 · 周围影响','What Surrounds','眼前的直接影响，以及指示牌周围的氛围。','Immediate influences pressing in — the atmosphere around the significator.',3,3),
      position('问卜者 · 意识目标','What Crowns','意识所追求的目标与最高愿望。','The conscious aim — what the mind reaches for and the highest aspiration.',5,3),
      position('当前道路 · 种子','Current Path — Seed','启动当前道路、使你走向这个方向的力量。','The initiating force of the current path — what set this direction in motion.',5,1),
      position('替代道路 · 入口','Alternate Path — Gate','另一条路的入口。','The entry point of the alternate path — the doorway to the other road.',3,1),
      position('心理基础 · 入口','Psych. Basis — Gate','最接近表层的心理基础与可见的内在根源。','The psychological foundation nearest the surface — the visible root of inner patterns.',3,5),
      position('业力 · 入口','Karma — Gate','正在进入的业力，以及需要立即平衡的事物。','The karmic force entering now — the immediate face of what must be balanced.',5,5),
      position('当前道路 · 动力','Current Path — Force','正在推动当前道路的动态力量。','The active dynamic on the current path — what is moving and how.',6,1),
      position('替代道路 · 动力','Alternate Path — Force','选择另一条路将启动的力量。','The active force on the alternate path — what the crossroads choice puts in motion.',2,1),
      position('心理基础 · 深层','Psych. Basis — Depth','更深的心理基础与下方的习得模式。','The deeper layer of the psychological foundation — the conditioned pattern below.',2,5),
      position('业力 · 重量','Karma — Weight','已经积累、必须处理的力量。','The karmic weight — what has accumulated and must be worked through.',6,5),
      position('当前道路 · 结果','Current Path — Outcome','若沿当前道路继续，将抵达何处。','The outcome if the current path continues — where this road ends.',7,1),
      position('替代道路 · 根源','Alternate Path — Root','替代道路的最深原因，以及它何以成为可能。','The deepest root of the alternate — the hidden cause that makes this other path possible.',1,1),
      position('心理基础 · 根源','Psych. Basis — Root','心理基础最深的根源与最早的印记。','The deepest root of the psychological foundation — the earliest imprint.',1,5),
      position('业力 · 整合','Karma — Resolution','这一生的努力正趋向的业力解决方向。','The karmic resolution — what the work of this life is moving toward.',7,5),
    ]},
  {id:'one-card-oracle',name:{zh:'单张神谕',en:'One Card Oracle'},columns:1,rows:1,successive:true,
    description:{zh:'抽一张牌，与它静处。准备好后可以继续抽牌，让解读随着问题逐渐深入。',en:'Draw one card and sit with it. Draw another when you are ready. Let the reading grow as the question deepens.'},
    positions:[position('此刻的启示','The Card','牌组此刻向你揭示的事物。','What the deck reveals.',1,1)]},
  {id:'sacred-union',name:{zh:'神圣结合',en:'The Sacred Union'},columns:3,rows:3,
    description:{zh:'七张牌探索关系中的两方、彼此交换、挑战与前行方向，适用于亲密、合作或其他重要联结。',en:'Seven cards for relationships: romantic, professional, or any meaningful bond between two forces.'},
    positions:[
      position('你','You','你的能量，以及你如何进入这段关系。','Your energy — how you enter this relationship.',1,1),
      position('联结','The Bond','将双方联结的鲜活力量。','What connects you — the living current between.',2,1),
      position('对方','Them','对方的能量，以及其如何进入这段关系。','Their energy — how they enter this relationship.',3,1),
      position('你的给予','What You Give','你无需被请求便带给关系的礼物。','Your gift to this union — what you bring without asking.',1,2),
      position('挑战','The Challenge','需要努力才能成长的摩擦点。','The friction point — where growth demands work.',2,2),
      position('对方的给予','What They Give','对方所给予的，无论可见或不可见。','Their gift — what they offer, seen or unseen.',3,2),
      position('前行之路','The Path Forward','关系正在趋向的方向。','Where this relationship is heading — the current trajectory.',2,3),
    ]},
];
