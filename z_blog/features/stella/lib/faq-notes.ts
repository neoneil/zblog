import type { Copy } from "./explore-config";

// Additional explanations and site-specific guidance, separate from each short answer.
export const faqNotes: Record<string, Copy> = {
  "What does a natal chart show?": {
    en: "Start with the Sun for identity, the Moon for emotional needs and the Ascendant for your approach to new situations. Then consider their houses and connections to other planets. Reading those layers together is more informative than treating one placement as a complete description of you.",
    zh: "可以先从代表自我认同的太阳、对应情绪需求的月亮，以及象征面对新情境方式的上升点开始，再结合宫位与其他行星的联系。把这些层次放在一起，比单凭一个落点定义自己更有帮助。",
  },
  "How can I discover my Sun, Moon and Ascendant?": {
    en: "Use the time recorded at the birthplace, not a time converted to your present city. Check the historical time zone and daylight-saving setting. If the time is uncertain, note that uncertainty rather than presenting a provisional Ascendant as an established result.",
    zh: "填写出生地当时记录的时间，不要换算成现在居住城市的时间，并核对历史时区与夏令时。时间不确定时，应保留这一不确定性，不把暂定上升星座当成确定结果。",
  },
  "Is an exact birth time necessary?": {
    en: "A birth certificate or hospital record is a useful starting point. The Sun and slower planets may still be informative without a precise time, but the Ascendant, Midheaven and house cusps are time-sensitive. Entering noon or zero coordinates does not recover missing birth information.",
    zh: "可先查出生证明或医院记录。即使没有准确时间，太阳与较慢行星的落座仍可能有参考价值，但上升、天顶与宫头对时间敏感。填写中午或零经纬度不能还原缺失的出生信息。",
  },
  "What does the Ascendant mean?": {
    en: "Astrologers associate it with your initial response to life and the impression you make. It often moves through a sign in roughly two hours, although the rate varies with latitude and sign. Its ruler and aspects provide further context beyond the sign name.",
    zh: "占星通常把上升点与面对生活的初始反应、给人的印象联系起来。它经过一个星座往往约需两小时，但速度随纬度和星座而变。守护星与相位也能补充星座名称以外的背景。",
  },
  "How are the seven rays understood?": {
    en: "Within that tradition, a soul ray is distinguished from a personality ray, with additional qualities associated with mental, emotional and physical expression. Practitioners use the framework to explore motivation and service. We discuss it as spiritual symbolism, not an automated diagnosis of a person's soul or past lives.",
    zh: "该传统区分灵魂光线与人格光线，并进一步谈论心理、情绪和身体表达的品质，用来探索动机与贡献方向。本站将其作为灵性象征介绍，而不是对灵魂或前世的自动诊断。",
  },
  "What can I explore with these tools?": {
    en: "You can move between the conventional natal-chart view, the interactive Stellar scene and the explanatory guides. Our emphasis is connecting calculation with readable interpretation. Do not assume that another provider's ray analysis, spiritual-stage assessment or personal forecast service is available here just because the topics are discussed.",
    zh: "你可以在常规本命盘、Stellar 互动星空和知识指南之间切换，将计算结果与易读说明联系起来。讨论某个主题并不代表本站提供其他平台的光线判定、灵性阶段评估或个人预测服务。",
  },
  "How is my Life Path Number worked out?": {
    en: "For example, 29 March 1990 gives month 3, day 11 and year 1. Their sum is 15, which reduces to 6. Keeping intermediate master numbers is important: adding every digit in one step is not always equivalent. The calculator's working lets you check the method.",
    zh: "例如 1990 年 3 月 29 日：月份为 3，日期约简为 11，年份约简为 1，相加得到 15，最后约简为 6。中间的大师数字需要保留，不能总用一次性相加全部数字来替代。可结合计算步骤检查方法。",
  },
  "Which numbers are master numbers?": {
    en: "Eleven is commonly linked to heightened sensitivity and inspiration, twenty-two to bringing a large vision into practical form, and thirty-three to compassionate guidance. These descriptions include responsibilities and challenges, not a promise of exceptional achievement. Explore the associated themes without turning them into a hierarchy.",
    zh: "11 常与敏感和灵感联系，22 关联把较大愿景落地，33 关联关怀式引导。这些描述同时包含责任与挑战，并不保证非凡成就；可探索其主题，不必把数字变成等级。",
  },
  "Do repeating numbers have an objective meaning?": {
    en: "You may use a repeated number as a reminder to pause, journal or clarify an intention. That personal usefulness does not demonstrate an external message. Avoid making consequential financial, health or relationship decisions solely because a sequence appeared on a clock or receipt.",
    zh: "可以把重复数字当作暂停、书写或整理意图的提醒，但个人感到有意义不等于证明它来自外部讯息。不要仅凭时钟或收据上的数字，就决定重要的金钱、健康或关系事务。",
  },
  "How does numerology differ from astrology?": {
    en: "A life-path calculation needs a date; a complete natal chart also needs a time and place. Some people compare the themes as two reflective perspectives. Agreement between them is not independent proof that an interpretation is correct, and a difference does not require choosing one as your fixed identity.",
    zh: "生命路径计算需要日期，完整本命盘还需要时间和地点。两者可以作为反思视角相互比较，但主题一致不是诠释正确的独立证据；不一致时也不必选择其中一个作为固定身份。",
  },
  "Will my Life Path Number ever change?": {
    en: "A name-based expression number is a different concept and may be recalculated if the name changes. A personal year follows a yearly cycle. Keep those labels separate when comparing results, and use the same birth-date reduction convention before deciding that two calculators disagree.",
    zh: "以姓名计算的表达数字属于另一概念，姓名改变时可能重新计算；个人年份则按年循环。比较结果时应区分这些名称，并先确认出生日期的约简方法一致。",
  },
  "Which planets currently appear retrograde?": {
    en: "In astrological interpretation, a retrograde is often used as a prompt to revisit the planet's themes: communication for Mercury, relationships and values for Venus, or effort and assertion for Mars. Treat that symbolism separately from the astronomical motion shown in the table.",
    zh: "占星诠释常借逆行回顾相应主题，例如水星的沟通、金星的关系与价值、火星的行动与表达。应区分这些象征解释与表格中计算出的天文运动状态。",
  },
  "How many planets retrograde in the selected year?": {
    en: "The outer planets usually have a retrograde interval each year, while Venus and Mars follow longer cycles and need not start one every calendar year. Our schedule can also show a period clipped by the year's boundary. That is why both the year and the counting rule matter.",
    zh: "外行星通常每年都有逆行区间，金星与火星的周期更长，不一定每个公历年都开始逆行。本站日历还可能显示被年界截断的区间，因此年份和统计规则都很重要。",
  },
  "Can every planet appear retrograde?": {
    en: "Mercury and Venus have relatively short episodes; the slower planets can remain retrograde for months. The effect comes from changing viewing geometry and relative motion. A symbol such as ℞ describes that apparent direction, not a physical malfunction or an interruption of an orbit.",
    zh: "水星和金星的逆行阶段相对较短，较慢行星则可能持续数月。现象来自观察几何与相对运动的变化；℞ 标记的是视运动方向，不是天体故障或轨道中断。",
  },
  "Must a retrograde period be negative?": {
    en: "Reviewing unfinished work, reconnecting and reconsidering a plan can be useful ways to engage with the traditional theme. Keep ordinary safeguards in place at all times, such as checking arrangements and maintaining backups, rather than expecting the sky to determine whether an activity succeeds.",
    zh: "回顾未完成事务、重新联系和检视计划，都可呼应传统的反思主题。但核对安排、保存备份等实际措施应始终做好，不必期待天空决定一件事是否成功。",
  },
  "When do retrogrades overlap most during the year?": {
    en: "Count a planet only once at each moment, including a carry-over interval if it is active. A date-based calendar identifies daily overlap, whereas exact station times may refine the boundaries. Use the highlighted schedule to plan a review period without treating the maximum count as a danger rating.",
    zh: "每个时刻每颗行星只计一次，跨年延续但仍有效的区间也应计入。日期式日历展示按日重叠，精确留点时间可进一步细化边界。可以安排回顾，但不要把最大数量当成危险等级。",
  },
  "Is a void-of-course window active now?": {
    en: "A void window ends at the next sign ingress. Outside it, the Moon still has a qualifying aspect to complete before that ingress. Check the observation time and the chosen display zone together, especially when a period crosses midnight or the edge of a month.",
    zh: "空亡区间在下次换座时结束；区间之外，月亮在换座前仍有符合规则的相位尚未完成。查看时请同时核对观察时间与显示时区，尤其留意跨午夜或跨月的区间。",
  },
  "What determines the length of a void period?": {
    en: "If the last qualifying aspect happens near a sign boundary, the window can be brief; if it happens earlier, the window can be much longer. There is no universal fixed duration. Read the actual start and end in the table instead of assuming that every window lasts a few hours.",
    zh: "最后一个符合规则的相位若接近星座边界，空亡可能很短；若发生得较早，则可能长得多。不存在通用固定时长，应读取表格的实际起止时间。",
  },
  "How important is a void Moon in astrology?": {
    en: "Traditional horary practice may read it as limited momentum or an outcome different from the original intention. Many modern readers instead use it as a pause for reflection. Here, the calendar describes the timing convention; it does not determine whether your plans, interview or relationship will work out.",
    zh: "传统卜卦可能把空亡解释为推动力不足，或结果偏离最初意图；现代解读也常把它当作停顿反思的机会。本站日历说明时间规则，不判定计划、面试或关系必然如何发展。",
  },
  "How frequently do void periods occur?": {
    en: "Around a dozen or somewhat more sign ingresses can fall within a month, so void windows are recurring rather than rare. Their placement near month boundaries affects the visible count. Compare calendars only after checking which planets and aspect types each one includes.",
    zh: "一个月可能包含约十二次或更多换座，因此空亡是周期性现象而非罕见事件。月界附近的区间会影响显示数量；比较日历前，应核对纳入的行星及相位类型。",
  },
  "Can I continue normal activities during a void Moon?": {
    en: "If you follow electional astrology, you may reserve an optional new launch for another time and use the window for maintenance, journaling or completing work already underway. This is a preference within that tradition, not a requirement to stop living or ignore a real deadline.",
    zh: "若采用择时传统，可以把非必要的新启动安排在其他时段，将空亡用于维护、书写和收尾。这是该传统内的偏好，不意味着停止日常生活或忽略实际期限。",
  },
  "Where is the Moon in the zodiac today?": {
    en: "Its sign provides the zodiac context, while the phase and illumination describe a different part of the lunar cycle. Near an ingress, today's calendar sample and the current sky snapshot may show different signs without contradicting one another: they refer to different moments.",
    zh: "月亮星座提供黄道位置背景，月相与照明比例则描述另一层周期。换座附近，日期格的取样与当前天空快照可能显示不同星座，因为两者对应不同时刻，并不一定矛盾。",
  },
  "How quickly does the lunar sign change?": {
    en: "A return to the same zodiac position takes roughly 27.3 days. That is shorter than the roughly 29.5-day phase cycle, because the Sun's apparent position also advances. Use the calendar to notice these two rhythms without assuming the same sign always brings the same phase.",
    zh: "月亮回到同一黄道位置约需 27.3 天，比约 29.5 天的月相周期短，因为太阳的视位置也在前进。可用日历观察两种节律，不要假定同一月亮星座总对应同一月相。",
  },
  "How can I work with a lunar calendar?": {
    en: "One traditional routine is to set intentions near the New Moon, develop them while the light increases, review what becomes visible around the Full Moon and simplify as it wanes. Add your own practical priorities and observations rather than rearranging every commitment around a symbolic schedule.",
    zh: "一种传统实践是在新月整理意图，随月光增长推进，在满月附近回顾显现的结果，并在亏月阶段精简。结合实际优先事项与个人观察使用，不必为象征性日程重排所有承诺。",
  },
  "Can lunar signs explain my emotions?": {
    en: "Traditional elemental language associates water with feeling, fire with initiative, earth with grounding and air with thought and exchange. You can compare these themes with a journal over time. Treat unexpected feelings as real experiences to understand, not evidence that a transit has caused them.",
    zh: "传统元素语言把水象与感受、火象与主动、土象与稳定、风象与思考交流联系起来。可以长期记录并比较这些主题，但应把感受当作需要理解的真实经历，而非行运造成情绪的证明。",
  },
  "How is a lunar phase different from a lunar sign?": {
    en: "A phase answers how the Moon appears lit; a sign answers where it is along the zodiac. Both may be used in a symbolic reading, but they are not interchangeable. Our calendar keeps the image, illumination percentage and sign label separate so you can compare them clearly.",
    zh: "月相回答月亮如何被照亮，月亮星座回答它位于黄道哪里。两者都可参与象征解读，但不能互换。本站分别展示月相图、照明百分比和星座标签，方便清楚对照。",
  },
  "Where can I see each planet's current sign?": {
    en: "Planets move at different rates, so the Moon may change signs while a slower body remains in one sign for years. Open a planet's detail page for its transit dates and meanings. Check the sign degree as well as its name when comparing snapshots near an ingress.",
    zh: "行星速度不同，月亮可能很快换座，较慢天体则可能多年停留在同一星座。进入行星详情可查看行运日期及含义；比较换座附近的快照时，也应核对度数。",
  },
  "Are any planets in retrograde motion?": {
    en: "Use the retrograde tracker for the start and end dates. Astrology interprets this motion through the planet's themes, such as reviewing communication or reassessing values. That interpretation is distinct from the geometric calculation, and your own chart is needed for an individual reading.",
    zh: "逆行追踪页可查看开始和结束日期。占星会结合行星主题，将其理解为沟通回顾或价值重估等；这种诠释与几何计算不同，个人解读还需要本命盘背景。",
  },
  "What is an aspect between planets?": {
    en: "Astrologers describe conjunctions as a blending, sextiles as openings for exchange, squares as tension requiring a response, trines as an easier flow and oppositions as a polarity to balance. The orb tells you how far a pair is from the exact angle; compare it using the same settings.",
    zh: "占星通常将合相理解为汇聚、六合为交流机会、四分为需要回应的张力、三分为较顺畅的流动、对分为需要平衡的两极。容许度表示距离精确角度的偏差，比较时应采用一致设置。",
  },
  "How do transits relate to my own chart?": {
    en: "The same transit can contact different natal planets and life areas in two charts. Begin with the natal house involved, then examine the aspect and its timing. Avoid deriving a personal prediction from the collective sky alone; a useful interpretation also takes real circumstances and choices into account.",
    zh: "同一行运在两张本命盘中可能联系不同行星与生活领域。可先看相关本命宫位，再看相位及时间。不要仅凭共同天空做个人预测，实际处境和选择也应参与解读。",
  },
  "When are the sky positions refreshed?": {
    en: "The website's displayed timestamp is the reference for comparing two views. Opening or refreshing a page requests its current calculation, while a dated calendar uses its own sampling convention. We do not describe this as a guaranteed hourly background refresh unless that behaviour is actually running.",
    zh: "比较两个视图时，以各自显示的时间戳为基准。打开或刷新页面会请求对应计算，日期日历则采用自己的取样约定。除非确实运行相关机制，否则本站不会承诺后台每小时自动刷新。",
  },
};
