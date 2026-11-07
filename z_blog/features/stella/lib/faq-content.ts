import type { Copy } from "./explore-config";
import { faqNotes } from "./faq-notes";
export type FaqItem = { question: Copy; answer: Copy };
const q = (en: string, zh: string, answerEn: string, answerZh: string): FaqItem => ({
  question: { en, zh },
  answer: {
    en: `${answerEn}${faqNotes[en] ? `\n\n${faqNotes[en].en}` : ""}`,
    zh: `${answerZh}${faqNotes[en] ? `\n\n${faqNotes[en].zh}` : ""}`,
  },
});

export const guideFaq: FaqItem[] = [
  q("What does a natal chart show?", "什么是出生星盘？", "It records planetary positions for a birth moment and location. Signs, houses and aspects provide symbolic perspectives on identity, emotions and relationships.", "出生星盘记录特定出生时刻和地点的行星位置。星座、宫位与相位提供理解自我、情绪和关系的象征性视角。"),
  q("How can I discover my Sun, Moon and Ascendant?", "如何找到太阳、月亮与上升星座？", "Enter your birth date, local birth time and birthplace in the calculator. Accurate time and coordinates are especially important for the Ascendant.", "在计算器中输入出生日期、当地出生时间和出生地点。上升星座尤其依赖准确的时间和经纬度。"),
  q("Is an exact birth time necessary?", "需要准确的出生时间吗？", "It is necessary for reliable houses and angles. Without it, planetary signs remain approximate; the Moon may cross a sign boundary during that day.", "可靠的宫位与角点需要准确出生时间。没有时间时只能近似查看行星落座；月亮还可能在当天换座。"),
  q("What does the Ascendant mean?", "上升星座是什么意思？", "The Ascendant is the zodiac degree rising on the eastern horizon. It depends on the time and place, and helps orient the house framework.", "上升点是出生时东方地平线升起的黄道度数，取决于时间与地点，也是理解宫位框架的重要基准。"),
  q("How are the seven rays understood?", "什么是七道光线？", "Some esoteric traditions describe seven symbolic spiritual qualities. They are interpretive beliefs, not measurable astronomical properties; this calculator does not determine a verified soul ray.", "部分秘传传统用七种象征性灵性品质理解七道光线。这属于诠释性信念，而非可测量的天文属性；本站计算器不会判定经验证的灵魂光线。"),
  q("What can I explore with these tools?", "本站星盘工具提供哪些内容？", "Explore planetary placements, houses, aspects, a visual chart and related guides. These are reflection tools, not proof of spiritual status or a guaranteed prediction.", "可以查看行星落点、宫位、相位、可视化星盘及相关指南。这些工具用于自我探索，不是灵性等级证明，也不保证未来事件。"),
];
export const numerologyFaq: FaqItem[] = [
  q("How is my Life Path Number worked out?", "如何计算生命路径数字？", "Reduce month, day and year separately, preserving 11, 22 and 33, then add and reduce again. Different reduction conventions may produce different results.", "先分别约简月、日、年，保留 11、22、33，再相加并继续约简。不同约简约定可能得到不同结果。"),
  q("Which numbers are master numbers?", "哪些数字属于大师数字？", "This system preserves 11, 22 and 33. Numerology associates them with inspiration, practical vision and compassionate teaching; they do not rank a person's worth.", "本体系保留 11、22、33，分别关联启发、务实愿景与关怀式教导等象征，不代表个人价值或等级。"),
  q("Do repeating numbers have an objective meaning?", "天使数字真实吗？", "Repeated sequences can inspire reflection, but interpreting them as messages is a personal belief. Pattern recognition also explains why a recently noticed number seems frequent.", "重复数字可以成为反思提示，但将其视为讯息属于个人信念。模式识别也能解释为什么刚注意到的数字似乎频繁出现。"),
  q("How does numerology differ from astrology?", "数字命理与占星有什么区别？", "Numerology interprets number patterns, such as a reduced birth date. Astrology interprets celestial positions. They are different symbolic frameworks rather than interchangeable scientific assessments.", "数字命理解读出生日期约简等数字模式，占星则诠释天体位置。两者是不同的象征框架，不是可互换的科学评估。"),
  q("Will my Life Path Number ever change?", "生命路径数字会变化吗？", "Not when the birth date and calculation method stay the same. Personal-year numbers are a separate calculation and can vary from year to year.", "只要出生日期与计算方法不变，生命路径数字就不变。个人年份数字属于另一种计算，会随年份变化。"),
];
export const retrogradeFaq: FaqItem[] = [
  q("Which planets currently appear retrograde?", "现在有哪些行星正在逆行？", "Use Current Retrograde Status above for the calculated snapshot. The displayed timestamp identifies the observation moment; an annual calendar may include periods outside that moment.", "以上方「当前逆行状态」的计算快照为准，时间戳标明观察时刻。全年日历还可能包含该时刻之外的逆行区间。"),
  q("How many planets retrograde in the selected year?", "所选年份有多少颗行星逆行？", "Count distinct planets in that year's schedule, not rows. A planet can have several intervals or begin the year already retrograde, so interval counts differ.", "应统计该年日历中不同的行星，而不是表格行数。同一行星可能有多个区间，也可能在年初已处于逆行，因此区间数不等于行星数。"),
  q("Can every planet appear retrograde?", "所有行星都会逆行吗？", "The planets shown here can exhibit apparent backward motion as viewed from Earth. The Sun and Moon do not undergo the same geocentric longitude reversal.", "本站列出的行星都可能从地球视角呈现逆向视运动，太阳与月亮不会发生同样的地心黄经方向反转。"),
  q("Must a retrograde period be negative?", "逆行一定不好吗？", "No. Astrology often treats it as a review theme, but retrograde motion does not establish that a particular person will suffer delays or setbacks.", "不一定。占星常将其诠释为回顾主题，但逆向视运动不能证明某个人必然经历延误或挫折。"),
  q("When do retrogrades overlap most during the year?", "一年中何时同时逆行的行星最多？", "Compare overlapping date ranges in the selected year's calendar. Use that year and its time convention; a peak date quoted for another year is not transferable.", "比较所选年份日历中相互重叠的日期区间，并使用该年的时间约定。其他年份的峰值日期不能直接套用。"),
];
export const voidFaq: FaqItem[] = [
  q("Is a void-of-course window active now?", "月亮现在处于空亡吗？", "The status banner above compares the supplied observation time with the displayed intervals. For another month, the table describes that month rather than a live status.", "上方状态栏会将传入的观察时刻与显示区间比较。切换到其他月份时，表格描述的是所选月份，不应直接当作实时状态。"),
  q("What determines the length of a void period?", "月亮空亡会持续多久？", "It runs from the final qualifying exact aspect to the next sign ingress. Depending on planetary geometry and the chosen rules, it may last minutes or many hours.", "区间从最后一个符合规则的精确相位延续至下次换座。根据天体几何关系和采用的规则，可能持续数分钟或许多小时。"),
  q("How important is a void Moon in astrology?", "月亮空亡在占星中重要吗？", "Horary and electional traditions give it particular weight. Other approaches interpret it differently; there is no evidence-based rule that activities begun then must fail.", "卜卦和择时传统较重视空亡，其他流派的理解可能不同。没有实证规则证明在此期间开始的活动必然失败。"),
  q("How frequently do void periods occur?", "月亮多久会出现一次空亡？", "They are assessed before lunar sign ingresses, which occur roughly every two to three days. The monthly count and duration depend on the calculation convention.", "通常在月亮换座前判断空亡，而换座约每两至三天发生一次。每月次数与持续时间取决于计算约定。"),
  q("Can I continue normal activities during a void Moon?", "空亡期间还能正常做事吗？", "Yes. Rest, routine work and finishing tasks remain ordinary options. Treat traditional timing advice as reflection, not a reason to postpone necessary care or responsibilities.", "可以。休息、日常工作与完成既有任务都能照常进行。传统择时建议可供反思，不应成为推迟必要照护或责任的理由。"),
];
export const moonFaq: FaqItem[] = [
  q("Where is the Moon in the zodiac today?", "今天月亮在哪个星座？", "Find today's cell in the selected calendar month. It shows the calculated sign, phase and illumination for its sampling time, not necessarily every hour of that day.", "在所选月份中找到今天的日期格，即可查看取样时刻计算的星座、月相与照明比例；它不代表当天每个小时都相同。"),
  q("How quickly does the lunar sign change?", "月亮多久更换一个星座？", "The Moon crosses a tropical sign roughly every two to three days. Actual ingress times vary; a cell near a boundary depends on its sampling time.", "月亮约每两至三天跨入新的回归黄道星座。实际换座时刻不同，边界附近的日期格会受取样时间影响。"),
  q("How can I work with a lunar calendar?", "如何使用月亮日历？", "Track dates, phases and ingresses, then record your own observations. Symbolic routines such as planning or reflection are optional, not guarantees of favourable outcomes.", "可以追踪日期、月相与换座，并记录个人观察。计划或反思等象征性实践是可选方式，不保证特定结果。"),
  q("Can lunar signs explain my emotions?", "月亮星座会影响情绪吗？", "Astrology associates signs with emotional themes, but a transit is not a diagnosis or proven cause of your mood. Sleep, health and circumstances also matter.", "占星将星座与情绪主题联系，但行运不是情绪诊断，也不是已证实的情绪原因。睡眠、健康与生活处境同样重要。"),
  q("How is a lunar phase different from a lunar sign?", "月相与月亮星座有什么区别？", "Phase describes the changing Sun–Moon angle and visible illumination. A lunar sign identifies a segment of the tropical zodiac; it is not the astronomical constellation boundary.", "月相描述日月夹角与可见照明的变化；月亮星座标记回归黄道的一个区段，并不等于天文学星座的边界。"),
];
export const skyFaq: FaqItem[] = [
  q("Where can I see each planet's current sign?", "如何查看每颗行星当前的星座？", "The planetary table lists signs and degrees for the snapshot timestamp. These are sky positions, distinct from placements calculated for your own birth moment.", "行星表显示快照时间戳对应的星座与度数。这些是当时的天空位置，与按个人出生时刻计算的本命落点不同。"),
  q("Are any planets in retrograde motion?", "当前有行星逆行吗？", "Read the motion column in the current snapshot. Retrograde indicates decreasing apparent geocentric longitude, not a planet physically reversing its orbit.", "查看当前快照的运动状态栏。逆行指地心视黄经减小，并不是行星真的反转轨道方向。"),
  q("What is an aspect between planets?", "行星相位是什么意思？", "An aspect is an angular separation near a chosen reference angle. Conjunction, sextile, square, trine and opposition use 0, 60, 90, 120 and 180 degrees respectively.", "相位是接近指定基准角度的行星角距。合相、六合、四分、三分和对分分别采用 0、60、90、120、180 度。"),
  q("How do transits relate to my own chart?", "行运与我的个人星盘有什么关系？", "Compare a transiting position with natal planets and houses using consistent settings. Shared sky positions do not imply the same experience for everyone.", "使用一致的设置，将行运行星与本命行星和宫位比较。共同的天空位置不意味着每个人都会经历相同事件。"),
  q("When are the sky positions refreshed?", "天空位置何时更新？", "Refer to the displayed calculation timestamp. A refreshed page loads its supplied snapshot; this view should not be treated as a continuously ticking astronomical display.", "请以页面显示的计算时间戳为准。刷新页面会加载传入的快照，不应把这个视图理解为每秒连续更新的天文显示。"),
];
