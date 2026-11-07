import type { Copy } from "./explore-config";

export const mercuryInAstrology: Copy[] = [
  {
    en: "Mercury symbolises communication, reasoning and perception: the ways we notice information, make sense of it and share it through speech or writing. Its name recalls the Roman messenger deity, an image that suits the mind's work of collecting impressions, organising ideas and carrying meaning between people. In a natal chart, astrologers interpret Mercury's sign as one part of a person's approach to learning, thinking and conversation, alongside its house and aspects rather than in isolation.",
    zh: "水星象征沟通、推理与感知，关联我们如何注意信息、理解信息，再通过语言或文字与人分享。它的名字来自罗马神话中的信使，这一形象呼应了心智收集印象、整理观念与传递意义的工作。在本命盘中，占星师将水星星座视为学习、思考和对话方式的一部分，同时结合宫位与相位理解，而非孤立判断。",
  },
  {
    en: "As a transiting planet, Mercury provides a symbolic lens for the shared mental climate. Its sign can frame questions about the tone of a conversation, the approach taken in negotiations, the way news is presented or the habits behind technology use and everyday coordination. These themes invite observation, not an assumption that everyone thinks alike or that a planetary position determines a message's outcome.",
    zh: "作为行运行星，水星为共同的思维氛围提供象征性视角。它所在的星座可以引出关于对话语气、协商方式、新闻表达，以及技术使用和日常安排习惯的问题。这些主题邀请观察，并不意味着所有人会以同样方式思考，也不表示行星位置决定沟通结果。",
  },
  {
    en: "In the esoteric Seven Rays tradition, Mercury is associated with the Fourth Ray, Harmony through Conflict, and with communication between soul and personality. It represents a bridge from intuitive understanding to ideas that can be expressed and examined. Read this way, a passage through a sign becomes a temporary learning theme: what might its qualities reveal about how you listen, interpret and respond? Beyond asking what you think, consider what deeper value seeks expression through those thoughts and how to communicate it responsibly. This is a spiritual interpretation, not a measured transmission of energy or a substitute for evidence.",
    zh: "在秘传占星的七射线传统中，水星与第四射线“通过冲突达成和谐”相联系，也象征灵魂与人格之间的沟通。它被理解为一座桥梁，将直觉理解转化为可以表达和检视的思想。从这一角度看，水星经过某个星座，可以成为短暂的学习主题：这一星座的品质，能让你看见怎样的倾听、诠释与回应方式？除了问自己在想什么，也可以追问：什么更深的价值正试图通过这些念头表达，又该怎样负责任地传递？这属于灵性诠释，并非已测量的能量传输，也不能替代证据。",
  },
];

export const planetaryDurations: { key: string; stay: Copy; cycle: Copy }[] = [
  { key: "moon", stay: { en: "~2.5 days", zh: "约 2.5 天" }, cycle: { en: "~27.3 days", zh: "约 27.3 天" } },
  { key: "sun", stay: { en: "~30 days", zh: "约 30 天" }, cycle: { en: "~365 days", zh: "约 365 天" } },
  { key: "mercury", stay: { en: "~15–60 days", zh: "约 15–60 天" }, cycle: { en: "~88 days", zh: "约 88 天" } },
  { key: "venus", stay: { en: "~23–60 days", zh: "约 23–60 天" }, cycle: { en: "~225 days", zh: "约 225 天" } },
  { key: "mars", stay: { en: "~6–7 weeks", zh: "约 6–7 周" }, cycle: { en: "~687 days", zh: "约 687 天" } },
  { key: "jupiter", stay: { en: "~12–13 months", zh: "约 12–13 个月" }, cycle: { en: "~12 years", zh: "约 12 年" } },
  { key: "saturn", stay: { en: "~2.5 years", zh: "约 2.5 年" }, cycle: { en: "~29.5 years", zh: "约 29.5 年" } },
  { key: "uranus", stay: { en: "~7 years", zh: "约 7 年" }, cycle: { en: "~84 years", zh: "约 84 年" } },
  { key: "neptune", stay: { en: "~14 years", zh: "约 14 年" }, cycle: { en: "~165 years", zh: "约 165 年" } },
  { key: "pluto", stay: { en: "~12–32 years", zh: "约 12–32 年" }, cycle: { en: "~248 years", zh: "约 248 年" } },
];

