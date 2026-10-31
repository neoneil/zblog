import type { Copy } from "./explore-config";

export interface ZodiacProfile {
  dates: Copy;
  traits: Copy[];
  strengths: Copy[];
  challenges: Copy[];
  about: Copy[];
  purpose: Copy;
  lesson: Copy;
  sun: Copy;
  moon: Copy;
  rising: Copy;
  midheaven: Copy;
  bestMatches: number[];
}
const c = (en: string, zh: string): Copy => ({ en, zh });
const words = (en: string, zh: string): Copy[] =>
  en.split("|").map((word, i) => c(word, zh.split("|")[i]));

// Original bilingual articles; indices follow the shared Aries-to-Pisces registry.
export const zodiacProfiles: ZodiacProfile[] = [
  {
    dates: c("Mar 21 - Apr 19", "3月21日－4月19日"),
    traits: words("Bold|Active|Pioneering|Direct", "大胆|活跃|开拓|直接"),
    strengths: words(
      "Initiative|Bravery|Candour|Enthusiasm|Independence|Resilience",
      "主动性|勇敢|坦诚|热情|独立|韧性",
    ),
    challenges: words(
      "Impatience|Hasty decisions|Quick temper|Overcompetition|Acting alone",
      "急躁|仓促决定|容易动怒|过度竞争|独自承担",
    ),
    about: [
      c(
        "Aries begins the zodiac with the impulse to act. As a cardinal fire sign associated with Mars, it values a clear challenge and the freedom to try. Its confidence often emerges through doing rather than waiting for perfect certainty.",
        "白羊座以行动的冲动开启黄道。作为由火星守护的基本宫火象星座，它重视明确的挑战与尝试的自由。它的信心往往在实践中建立，而不是等待万无一失。",
      ),
      c(
        "A direct approach can make Aries a refreshing companion. Ideas become experiments quickly, and setbacks rarely end the story. The same speed can overlook details or another person's pace, so a pause can strengthen rather than weaken initiative.",
        "直接的表达让白羊成为坦率的伙伴。想法很快化为尝试，挫折也很少让故事结束。不过，同样的速度可能忽略细节与他人的节奏，因此停顿并不会削弱主动性，反而能让行动更稳。",
      ),
      c(
        "In close relationships, shared adventures and honest conversations matter. Aries appreciates a partner with interests and choices of their own. Mutual independence works best when it includes dependable care, not just permission to go separate ways.",
        "在亲密关系中，共同探索与坦诚沟通很重要。白羊欣赏拥有自己兴趣与选择的伴侣。彼此独立也需要可靠的关怀，而不只是各走各路的自由。",
      ),
      c(
        "Maturity turns raw urgency into purposeful courage. Aries can learn to advocate for a cause without making every disagreement a contest. Its gift is helping something worthwhile begin, then staying present for the responsibilities that follow.",
        "成长让原始的急切转化为有方向的勇气。白羊可以学习为理念发声，而不把每次分歧都变成比赛。它的礼物是让值得的事情开始，并继续承担随之而来的责任。",
      ),
    ],
    purpose: c(
      "Use the courage of a beginning to open possibilities for others, not merely to prove personal strength.",
      "用开启新局的勇气为他人创造可能，而不只是证明自己的力量。",
    ),
    lesson: c(
      "Let awareness guide the first impulse; listening can also be an act of courage.",
      "让觉察引导最初的冲动，倾听也可以是一种勇敢。",
    ),
    sun: c(
      "Identity grows through initiative and the discovery that you can shape a situation. Choose a direction worthy of your energy, and distinguish a genuine calling from the need to win.",
      "自我认同通过主动行动与改变处境的体验而成长。选择值得投入精力的方向，也区分真实的志向与单纯获胜的需要。",
    ),
    moon: c(
      "Feelings may arrive as an urge to move or respond. Physical activity and clear expression can help; allow time to understand a feeling before deciding what it requires.",
      "情绪可能以行动或回应的冲动出现。适当活动与清楚表达有所帮助；决定如何反应之前，也给理解感受留一点时间。",
    ),
    rising: c(
      "You may meet unfamiliar situations with decisiveness and visible energy. Developing patience lets others join your initiative instead of feeling swept along by it.",
      "面对陌生情境时，你可能表现得果断而有活力。培养耐心能让别人主动加入，而不是被你的节奏推着走。",
    ),
    midheaven: c(
      "Public contribution can involve initiating projects, defending a position or leading change. Effective leadership includes preparing others to carry the work forward.",
      "公共贡献可能涉及发起项目、坚持立场或推动改变。有效的领导也包括帮助他人接续这项工作。",
    ),
    bestMatches: [4, 8, 2, 10],
  },
  {
    dates: c("Apr 20 - May 20", "4月20日－5月20日"),
    traits: words(
      "Steady|Patient|Sensory|Persistent",
      "稳定|耐心|重视感官|坚持",
    ),
    strengths: words(
      "Dependability|Endurance|Practicality|Loyalty|Resourcefulness|Calm",
      "可靠|耐力|务实|忠诚|善用资源|沉稳",
    ),
    challenges: words(
      "Rigidity|Possessiveness|Overattachment|Resistance|Overindulgence",
      "固执|占有欲|过度依恋|抗拒改变|过度享受",
    ),
    about: [
      c(
        "Taurus gives an idea roots. This fixed earth sign, associated with Venus, notices texture, comfort and the value of something made well. It prefers a sustainable rhythm to a dramatic but short-lived burst of effort.",
        "金牛座让想法落地生根。这个由金星守护的固定宫土象星座，重视质感、舒适与精心制作的价值。比起短暂而激烈的投入，它更喜欢可持续的节奏。",
      ),
      c(
        "Patience is an active resource for Taurus. Repetition can become mastery, and careful stewardship can turn limited means into something durable. Difficulty appears when protecting stability becomes a refusal to reconsider an outdated arrangement.",
        "耐心是金牛可以主动运用的资源。重复能转化为熟练，细心经营也能让有限资源形成长久价值。需要留意的是，不要让维护稳定变成拒绝调整过时安排。",
      ),
      c(
        "Affection often takes a tangible form: time kept, food shared, a welcoming home or a promise fulfilled. A relationship feels safer when expectations are explicit. Trust grows when closeness leaves room for each person's changing needs.",
        "关爱常以具体形式出现：守约的时间、分享的食物、舒适的家，或兑现的承诺。明确期待让关系更安全，而亲近之中容纳彼此变化的需求，也会加深信任。",
      ),
      c(
        "The deeper invitation is to enjoy the material world without asking it to remove every uncertainty. Taurus can create beauty that supports life, while remembering that possession and belonging are not the same thing.",
        "更深的邀请是享受物质世界，而不要求它消除一切不确定。金牛能够创造滋养生活的美，同时记住拥有与归属并不是同一回事。",
      ),
    ],
    purpose: c(
      "Make values tangible through care, craft and responsible use of resources.",
      "通过关怀、手艺与负责任的资源运用，让价值成为具体的生活。",
    ),
    lesson: c(
      "Build security within yourself as well as around you; change need not erase what matters.",
      "既在外部也在内心建立安全感，变化不一定会抹去珍贵的东西。",
    ),
    sun: c(
      "A steady commitment helps identity take shape. Cultivate what you genuinely value instead of measuring yourself only through what you own.",
      "稳定投入让自我逐渐成形。培养真正珍视的事物，而不只用拥有多少来衡量自己。",
    ),
    moon: c(
      "Familiar rhythms, bodily comfort and reliable affection can be reassuring. Make room for emotional change even when the surroundings stay the same.",
      "熟悉的节奏、身体的舒适与可靠的关爱能带来安定。即使环境没有变化，也要容纳情绪本身的流动。",
    ),
    rising: c(
      "Your approach may be measured, grounded and attentive to the senses. Moving at your own pace works best when it also remains responsive to circumstances.",
      "你的方式可能从容、踏实，也关注感官体验。保持自己的步调，也需要对环境变化作出回应。",
    ),
    midheaven: c(
      "A vocation may centre on creating enduring quality, cultivating resources or caring for the physical environment. Reliability becomes meaningful when it serves a clear value.",
      "职业方向可能围绕持久的品质、资源培育或物质环境的照顾展开。当可靠服务于明确价值时，它就更有意义。",
    ),
    bestMatches: [5, 9, 3, 11],
  },
  {
    dates: c("May 21 - Jun 20", "5月21日－6月20日"),
    traits: words(
      "Curious|Adaptable|Expressive|Quick-minded",
      "好奇|灵活|善于表达|思维敏捷",
    ),
    strengths: words(
      "Versatility|Conversation|Learning|Humour|Connection|Inventiveness",
      "多才多艺|沟通|学习力|幽默|建立联系|巧思",
    ),
    challenges: words(
      "Scattered attention|Restlessness|Overthinking|Inconsistency|Avoiding depth",
      "注意力分散|坐立不安|过度思考|反复变化|回避深入",
    ),
    about: [
      c(
        "Gemini approaches life as an unfolding conversation. A mutable air sign associated with Mercury, it learns by comparing perspectives, asking questions and trying different ways to describe an experience.",
        "双子座把生活看作不断展开的对话。作为由水星守护的变动宫风象星座，它通过比较视角、提出问题与尝试不同表达方式来学习。",
      ),
      c(
        "Its quickness can connect ideas that others keep apart. Variety feeds this ability, but too many open threads may leave little room for completion. Choosing one question to pursue deeply does not cancel the freedom to be curious.",
        "敏捷的思维能将原本分散的想法连在一起。多样体验滋养这种能力，但过多未完成的线索也会消耗精力。选择一个问题深入探索，并不会剥夺好奇的自由。",
      ),
      c(
        "Relationships benefit from lively exchange and permission to keep learning about one another. Gemini appreciates an engaged mind, yet intimacy also needs quiet attention when a feeling cannot be explained neatly.",
        "关系受益于活跃交流，以及持续认识彼此的空间。双子欣赏投入的头脑，不过，当感受无法清楚解释时，亲密关系也需要安静的陪伴。",
      ),
      c(
        "Growth comes from becoming a bridge rather than simply a messenger. By listening for what connects different stories, Gemini can turn information into understanding and cleverness into genuine dialogue.",
        "成长在于成为桥梁，而不只是传递消息。倾听不同故事之间的联系，能让双子把信息转化为理解，把机敏转化为真正的对话。",
      ),
    ],
    purpose: c(
      "Connect people and perspectives through thoughtful communication and an open, questioning mind.",
      "通过细致的沟通与开放的提问，将人与不同视角连接起来。",
    ),
    lesson: c(
      "Stay with an experience long enough for knowledge to become lived understanding.",
      "在体验中多停留一会，让知识转化为切身的理解。",
    ),
    sun: c(
      "Identity develops through learning and exchange. Give your many interests a meaningful thread without forcing them into a single permanent definition.",
      "自我通过学习与交流不断发展。让多种兴趣拥有有意义的线索，而不必将自己固定为唯一的定义。",
    ),
    moon: c(
      "Talking or writing can help you recognise feelings. Let words make contact with emotion rather than becoming a way to move away from it.",
      "交谈或书写有助于认识感受。让语言帮助你接触情绪，而不是成为离开情绪的方式。",
    ),
    rising: c(
      "You may meet the world with questions, observation and conversational ease. Slowing the exchange occasionally makes space for subtler information.",
      "你可能通过提问、观察与自然的交谈认识世界。偶尔放慢交流，也能听见更细微的信息。",
    ),
    midheaven: c(
      "Communication, teaching, translation or connecting different fields may shape your contribution. The task is to make complexity accessible without flattening it.",
      "沟通、教学、翻译或跨领域连接可能成为你的贡献。课题是让复杂内容易于理解，而不抹平它的深度。",
    ),
    bestMatches: [6, 10, 0, 4],
  },
  {
    dates: c("Jun 21 - Jul 22", "6月21日－7月22日"),
    traits: words(
      "Caring|Sensitive|Protective|Perceptive",
      "关怀|敏感|保护欲|善于觉察",
    ),
    strengths: words(
      "Empathy|Loyalty|Memory|Nurturing|Imagination|Attentiveness",
      "共情|忠诚|记忆力|滋养|想象力|细心",
    ),
    challenges: words(
      "Withdrawal|Moodiness|Clinging|Indirect requests|Overprotection",
      "退缩|情绪波动|依恋|间接表达|过度保护",
    ),
    about: [
      c(
        "Cancer notices the emotional atmosphere of a place. This cardinal water sign, associated with the Moon, seeks to create belonging through familiar rituals, care and a sense that individual needs matter.",
        "巨蟹座善于留意一个地方的情感氛围。这个由月亮守护的基本宫水象星座，通过熟悉的仪式、照顾与对个体需求的重视，建立归属感。",
      ),
      c(
        "Memory can be a source of warmth and wisdom. It may also make an old hurt feel present long after a situation changes. Cancer grows by distinguishing a useful protective instinct from a response inherited from the past.",
        "记忆可以带来温暖与智慧，也可能让旧伤在环境变化之后仍显得鲜活。巨蟹的成长在于区分有帮助的保护直觉与沿袭自过去的反应。",
      ),
      c(
        "In relationships, small signs of reliability often matter more than grand declarations. Care becomes more reciprocal when needs are spoken clearly and helping another person does not require abandoning one's own limits.",
        "在关系中，细小而可靠的举动往往比宏大宣言更重要。清楚说出需要，并在照顾别人时保有自己的界限，能让关怀更加双向。",
      ),
      c(
        "The deeper movement is from guarding a private shelter to creating spaces where different people can feel safe. Cancer's sensitivity becomes a strength when compassion is paired with healthy boundaries.",
        "更深的方向是从守护个人避风港，走向创造让不同的人都感到安全的空间。当同理心与健康边界相伴，巨蟹的敏感就能成为力量。",
      ),
    ],
    purpose: c(
      "Create belonging that nourishes growth without requiring everyone to remain unchanged.",
      "创造滋养成长的归属，而不要求每个人始终不变。",
    ),
    lesson: c(
      "Offer care without taking ownership of another person's emotional life.",
      "给予关怀，但不把他人的情绪生活变成自己的责任。",
    ),
    sun: c(
      "Identity is strengthened through meaningful bonds and the places you help sustain. Your own needs belong inside the circle of care too.",
      "有意义的连接与用心维系的空间让自我更坚定。你自己的需要也应该被纳入照顾之中。",
    ),
    moon: c(
      "Emotional rhythms can be vivid and responsive to atmosphere. Rest, privacy and familiar comforts help, alongside naming what is happening now rather than only remembering what happened before.",
      "情感节奏可能鲜明，也容易受氛围影响。休息、独处与熟悉的舒适感有帮助，同时也要辨认此刻，而不只回想过去。",
    ),
    rising: c(
      "Your first response may be to observe, protect and establish trust. Warmth does not require immediate openness; a clear boundary can make connection safer.",
      "你的第一反应可能是观察、保护与建立信任。温暖不意味着立即敞开，清晰边界能让连接更安全。",
    ),
    midheaven: c(
      "Your contribution may involve nurturing people, preserving stories or creating supportive environments. Sustainable care includes structures that support the caregiver.",
      "你的贡献可能是滋养他人、保存故事或创造支持性的环境。可持续的照顾，也需要支持照顾者的结构。",
    ),
    bestMatches: [7, 11, 1, 5],
  },
  {
    dates: c("Jul 23 - Aug 22", "7月23日－8月22日"),
    traits: words(
      "Warm|Creative|Generous|Expressive",
      "温暖|创造力|慷慨|表现力",
    ),
    strengths: words(
      "Confidence|Loyalty|Playfulness|Leadership|Encouragement|Heart",
      "自信|忠诚|玩心|领导力|鼓励他人|真诚",
    ),
    challenges: words(
      "Pride|Seeking approval|Dramatisation|Stubbornness|Dominating",
      "骄傲|寻求认可|夸大感受|固执|主导一切",
    ),
    about: [
      c(
        "Leo brings a personal spark to whatever it touches. A fixed fire sign associated with the Sun, it values creativity, warmth and the courage to be visibly involved in life rather than watching from the edge.",
        "狮子座为参与的事情带来鲜明的个人光彩。作为由太阳守护的固定宫火象星座，它珍视创造、温暖与投入生活的勇气，而不只是站在边缘观看。",
      ),
      c(
        "Recognition can help Leo feel that an offering has reached someone. Trouble comes when applause becomes the only measure of worth. A creative practice sustained in private can restore pleasure in making, independent of an audience.",
        "认可让狮子感到自己的付出被接住。但若掌声成为唯一的价值尺度，也会失去自由。在私人空间持续创作，能让创造本身的快乐重新出现。",
      ),
      c(
        "Love is often expressed generously and with a wish to celebrate the other person. Mutual admiration becomes more nourishing when it includes honest feedback and a willingness to share the centre of attention.",
        "爱常以慷慨与庆祝对方的愿望来表达。当相互欣赏也包括坦诚反馈与分享关注时，关系会更加滋养。",
      ),
      c(
        "Maturity turns self-expression into an invitation for others to shine. Leo can lead through encouragement and wholehearted participation, remembering that genuine dignity does not depend on being the most important person in the room.",
        "成长让自我表达成为邀请别人发光的方式。狮子能以鼓励与全心投入来领导，也记得真正的尊严并不取决于自己是否是房间里最重要的人。",
      ),
    ],
    purpose: c(
      "Offer creativity and heartfelt leadership that awaken confidence in others.",
      "以创造与真诚的领导，唤醒他人的信心。",
    ),
    lesson: c(
      "Let your light be an offering rather than a demand for recognition.",
      "让光芒成为给予，而不是对认可的要求。",
    ),
    sun: c(
      "Identity seeks a creative centre and a wholehearted way to participate. Make room for play and personal authorship without turning every outcome into a verdict on your worth.",
      "自我寻求创造的中心与全心参与的方式。为玩乐与个人表达留出空间，不必让每个结果都成为对价值的判决。",
    ),
    moon: c(
      "Warmth, appreciation and expressive affection can be deeply reassuring. Ask directly for connection rather than testing whether others notice a hidden need.",
      "温暖、欣赏与明确的关爱能带来安慰。直接提出连接的需要，而不是试探别人能否发现隐藏的期待。",
    ),
    rising: c(
      "You may approach life with presence, enthusiasm and a personal signature. Generosity becomes especially powerful when it also makes quieter people feel included.",
      "你可能带着存在感、热情与个人风格面对生活。当慷慨也让安静的人感到被接纳，它就更有力量。",
    ),
    midheaven: c(
      "Creative direction, performance or visible leadership may suit your public path. The lasting work is not just attracting attention, but helping a shared vision come alive.",
      "创意方向、表现或可见的领导角色可能适合你的公共道路。长久的贡献不只在吸引注意，更在让共同愿景成为现实。",
    ),
    bestMatches: [0, 8, 2, 6],
  },
  {
    dates: c("Aug 23 - Sep 22", "8月23日－9月22日"),
    traits: words(
      "Observant|Practical|Discerning|Helpful",
      "善于观察|务实|有辨别力|乐于帮助",
    ),
    strengths: words(
      "Precision|Reliability|Analysis|Craft|Service|Organisation",
      "精准|可靠|分析力|手艺|服务|条理",
    ),
    challenges: words(
      "Perfectionism|Worry|Overcriticism|Overwork|Difficulty receiving",
      "完美主义|担忧|过度挑剔|过劳|难以接受帮助",
    ),
    about: [
      c(
        "Virgo asks how an idea can work in practice. This mutable earth sign, associated with Mercury, notices the small adjustments that make a system clearer, a skill more precise or a daily routine more supportive.",
        "处女座关心想法怎样在实践中运作。这个由水星守护的变动宫土象星座，善于发现细微调整，让系统更清楚、技能更熟练、日常更有支持性。",
      ),
      c(
        "Attention to detail can be a form of care. It becomes exhausting when every imperfection is treated as a personal failure. Virgo benefits from asking whether an improvement serves a real need or simply postpones the moment of completion.",
        "关注细节可以是一种关怀。但若每个缺点都被看作个人失败，就会十分疲惫。处女座可以问自己：改进是在回应真实需要，还是只是推迟完成的时刻。",
      ),
      c(
        "In relationships, practical help and remembering little things often carry affection. Connection deepens when competence is joined by vulnerability: being needed is not the same as being known and loved.",
        "在关系中，实际帮助与记得小事常常承载爱意。当能力也伴随脆弱的分享，连接会更深：被需要与被了解、被爱并不是一回事。",
      ),
      c(
        "The deeper gift is thoughtful service without self-erasure. Virgo can make life more workable while recognising that living systems need rest, variation and a degree of useful messiness.",
        "更深的礼物是在不抹去自己的前提下用心服务。处女座能让生活更好运行，同时承认活的系统也需要休息、变化与适量的不整齐。",
      ),
    ],
    purpose: c(
      "Bring discernment into practical service, refining what supports life rather than chasing flawless appearances.",
      "把辨别力带入实际服务，优化真正支持生活的事物，而不是追逐完美外表。",
    ),
    lesson: c(
      "Let care include yourself; useful and sufficient can be wiser than perfect.",
      "让关怀也包括自己，有用且足够有时比完美更明智。",
    ),
    sun: c(
      "Identity develops through skill, discernment and meaningful contribution. Notice what is already working as carefully as you notice what could be improved.",
      "自我通过技能、辨别与有意义的贡献成长。观察可以改进之处，也同样认真地看见已经做好的部分。",
    ),
    moon: c(
      "Order and small practical steps may soothe uncertainty. Feelings do not always need fixing; sometimes they need patience and a listener.",
      "秩序与具体的小步骤可能缓解不确定感。但情绪不总需要修复，有时只需要耐心与倾听。",
    ),
    rising: c(
      "You may enter situations by observing and finding a useful role. Allow yourself to participate before you have solved every detail.",
      "你可能通过观察与寻找有用的位置进入情境。不必解决所有细节之后，才允许自己参与。",
    ),
    midheaven: c(
      "Analysis, healthful routines, research or skilled service may shape your public work. Build processes that sustain quality without depending on constant personal overextension.",
      "分析、健康日常、研究或专业服务可能塑造你的公共工作。建立能持续保障品质的流程，而不是依靠个人不断透支。",
    ),
    bestMatches: [1, 9, 3, 7],
  },
  {
    dates: c("Sep 23 - Oct 22", "9月23日－10月22日"),
    traits: words(
      "Diplomatic|Sociable|Balanced|Aesthetic",
      "善于协调|重视交往|寻求平衡|审美敏锐",
    ),
    strengths: words(
      "Fairness|Cooperation|Perspective|Charm|Mediation|Taste",
      "公平|合作|多元视角|亲和力|调解|品味",
    ),
    challenges: words(
      "Indecision|People-pleasing|Avoiding conflict|Comparison|Unspoken resentment",
      "犹豫|讨好|回避冲突|比较|隐藏的不满",
    ),
    about: [
      c(
        "Libra is interested in the space between people. A cardinal air sign associated with Venus, it initiates connection through conversation, consideration and a sensitivity to proportion, fairness and beauty.",
        "天秤座关注人与人之间的空间。作为由金星守护的基本宫风象星座，它通过交流、体谅，以及对比例、公平与美的敏感来发起连接。",
      ),
      c(
        "Seeing more than one side can make Libra a thoughtful mediator. It can also delay a decision when every choice seems to disappoint someone. A fair process does not require a result that pleases everyone equally.",
        "看见不止一面，让天秤成为细致的协调者。不过，若每个选择都似乎让人失望，也可能迟迟无法决定。公平的过程并不要求每个人都同样满意。",
      ),
      c(
        "Partnership offers a way to discover the self through exchange. Harmony is strongest when disagreement is safe and individual preferences remain visible. A graceful compromise should not make either person disappear.",
        "伙伴关系让人通过交流发现自己。当分歧可以安全表达、个人偏好也被看见时，和谐才更加稳固。优雅的妥协不应让任何一方消失。",
      ),
      c(
        "Growth means turning the desire for peace into the practice of justice. Libra's gift is building relationships and environments where consideration is mutual and difficult truths can be held with respect.",
        "成长意味着把对平静的愿望转化为对公正的实践。天秤的礼物，是建立彼此体谅的关系与环境，让困难的真相也能被尊重地容纳。",
      ),
    ],
    purpose: c(
      "Create right relationship by bringing fairness, beauty and honest dialogue into shared life.",
      "将公平、美与诚实的对话带入共同生活，建立适当的关系。",
    ),
    lesson: c(
      "Choose balance actively; a clear no can protect a meaningful yes.",
      "主动选择平衡，一个清楚的拒绝也能保护真正愿意的事。",
    ),
    sun: c(
      "Identity grows through cooperation and the testing of personal values in relationship. Your own preference is part of the balance, not an obstacle to it.",
      "自我通过合作与关系中对价值观的检验而成长。自己的偏好也是平衡的一部分，而不是平衡的障碍。",
    ),
    moon: c(
      "Gentle company and a harmonious atmosphere can be reassuring. Make room for untidy feelings instead of requiring every emotion to sound reasonable.",
      "温和的陪伴与和谐的氛围能带来安定。也容纳不够整齐的感受，不必要求每一种情绪都显得合理。",
    ),
    rising: c(
      "You may approach others with courtesy and an instinct for common ground. Staying connected to your own stance gives that diplomacy substance.",
      "你可能以礼貌与寻找共同点的直觉接近他人。与自己的立场保持连接，能让协调更有实质。",
    ),
    midheaven: c(
      "Mediation, design, collaboration or public-facing work may offer a direction. The contribution is strongest when elegance also reflects clear ethical choices.",
      "调解、设计、合作或面向公众的工作可能提供方向。当优雅也体现清晰的价值选择，贡献会更有力量。",
    ),
    bestMatches: [2, 10, 4, 8],
  },
  {
    dates: c("Oct 23 - Nov 21", "10月23日－11月21日"),
    traits: words(
      "Intense|Perceptive|Determined|Private",
      "深刻|洞察|坚定|重视隐私",
    ),
    strengths: words(
      "Depth|Loyalty|Courage|Focus|Resourcefulness|Regeneration",
      "深度|忠诚|勇气|专注|应变力|更新力",
    ),
    challenges: words(
      "Suspicion|Control|Jealousy|Secrecy|Holding grudges",
      "猜疑|控制|嫉妒|封闭|难以释怀",
    ),
    about: [
      c(
        "Scorpio looks beneath an easy explanation. This fixed water sign, associated with Pluto and traditionally Mars, is attentive to trust, emotional truth and the unseen dynamics that shape a situation.",
        "天蝎座会追问轻松解释背后的东西。这个固定宫水象星座由冥王星守护，传统上也对应火星，关注信任、情感真实与塑造处境的隐性动力。",
      ),
      c(
        "Its concentration can support research, healing and sustained change. The difficulty is knowing when vigilance has become a habit of expecting betrayal. Understanding a motive does not mean having to control the person who holds it.",
        "专注能够支持研究、疗愈与持续改变。需要辨认的是，警觉何时变成了预期背叛的习惯。理解一个动机，并不意味着必须控制拥有这个动机的人。",
      ),
      c(
        "Relationships often need authenticity and a dependable container for vulnerability. Trust grows through repeated, transparent agreements rather than tests of loyalty. Privacy can remain healthy without turning into emotional isolation.",
        "关系往往需要真实，也需要能安放脆弱的可靠空间。信任通过反复而透明的约定建立，而不是忠诚测试。隐私可以被保留，而不必变成情感隔离。",
      ),
      c(
        "The deeper work is to meet change without confusing surrender with defeat. Scorpio's capacity for renewal helps it release an exhausted pattern and use hard-won insight with compassion rather than as a weapon.",
        "更深的功课是面对变化，而不把放下误认为失败。天蝎的更新能力，让它能够松开耗尽的模式，并以同理心运用来之不易的洞察，而不是将它化为武器。",
      ),
    ],
    purpose: c(
      "Transform fear and attachment into insight, resilience and a more honest use of power.",
      "将恐惧与依恋转化为洞察、韧性与更诚实的力量运用。",
    ),
    lesson: c(
      "Build trust with openness and boundaries, not with hidden tests.",
      "通过坦诚与界限建立信任，而不是通过隐藏的试探。",
    ),
    sun: c(
      "Identity develops through depth and meaningful transformation. Allow change to reveal new possibilities instead of requiring life to confirm an old defence.",
      "自我在深度与有意义的转变中发展。让变化呈现新的可能，而不要求生活不断证明旧有防御的必要。",
    ),
    moon: c(
      "Feelings can be private and powerful. Safe, steady relationships help you experience intensity without needing either to conceal it completely or act on it immediately.",
      "感受可能深沉而强烈。安全稳定的关系让你能够经历这种强度，而不必完全隐藏，也不必立刻付诸行动。",
    ),
    rising: c(
      "You may observe carefully before revealing yourself. A discerning boundary works best when it can open as trust becomes warranted.",
      "你可能仔细观察之后才展现自己。有辨别力的边界，也应该能在信任逐渐建立时适当打开。",
    ),
    midheaven: c(
      "Investigation, crisis response or work with complex human realities may be meaningful. Ethical handling of confidential knowledge is central to that contribution.",
      "调查、危机应对或面对复杂人类处境的工作可能有意义。合乎伦理地运用私密信息，是这种贡献的核心。",
    ),
    bestMatches: [3, 11, 5, 9],
  },
  {
    dates: c("Nov 22 - Dec 21", "11月22日－12月21日"),
    traits: words(
      "Exploratory|Optimistic|Frank|Visionary",
      "探索|乐观|坦率|富有远见",
    ),
    strengths: words(
      "Curiosity|Humour|Perspective|Independence|Enthusiasm|Generosity",
      "好奇|幽默|视野|独立|热情|慷慨",
    ),
    challenges: words(
      "Overpromising|Restlessness|Bluntness|Dogmatism|Skipping details",
      "过度承诺|不安定|言语直白|教条|忽略细节",
    ),
    about: [
      c(
        "Sagittarius seeks a horizon that makes life feel larger. A mutable fire sign associated with Jupiter, it learns through experience, unfamiliar ideas and the search for a story that connects individual events into meaning.",
        "射手座寻找让生活更开阔的地平线。作为由木星守护的变动宫火象星座，它通过经历、陌生想法与寻找意义来学习，把分散事件连成故事。",
      ),
      c(
        "Optimism can encourage a first step beyond familiar limits. It needs practical support if a large promise is to become a real journey. Curiosity stays alive when a belief can be tested rather than defended at any cost.",
        "乐观鼓励人迈出熟悉范围之外的第一步。但宏大承诺需要实际支持，才能成为真实旅程。当信念能够被检验，而不是不惜代价维护，好奇心才能持续。",
      ),
      c(
        "In relationships, shared discovery and room to breathe matter. Freedom works best with honest agreements about availability and commitment. An independent life can still include the effort of showing up consistently for another person.",
        "在关系中，共同发现与呼吸空间很重要。自由需要关于陪伴与承诺的坦诚约定。独立生活也可以包括持续为另一个人出现的努力。",
      ),
      c(
        "Growth turns the pursuit of answers into a generous willingness to keep learning. Sagittarius can share inspiration without assuming that one philosophy, destination or way of life must fit everyone.",
        "成长让追逐答案转化为愿意持续学习的慷慨。射手可以分享灵感，而不假设一种哲学、一个目的地或一种生活方式适合所有人。",
      ),
    ],
    purpose: c(
      "Seek meaning through experience and share perspective without closing the door to other truths.",
      "通过体验寻找意义，分享视角，也为其他真实保留入口。",
    ),
    lesson: c(
      "Let inspiration become a commitment you can honour, not only a horizon you can admire.",
      "让灵感成为能够兑现的承诺，而不只是值得眺望的远方。",
    ),
    sun: c(
      "Identity expands through exploration and a sense of direction. Ask what you are moving toward, not only what you want to leave behind.",
      "自我通过探索与方向感而扩展。问自己正在走向哪里，而不只是想离开什么。",
    ),
    moon: c(
      "Space, humour and a wider perspective can help with emotional strain. They are most useful when they accompany a feeling rather than rush past it.",
      "空间、幽默与开阔视角能缓解情感压力。但它们应该陪伴感受，而不是催促自己跳过感受。",
    ),
    rising: c(
      "You may greet life with openness and an appetite for possibility. Attention to context helps enthusiasm become an invitation rather than an assumption.",
      "你可能以开放与对可能性的向往迎接生活。留意情境，能让热情成为邀请，而不是想当然。",
    ),
    midheaven: c(
      "Teaching, exploration, publishing or cross-cultural exchange may offer a public direction. Experience gives your message weight when it is paired with intellectual humility.",
      "教学、探索、出版或跨文化交流可能成为公共方向。当经验伴随求知的谦逊，表达就更有分量。",
    ),
    bestMatches: [0, 4, 6, 10],
  },
  {
    dates: c("Dec 22 - Jan 19", "12月22日－1月19日"),
    traits: words(
      "Purposeful|Disciplined|Pragmatic|Patient",
      "有目标|自律|务实|耐心",
    ),
    strengths: words(
      "Persistence|Responsibility|Planning|Endurance|Integrity|Leadership",
      "坚持|责任感|规划|耐力|诚信|领导力",
    ),
    challenges: words(
      "Overwork|Pessimism|Rigidity|Self-judgement|Emotional reserve",
      "过劳|悲观|僵化|自我苛责|情感克制",
    ),
    about: [
      c(
        "Capricorn considers what will stand the test of time. This cardinal earth sign, associated with Saturn, builds through planning, responsibility and a willingness to work with real limits rather than wishing them away.",
        "摩羯座关心什么能够经受时间考验。这个由土星守护的基本宫土象星座，通过规划、责任与面对实际限制的意愿来建设，而不只是希望限制消失。",
      ),
      c(
        "Long-range thinking can turn an intimidating goal into manageable stages. It becomes heavy when every stage is judged only by what remains unfinished. Progress needs acknowledgement as well as the next plan.",
        "长期思考能把令人畏惧的目标化为可管理的阶段。但若每一阶段都只用未完成的部分来评价，也会变得沉重。进展需要被承认，而不只是需要下一个计划。",
      ),
      c(
        "Commitment may be shown through practical reliability and shared responsibilities. Emotional closeness also asks for unproductive time together, honest uncertainty and permission to receive support instead of always providing it.",
        "承诺可能通过实际的可靠与共同承担责任来表达。但情感亲近也需要不以产出为目的的相处、诚实的不确定，以及接受支持而不总是提供支持的许可。",
      ),
      c(
        "The deeper invitation is to use authority in service of something humane. Capricorn can create structures that protect what matters, while remembering that a successful life must have room to be lived.",
        "更深的邀请是让权威服务于有温度的目标。摩羯能够建立保护重要事物的结构，也记得成功的生活必须留出真正生活的空间。",
      ),
    ],
    purpose: c(
      "Build lasting structures whose strength supports people rather than merely demonstrating achievement.",
      "建立持久的结构，让力量支持人，而不只是展示成就。",
    ),
    lesson: c(
      "Rest and vulnerability belong within a responsible life, not outside it.",
      "休息与脆弱属于负责任的生活之中，而不是生活之外。",
    ),
    sun: c(
      "Identity develops through responsibility and the gradual mastery of a chosen path. Define success in values you can inhabit, not only milestones you can display.",
      "自我通过责任与对道路的逐步掌握而发展。用能够亲身生活的价值定义成功，而不只是可供展示的里程碑。",
    ),
    moon: c(
      "Competence and predictability may help you feel secure. Let feelings have a place even when there is no immediate plan for solving them.",
      "能力与可预期性可能带来安全感。即使暂时没有解决计划，也让感受拥有位置。",
    ),
    rising: c(
      "You may approach situations carefully and with a sense of duty. Warmth can coexist with seriousness; you need not earn every moment of ease.",
      "你可能谨慎而有责任感地面对情境。温暖与认真可以并存，不必为每一刻轻松都先付出代价。",
    ),
    midheaven: c(
      "Organisation, stewardship or institution-building may be part of your public path. Mature authority creates clear expectations and makes accountability possible for everyone.",
      "组织、管理或制度建设可能是公共道路的一部分。成熟的权威建立清晰期待，也让每个人都能够承担责任。",
    ),
    bestMatches: [1, 5, 7, 11],
  },
  {
    dates: c("Jan 20 - Feb 18", "1月20日－2月18日"),
    traits: words(
      "Original|Independent|Collective-minded|Inventive",
      "原创|独立|关注群体|善于创新",
    ),
    strengths: words(
      "Vision|Fairness|Innovation|Objectivity|Friendship|Principle",
      "远见|公平|创新|客观|友谊|原则",
    ),
    challenges: words(
      "Detachment|Contrariness|Fixed opinions|Abstraction|Emotional distance",
      "疏离|逆反|固守观点|过度抽象|情感距离",
    ),
    about: [
      c(
        "Aquarius asks whether a familiar arrangement could be redesigned. A fixed air sign associated with Uranus and traditionally Saturn, it combines an interest in new possibilities with a commitment to principles and collective life.",
        "水瓶座会问：熟悉的安排是否可以重新设计。作为由天王星守护、传统上对应土星的固定宫风象星座，它把对新可能的兴趣与对原则、群体生活的投入结合起来。",
      ),
      c(
        "Distance from convention can reveal a useful alternative. Yet an unconventional idea can become as rigid as the rule it replaces. Aquarius grows by testing a vision against lived experience and listening to the people affected by it.",
        "与惯例保持距离，能够发现有用的替代方案。但不寻常的想法，也可能像被替换的规则一样僵硬。水瓶通过实际体验检验愿景，并倾听受到影响的人而成长。",
      ),
      c(
        "Friendship and respect for individuality are often central to love. A relationship needs more than intellectual agreement: everyday tenderness and specific acts of care bring a shared ideal into human scale.",
        "友谊与对个体性的尊重，往往是爱的核心。不过，关系不只需要思想一致：日常温柔与具体关怀，让共同理想回到人的尺度。",
      ),
      c(
        "The deeper gift is a future-minded contribution that does not lose contact with the present person. Aquarius can help a community evolve while allowing belonging to include difference, vulnerability and unfinished understanding.",
        "更深的礼物是面向未来的贡献，同时不忽略眼前具体的人。水瓶能够帮助社群发展，也让归属容纳差异、脆弱与尚未完成的理解。",
      ),
    ],
    purpose: c(
      "Bring original thought into service of communities where individuality and shared responsibility can coexist.",
      "让原创思考服务于社群，使个体性与共同责任能够并存。",
    ),
    lesson: c(
      "Let human feeling refine the ideal rather than treating it as an obstacle to clear thought.",
      "让人的感受完善理想，而不把它视为清晰思考的障碍。",
    ),
    sun: c(
      "Identity grows through independent thought and participation in something larger. Difference becomes meaningful when it contributes, not only when it separates.",
      "自我通过独立思考与参与更大共同体而成长。差异在形成贡献时更有意义，而不只是用于区分。",
    ),
    moon: c(
      "Space and perspective can help you process feelings. Naming your own emotional stake brings closeness without requiring you to abandon independence.",
      "空间与视角有助于整理感受。说出自己真正关心的部分，能带来亲近，而不必放弃独立。",
    ),
    rising: c(
      "You may approach the world experimentally and resist expected roles. Curiosity about an individual person can balance a strong understanding of systems.",
      "你可能以实验性的方式面对世界，也不愿局限于预设角色。对具体个人的好奇，能平衡对系统的深刻理解。",
    ),
    midheaven: c(
      "Innovation, networks or work toward social change may shape your contribution. A useful future is built with people, not simply designed on their behalf.",
      "创新、网络或推动社会改变的工作可能塑造你的贡献。有用的未来需要与人共同建设，而不是仅仅替他们设计。",
    ),
    bestMatches: [2, 6, 0, 8],
  },
  {
    dates: c("Feb 19 - Mar 20", "2月19日－3月20日"),
    traits: words(
      "Imaginative|Compassionate|Receptive|Intuitive",
      "富有想象|慈悲|善于感受|直觉敏锐",
    ),
    strengths: words(
      "Empathy|Artistry|Gentleness|Adaptability|Intuition|Generosity",
      "共情|艺术性|温柔|适应力|直觉|慷慨",
    ),
    challenges: words(
      "Overwhelm|Escapism|Idealisation|Unclear boundaries|Self-sacrifice",
      "容易过载|逃避|理想化|界限模糊|自我牺牲",
    ),
    about: [
      c(
        "Pisces notices what is difficult to put into words. This mutable water sign, associated with Neptune and traditionally Jupiter, is receptive to atmosphere, imagination and the subtle connections between one life and another.",
        "双鱼座善于感受难以言说的事物。这个由海王星守护、传统上对应木星的变动宫水象星座，对氛围、想象与不同生命之间细微的连接保持开放。",
      ),
      c(
        "Sensitivity can become art, compassionate listening or a vivid symbolic life. It can also be tiring when every surrounding emotion feels personal. Grounding habits help Pisces distinguish an inner response from a responsibility that is not its own.",
        "敏感可以转化为艺术、富有同理心的倾听或生动的象征体验。但若周围每一种情绪都像属于自己，也会十分疲惫。扎根日常的习惯，帮助双鱼区分内在反应与并不属于自己的责任。",
      ),
      c(
        "Love may carry great tenderness and a wish to understand the other person fully. Healthy intimacy leaves room for disappointment and difference, rather than requiring a partner to remain an ideal or a person to be rescued.",
        "爱可能带着深深的温柔，以及完整理解对方的愿望。健康的亲密也容纳失望与差异，而不要求伴侣始终是理想形象，或永远是需要拯救的人。",
      ),
      c(
        "The deeper work is to keep the heart open while retaining a clear sense of self. Pisces can bring imagination and compassion into ordinary life, making beauty and care practical rather than using them only as a refuge from the world.",
        "更深的功课是在敞开心的同时，保有清晰的自我。双鱼能够把想象与同理心带入日常，让美与关怀成为实际行动，而不只是逃离世界的避风港。",
      ),
    ],
    purpose: c(
      "Give compassion a usable form through imagination, care and a felt sense of connection.",
      "通过想象、关怀与真实的连接感，让慈悲拥有可实践的形式。",
    ),
    lesson: c(
      "A boundary can protect the sensitivity that makes generous care possible.",
      "边界能够保护敏感，而这种敏感正是慷慨关怀的来源。",
    ),
    sun: c(
      "Identity develops through imagination and a capacity to see beyond rigid separations. A clear commitment can give a wide inner world a helpful outward form.",
      "自我通过想象与超越僵硬区分的能力而发展。清晰承诺能让广阔的内在世界获得有帮助的外在形式。",
    ),
    moon: c(
      "Emotional receptivity may make atmosphere and rest especially important. Quiet time, creative expression and explicit limits help you remain open without becoming overwhelmed.",
      "情感上的接收能力，可能让氛围与休息格外重要。安静时间、创意表达与明确界限，让你保持开放而不被淹没。",
    ),
    rising: c(
      "You may meet life through intuition, empathy and subtle observation. Checking an impression against concrete information makes sensitivity more reliable.",
      "你可能通过直觉、共情与细微观察面对生活。将感受与具体信息相互核对，能让敏感更加可靠。",
    ),
    midheaven: c(
      "Artistic, supportive or imaginative work may form a meaningful public direction. Sustainable service asks for a practical container as well as an open heart.",
      "艺术、支持性或富于想象的工作，可能成为有意义的公共方向。可持续的服务既需要开放的心，也需要实际的承载结构。",
    ),
    bestMatches: [3, 7, 1, 9],
  },
];
