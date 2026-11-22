type Reflection = readonly [string, string, string, string, string, string, string, string];

const reflections: readonly Reflection[] = [
  ["THE FIRST SPARK","最初的火花","微小的好奇心，也值得认真对待。","什么念头最近反复来找我？","给它五分钟，写下第一步。","A small curiosity deserves your attention.","What idea keeps returning to me?","Give it five minutes and write down a first step."],
  ["DEEPER CONNECTION","更深的连接","让人靠近的，往往是一句实话。","我愿意向谁多说一点真实感受？","给那个人发一条真诚的问候。","A little honesty can make room for closeness.","Who could I share a little more of myself with?","Send them a sincere hello."],
  ["THE BRIDGE OF TRUST","信任之桥","信任可以从守住一件小事开始。","什么小承诺能让我更信任自己？","今天兑现一个力所能及的承诺。","Trust can begin with one small promise kept.","What small promise would help me trust myself?","Keep one promise you can manage today."],
  ["GENTLE BOUNDARIES","温柔的界线","给自己留出空间，也是照顾关系。","哪件事我想温柔地说不？","写下一句清楚而温和的拒绝。","Making room for yourself can also care for a relationship.","Where would I like to say a gentle no?","Write one clear, kind refusal."],
  ["THE ART OF LETTING GO","放下的艺术","有些重量，可以先放下一个晚上。","我现在还背着什么已经结束的事？","写下它，合上本子。","Some weight can be set down for one evening.","What finished story am I still carrying?","Write it down and close the notebook."],
  ["SELF-LOVE RADIANCE","自爱的光","你也值得收到自己给别人的耐心。","此刻我可以怎样善待自己？","做一件让身体舒服一点的小事。","You deserve the patience you offer others.","How could I be kinder to myself right now?","Do one small thing that comforts your body."],
  ["THE FIRE OF COURAGE","勇气之火","心里有一点害怕，脚步仍然可以很小。","什么事值得我试一次？","做那个最容易回头的小尝试。","A little fear can come along on a small step.","What is worth trying once?","Take the smallest reversible step."],
  ["THE COURAGE TO BE REAL","真实的勇气","一句诚实的话，可以让今天松一口气。","我在哪里一直假装没事？","给自己写一句诚实的话。","One honest sentence can give the day room to breathe.","Where have I been pretending I am fine?","Write one honest sentence to yourself."],
  ["RADIATING ACCEPTANCE","接纳之光","今天的自己，也可以被温柔对待。","我最想与自己和解的是什么？","用对朋友的口吻安慰自己。","Who you are today is worthy of tenderness.","What part of myself would I like to make peace with?","Offer yourself the words you would give a friend."],
  ["THE CROWN WITHIN","心中的王冠","内在的尊严，藏在你如何称呼自己。","我忽略了自己的哪一份努力？","写下一件值得自己肯定的事。","Dignity lives in the way you speak to yourself.","What effort of mine have I overlooked?","Name one thing you can give yourself credit for."],
  ["THE PATH OF GROWTH","成长之路","缓慢的变化，也在积累。","哪件事现在比过去容易了一点？","记下一个以前做不到的小进步。","Slow changes are still adding up.","What has become a little easier over time?","Record one small thing you can now do."],
  ["THE SOURCE OF PEACE","宁静的源头","片刻安静，可以从一次慢慢的呼气开始。","什么让我感到踏实？","放下手机，慢慢呼吸三次。","A quiet moment can begin with one slow exhale.","What helps me feel grounded?","Put the phone down for three slow breaths."],
  ["A MEANINGFUL CHOICE","有意义的选择","一件小选择，也能照见你在乎的事。","哪个选项更贴近我想守住的价值？","写下一个价值和一个相应的行动。","A small choice can show what matters to you.","Which option fits a value I want to honor?","Write down one value and one action that fits it."],
  ["THE WISDOM OF WAITING","等待的智慧","留一点时间，答案也许会更清楚。","哪件事可以等到明天再决定？","约定一个重新考虑的时间。","A little time can bring an answer into focus.","What decision can wait until tomorrow?","Choose a time to revisit it."],
  ["EMBRACING CHANGE","拥抱变化","改变的日子里，可以带上熟悉的小习惯。","最近的变化里，什么让我不安？","保留一个让自己安定的习惯。","Take one familiar ritual into a season of change.","What feels uncertain in this change?","Keep one grounding habit today."],
  ["THE DOOR TO THE UNKNOWN","未知之门","好奇心可以先敲门。","如果只探索，不急着决定，我会去哪儿？","花十分钟了解一个陌生选项。","Curiosity can knock before you commit.","What would I explore if I did not need to decide?","Spend ten minutes learning about one option."],
  ["A CLEARER DIRECTION","清晰的方向","看清下一步，今天就已经足够。","哪件事完成后，会让我更有方向感？","把它写成一个具体的小任务。","Seeing the next step can be enough for today.","What would give me a little more direction?","Turn it into one concrete task."],
  ["TAKING ACTION","开始行动","开始可以小到只有两分钟。","我在哪件事上等得太久？","设两分钟计时器，做一点点。","A beginning can be as small as two minutes.","What have I been waiting to start?","Set a two-minute timer and do a little."],
  ["THE LIGHT OF HOPE","希望之光","一点可期待的事，就能照亮普通的一天。","明天有什么小事值得期待？","为它提前准备一样东西。","One thing to look forward to can brighten an ordinary day.","What small thing might I enjoy tomorrow?","Prepare one thing for it tonight."],
  ["A GRATEFUL HEART","感恩之心","把被照顾的时刻记下来，心里会多一点暖意。","今天谁或什么轻轻帮了我一下？","写一句具体的感谢。","Remembering a moment of care can warm the day.","Who or what helped me a little today?","Write one specific thank-you."],
  ["THE DOOR OF OPPORTUNITY","机会之门","有些机会可以先从一次询问开始。","哪扇门值得我敲一下？","发出一条简单的询问。","Some opportunities begin with a simple question.","Which door might be worth knocking on?","Send one straightforward inquiry."],
  ["THE FLOW OF ABUNDANCE","丰盛的流动","你已经拥有的资源，有些正在等你使用。","今天我手边有哪些可用的支持？","列出三样，选一样用起来。","Some resources you already have are waiting to be used.","What support is within reach today?","List three resources and use one."],
  ["THE GUARDIAN STAR","守护之星","有人可以陪你把难事分成小块。","我最希望在哪件事上得到帮助？","向可信的人提出一个具体请求。","Someone may be able to help make a hard thing smaller.","Where would help matter most?","Make one specific request to someone you trust."],
  ["THE JOYFUL MOMENT","欢喜一刻","快乐可以落在一口茶、一段歌里。","最近什么曾让我由衷微笑？","给那件小事留出十分钟。","Joy can live in a sip of tea or a song.","What made me smile without trying?","Give that small thing ten minutes."],
  ["A WELL-DESERVED REST","值得拥有的休息","休息是身体的需要，也是一种照顾。","身体正用什么方式提醒我慢下来？","安排十五分钟的休息。","Rest is a need and a way of caring for yourself.","How is my body asking me to slow down?","Set aside fifteen minutes to rest."],
  ["THE RAIN OF FORGIVENESS","宽恕之雨","放松一点自责，可以腾出力气去修补。","我还在为什么反复责备自己？","写下一件想做的修补小事。","Loosening self-blame can leave energy for repair.","What am I still blaming myself for?","Write down one small repair you could make."],
  ["SAYING GOODBYE","好好告别","结束也可以被安静地纪念。","哪段经历值得我好好道别？","写下它留给你的一样东西。","An ending can be remembered quietly.","What experience deserves a proper goodbye?","Name one thing it left with you."],
  ["GENTLE COMPASSION","温柔的慈悲","理解可以从承认此刻不容易开始。","如果这是朋友的处境，我会说什么？","把那句话也说给自己听。","Understanding can start by admitting this moment is hard.","What would I say to a friend in this situation?","Say those words to yourself too."],
  ["THE POWER OF RENEWAL","重新开始的力量","普通的一天也容得下一个重新开始。","我想从哪件小事重新开始？","清出一点空间，把需要的东西摆好。","An ordinary day has room for a fresh start.","What small thing would I like to start again?","Clear a little space and lay out what you need."],
  ["INNER TRANQUILITY","内在的平静","你可以在忙碌里找一小段空白。","我什么时候最能听见自己的想法？","安静坐一分钟，听听身边的声音。","You can find a small pause in a busy day.","When can I hear my own thoughts most clearly?","Sit for one minute and notice the sounds around you."],
  ["THE GIFT OF TIME","时间的礼物","把时间留给在乎的事，是一种选择。","今天我愿意把十分钟给谁或给什么？","把这十分钟写进日历。","Giving time to what matters is a choice you can make.","Who or what would I give ten minutes to today?","Put those ten minutes on your calendar."],
  ["THE VOICE OF INTUITION","直觉的声音","先听听那份感觉，再看看它来自哪里。","这个念头更像好奇、担心，还是别的什么？","记下感受和一个能核实的事实。","Listen to the feeling, then consider where it comes from.","Does this impulse feel like curiosity, worry, or something else?","Write down the feeling and one fact you can check."],
  ["THE POWER OF PATIENCE","耐心的力量","需要时间的事，可以按自己的节奏生长。","我在催促什么本来需要时间的事？","选一个可以放慢的环节。","Things that need time can grow at their own pace.","What am I rushing that naturally takes time?","Choose one part of the process to slow down."],
  ["THE ART OF BALANCE","平衡的艺术","多给一边一点照顾，今天就能更平衡。","什么用了我太多精力，什么得到太少？","从前者挪出十分钟给后者。","A little care for one neglected area can help restore balance.","What has taken too much energy, and what has had too little?","Move ten minutes from the first to the second."],
  ["DEEPER AWARENESS","更深的觉察","轻轻说出感受，有时就看清了一点。","此刻的情绪在身体哪里最明显？","写下一个情绪词和一个身体感受。","Gently naming a feeling can make it a little clearer.","Where do I notice this emotion in my body?","Write one emotion word and one bodily sensation."],
  ["THE WIND OF FREEDOM","自由之风","一个自己做的选择，可以给今天打开一点空间。","如果少一点顾虑，我会允许自己做什么？","做一件安全、轻松、由你决定的小事。","One choice of your own can make a little room in the day.","What would I allow myself with a little less worry?","Do one safe, easy thing entirely by choice."],
];

export const starCards = reflections.map(([en, zh, messageZh, questionZh, actionZh, messageEn, questionEn, actionEn], index) => {
  const id = index + 1;
  const filename = id === 4 ? " GENTLE BOUNDARIES" : id === 6 ? "SEFL-LOVE RADIANCE" : en;
  return {
    id,
    key: `star-message/${id}.${filename}.png`,
    title: { zh, en },
    message: { zh: messageZh, en: messageEn },
    question: { zh: questionZh, en: questionEn },
    action: { zh: actionZh, en: actionEn },
  };
});

export function getStarCard(id: number) {
  return Number.isInteger(id) && id > 0 ? starCards[id - 1] : undefined;
}