export const planetaryTransits: Copy[] = [
  {
    en: "At every moment, a planet can be located at a particular degree within one of the zodiac's twelve signs. From our viewpoint on Earth, these positions change as Earth and the other planets follow their orbits at different rates. Astrology calls a planet's passage through a sign, house or relationship to a natal position a transit. Sign ingresses are the moments when a planet crosses into the next zodiac sector; apparent retrograde motion can carry it back across a boundary and produce more than one entry.",
    zh: "在任一时刻，都可以用黄道十二星座中的具体度数标记行星位置。从地球观察，这些位置会随地球及其他行星以不同速度沿轨道运行而变化。占星学将行星经过某个星座、宫位，或与本命位置形成关系的过程称为行运。换座是行星跨入下一个黄道区间的时刻；视逆行可能让它重新越过边界，因此同一边界可能出现多次进入。",
  },
  {
    en: "In astrological interpretation, the planet describes a theme while its sign describes a style of expression. Mars in Aries, for example, is commonly associated with a direct, initiating approach; Mars in Cancer is more often read through protection, emotional investment and less direct action. These are symbolic contrasts, not descriptions that every person must fit. To explore personal relevance, compare the transit with your natal chart: its houses, planetary degrees and aspects provide context that a general sky position alone cannot supply.",
    zh: "在占星诠释中，行星描述主题，星座则描述表达方式。例如，白羊座火星常被理解为直接、主动开创；巨蟹座火星则更多通过保护、情感投入与较间接的行动来解读。这些是象征性对照，不是每个人都必须符合的性格描述。若想了解个人意义，还需要结合本命盘的宫位、行星度数与相位，这些背景无法仅由当下天空位置提供。",
  },
  {
    en: "Mercury, Venus and Mars generally move through signs more quickly than Jupiter through Pluto, although their individual speeds and retrograde cycles differ. Astrologers use the faster planets to discuss shorter-lived themes in communication, relationships and action, and the slower planets to frame longer periods of development or reassessment. The positions above offer a shared reference for the present sky, sometimes called collective astrological weather. They do not establish that a particular mood, event or outcome will occur, and the length of a transit does not measure the importance of an experience.",
    zh: "水星、金星与火星通常比木星至冥王星更快经过星座，但各自速度和逆行周期仍有差异。占星师借较快的行星讨论沟通、关系与行动中的短期主题，借较慢的行星观察更长阶段的发展或重新评估。上方位置提供的是共同天空的参考，也常被比喻为集体星象天气。它们不能证明某种情绪、事件或结果必然发生，行运持续多久也不等于某段经历有多重要。",
  },
  {
    en: "Esoteric astrology adds a spiritual vocabulary to this picture. Within the Seven Rays tradition, planets are interpreted as channels for distinct qualities of consciousness, and the zodiac sign is understood as modifying how those qualities are expressed. This perspective asks not only what someone wants to accomplish, but what kind of awareness or service they might cultivate. The proposed ray energies belong to a metaphysical belief system; they are not measured planetary emissions, gravitational effects or an additional variable in the astronomical calculations used by this page.",
    zh: "秘传占星为这一图景增加了灵性语言。在七射线传统中，行星被诠释为不同意识品质的通道，星座则被认为会调整这些品质的表达方式。这一视角不仅追问想完成什么，也关注可以培养怎样的觉察与服务意识。这里所说的射线能量属于形而上信念体系，并非已测量的行星辐射、引力效应，也不是本页天文计算中的额外参数。",
  },
  {
    en: "Because the outer planets remain in a sign for years, astrologers often connect their sign changes with generational and cultural themes. Pluto is read through power, endings and renewal; Neptune through imagination, ideals and shared dreams. Faster planets can then be used as symbols for how broad themes enter everyday conversations, choices and relationships. This is an interpretive way of reading history and experience, not evidence that a planet causes a civilisation to change. Use it to generate thoughtful questions, while giving lived circumstances, historical context and individual agency their proper weight.",
    zh: "外行星会在同一星座停留多年，因此占星师常把它们的换座与世代及文化主题联系起来。冥王星常通过权力、结束与更新来理解，海王星则关联想象、理想与共同梦想。较快的行星可以进一步象征这些宏观主题如何进入日常对话、选择与关系。这是一种解读历史和经验的方式，并不是行星造成文明变化的证据。可以借它提出值得思考的问题，同时充分尊重真实处境、历史背景与个人自主性。",
  },
];
