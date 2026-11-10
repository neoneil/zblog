import type { LocalizedCopy as Copy } from "@/components/site/preferences-provider";

type InlinePart = string | { label: string; href?: string };
export type ServiceParagraph = Copy | { en: InlinePart[]; zh: InlinePart[] };
export type ServiceSection = {
  id: string;
  title: Copy;
  tagline?: Copy;
  paragraphs?: ServiceParagraph[];
  lists?: { title: Copy; items: Copy[] }[];
  highlights?: { label: Copy; text: Copy }[];
  note?: Copy;
  cta?: Copy;
};
export type ServiceGuide = {
  tagline: Copy;
  introduction: ServiceParagraph[];
  sections: ServiceSection[];
  closing: { title: Copy; tagline: Copy; paragraphs: Copy[]; disclaimer: Copy };
};
const c = (zh: string, en: string): Copy => ({ zh, en });
const academy = "/parentinglab/healingdaily/videos?category=general";
const annualCta = c("开通年度会员", "BECOME AN ANNUAL MEMBER");
const monthlyCta = c("开通月度会员", "BECOME A MONTHLY MEMBER");
const audience = c("适合人群", "Who This Is For");
const value = c("核心价值", "Core Value");
const courseFocus = c("课程重点包括", "Course Focus");
const consultationTopics = c(
  "咨询内容可根据个人需求选择",
  "Choose the Themes for Your Consultation",
);
const purchaseBenefits = c("单次购买权益", "Your Standalone Session Includes");
const monthlyBenefits = c("月度会员专属权益", "Monthly Member Benefits");
const journey = c("你的探索之旅，由此开启", "YOUR JOURNEY BEGINS HERE");
const monthlyNote = c(
  "重要说明：每个有效会员月仅限一次15分钟在线咨询。该权益仅在对应会员月内有效，未使用的咨询时间不累计、不结转至下个月，也不能兑换现金。预约需在当月会员有效期内完成，具体以网站公布的预约规则为准。",
  "Important: Each active membership month includes one 15-minute online consultation. This benefit is valid only within that membership month. Unused time does not accumulate, roll over to the following month, or have a cash value. Bookings must be completed within the active membership month and are subject to the booking rules published on the website.",
);
const memberAccess = [
  c(
    "同时享受 STELLARNESTS 其他所有适用于付费会员的权益，包括会员开放的塔罗工具、占星工具及学习资源。",
    "Also enjoy all other STELLARNESTS benefits available to paid members, including member-access tarot tools, astrology tools and learning resources.",
  ),
  c(
    "在会员有效期内，按会员权限使用网站相关服务。",
    "Use the relevant website services according to your membership permissions throughout the active membership period.",
  ),
];

export const serviceGuides: Partial<Record<string, ServiceGuide>> = {
  "transits-course": {
    tagline: c(
      "学习星辰的语言，探索内在的智慧。",
      "Learn the Language of the Stars. Discover the Wisdom Within.",
    ),
    introduction: [
      c(
        "占星学不仅仅是十二星座的性格描述，更是一套由行星、星座、宫位、相位和时间周期构成的古老象征体系。",
        "Astrology is more than a description of the twelve zodiac personalities. It is an ancient symbolic system built around planets, signs, houses, aspects and cycles of time.",
      ),
      c(
        "在 STELLARNESTS，我们希望帮助你从零开始，逐步建立系统化的占星知识，学会阅读个人出生星盘，理解不同占星元素之间的联系，并培养独立分析星盘的能力。",
        "At STELLARNESTS, we help you begin from the foundations and build a systematic understanding of astrology: learning to read a natal chart, connect its different elements, and develop the ability to analyse a chart independently.",
      ),
      c(
        "无论你希望按照自己的节奏探索占星学，还是通过专业指导深入研究，我们都为你提供适合的学习方式。",
        "Whether you want to explore astrology at your own pace or deepen your studies with professional guidance, we offer a learning approach to suit you.",
      ),
    ],
    sections: [
      {
        id: "advanced-course",
        title: c(
          "占星进阶课程 · 录播自学 + 一对一在线指导20小时",
          "Advanced Astrology Course · Recorded Self-Study + 20 Hours of One-to-One Online Guidance",
        ),
        tagline: c(
          "从学习占星知识，走向独立星盘解析。",
          "Go Beyond Knowledge. Learn to Interpret.",
        ),
        paragraphs: [
          c(
            "如果你希望进一步掌握占星分析技巧，仅仅观看视频可能还不足以解决学习过程中遇到的具体问题。",
            "If you want to develop your astrological analysis skills further, watching videos alone may not answer the specific questions that arise during your studies.",
          ),
          c(
            "STELLARNESTS 占星进阶课程将录播自学与一对一在线指导相结合，让你在掌握基础理论的同时，通过实际星盘案例练习，逐步提升分析与解释能力。",
            "The STELLARNESTS Advanced Astrology Course combines recorded self-study with one-to-one online guidance. Alongside foundational theory, practical chart examples help you steadily develop your analytical and interpretive skills.",
          ),
        ],
        lists: [
          {
            title: courseFocus,
            items: [
              c(
                "系统学习占星术录播课程内容。",
                "Work systematically through the recorded astrology course.",
              ),
              c(
                "在一对一在线指导中解答学习疑问。",
                "Resolve study questions through one-to-one online guidance.",
              ),
              c(
                "练习个人出生星盘的综合分析。",
                "Practise synthesising the different factors in a natal chart.",
              ),
              c(
                "学习整合行星、宫位与相位之间的关系。",
                "Learn to connect planets, houses and aspects in a coherent interpretation.",
              ),
              c(
                "根据学习进度获得针对性的分析建议。",
                "Receive focused analytical guidance matched to your learning progress.",
              ),
            ],
          },
        ],
        highlights: [
          {
            label: audience,
            text: c(
              "希望深入学习占星学、提升星盘解析能力，或有志于继续研究占星咨询方法的学习者。",
              "Learners who want to deepen their knowledge of astrology, improve chart interpretation, or continue exploring astrological consultation methods.",
            ),
          },
          {
            label: value,
            text: c(
              "不只是学习占星知识，更是在个性化指导下，将理论转化为实际分析能力。",
              "Go beyond acquiring knowledge: turn theory into practical analytical ability with personalised guidance.",
            ),
          },
        ],
      },
      {
        id: "annual-membership",
        title: c(
          "年度会员 · 占星视频自学",
          "ANNUAL MEMBERSHIP · Astrology Video Self-Study",
        ),
        tagline: c(
          "按照自己的节奏，开启占星探索之旅。",
          "Learn at Your Own Pace.",
        ),
        paragraphs: [
          {
            zh: [
              "加入 STELLARNESTS 年度付费会员，即可在会员有效期内进入「",
              { label: "星学影苑（Astrology Video Academy）", href: academy },
              "」，观看会员开放的占星术录播视频课程。",
            ],
            en: [
              "Become a STELLARNESTS annual paid member to access the ",
              { label: "Astrology Video Academy", href: academy },
              " during your membership and watch the recorded astrology courses available to members.",
            ],
          },
          c(
            "通过系统的视频学习，逐步认识行星、十二星座、宫位、相位以及个人星盘的基础分析方法。",
            "Through structured video study, gradually learn about planets, the twelve zodiac signs, houses, aspects and the foundations of natal-chart analysis.",
          ),
        ],
        highlights: [
          {
            label: audience,
            text: c(
              "占星初学者、神秘学爱好者，以及希望灵活安排学习时间的自主学习者。",
              "Astrology beginners, esoteric enthusiasts and independent learners who want flexible study times.",
            ),
          },
          {
            label: value,
            text: c(
              "不受固定上课时间限制，以自主学习的方式持续积累占星知识，同时享受年度会员的其他权益。",
              "Build your knowledge through self-directed study without fixed class times, while enjoying the other benefits of annual membership.",
            ),
          },
        ],
        cta: annualCta,
      },
    ],
    closing: {
      title: journey,
      tagline: c(
        "星辰提供象征，而你赋予它们意义。",
        "The Stars Offer Symbols. You Create Meaning.",
      ),
      paragraphs: [
        c(
          "选择适合自己的学习道路，在 STELLARNESTS 开启属于你的占星研习之旅。",
          "Choose the learning path that suits you and begin your own astrology journey with STELLARNESTS.",
        ),
      ],
      disclaimer: c(
        "课程属于占星文化、象征体系与解释方法的教育性学习，不保证预测结果，也不替代专业医疗、心理、法律或财务建议。",
        "This course provides educational study of astrological culture, symbolism and interpretation. It does not guarantee predictive outcomes or replace professional medical, psychological, legal or financial advice.",
      ),
    },
  },
  "tarot-course": {
    tagline: c(
      "探索塔罗的语言，唤醒内在的智慧。",
      "Discover the Language of Tarot. Awaken the Wisdom Within.",
    ),
    introduction: [
      c(
        "塔罗不仅仅是78张神秘的卡牌，更是一套融合象征、哲学、心理原型与生命经验的古老智慧体系。",
        "Tarot is more than a collection of 78 mysterious cards. It is an ancient wisdom tradition that brings together symbolism, philosophy, psychological archetypes and lived experience.",
      ),
      c(
        "每一张塔罗牌，都承载着独特的图像语言与象征意义。从愚者的旅程到世界的完成，从大阿尔卡纳的生命主题到小阿尔卡纳的日常经验，塔罗为我们提供了一种探索内心、理解关系与反思人生选择的方式。",
        "Every tarot card carries its own visual language and symbolic meaning. From the Fool's journey to the completion of the World, and from the Major Arcana's life themes to the Minor Arcana's everyday experiences, tarot offers a way to explore our inner lives, understand relationships and reflect on our choices.",
      ),
      {
        zh: [
          "在 STELLARNESTS，我们希望帮助你从零开始，系统学习",
          { label: "韦特塔罗（Rider–Waite Tarot）" },
          "与",
          { label: "透特塔罗（Thoth Tarot）" },
          "的基础知识，逐步理解78张塔罗牌的象征意义、牌阵结构与解读方法，并培养独立分析塔罗牌的能力。",
        ],
        en: [
          "At STELLARNESTS, we help you start from the foundations and study ",
          { label: "Rider–Waite Tarot" },
          " and ",
          { label: "Thoth Tarot" },
          " systematically. Gradually understand the symbolism of all 78 cards, spread structures and reading methods, while developing the ability to analyse tarot independently.",
        ],
      },
      c(
        "无论你希望按照自己的节奏探索塔罗智慧，还是通过一对一指导深入研究塔罗解读与咨询技巧，我们都为你提供适合的学习方式。",
        "Whether you want to explore tarot wisdom at your own pace or deepen your reading and consultation skills through one-to-one guidance, we offer a learning approach to suit you.",
      ),
    ],
    sections: [
      {
        id: "advanced-course",
        title: c(
          "塔罗进阶课程 · 录播自学 + 一对一在线指导20小时",
          "Advanced Tarot Course · Recorded Self-Study + 20 Hours of One-to-One Online Guidance",
        ),
        tagline: c(
          "超越牌面含义，深入掌握塔罗解读的艺术。",
          "Go Beyond the Cards. Master the Art of Interpretation.",
        ),
        paragraphs: [
          c(
            "真正理解塔罗，并不只是记住每张牌的关键词，而是能够结合问题背景、牌阵位置、象征元素及不同卡牌之间的联系，形成清晰、有逻辑的综合解读。",
            "Truly understanding tarot means more than memorising keywords. It means bringing together the question's context, spread positions, symbolic elements and the relationships between cards to form a clear, coherent reading.",
          ),
          c(
            "如果你希望进一步提升塔罗分析能力，仅仅观看录播视频可能还不足以解决实际练习中遇到的具体问题。",
            "If you want to strengthen your tarot analysis, recorded videos alone may not resolve the specific questions that arise in practice.",
          ),
          c(
            "STELLARNESTS 塔罗进阶课程将系统化录播学习与一对一在线指导相结合，帮助你在掌握塔罗理论的同时，通过真实或模拟的案例练习，逐步建立自己的解读思路与表达能力。",
            "The STELLARNESTS Advanced Tarot Course combines structured recorded learning with one-to-one online guidance. Alongside tarot theory, real or simulated case studies help you build your own approach to interpretation and communication.",
          ),
        ],
        lists: [
          {
            title: courseFocus,
            items: [
              c(
                "系统学习韦特塔罗与透特塔罗的基础知识及象征体系。",
                "Study the foundations and symbolic systems of Rider–Waite and Thoth Tarot systematically.",
              ),
              c(
                "深入理解78张塔罗牌的含义、原型与相互关系。",
                "Deepen your understanding of the meanings, archetypes and relationships of all 78 cards.",
              ),
              c(
                "学习单张牌、三张牌及多牌阵的综合解读方法。",
                "Learn to synthesise one-card, three-card and larger spreads.",
              ),
              c(
                "探索不同牌阵在情感、关系、事业与个人成长主题中的应用。",
                "Explore how different spreads can be used for emotions, relationships, careers and personal growth.",
              ),
              c(
                "在一对一在线指导中解答学习疑问，纠正常见的解读误区。",
                "Resolve study questions and address common interpretive mistakes through one-to-one guidance.",
              ),
              c(
                "通过案例练习，提高牌面分析、逻辑整合与语言表达能力。",
                "Develop card analysis, logical synthesis and communication through case practice.",
              ),
              c(
                "学习塔罗咨询中的提问方式、沟通技巧、隐私保护与伦理边界。",
                "Study question framing, communication, privacy and ethical boundaries in tarot consultations.",
              ),
              c(
                "根据个人学习进度获得针对性的练习建议。",
                "Receive focused practice suggestions matched to your progress.",
              ),
            ],
          },
        ],
        highlights: [
          {
            label: audience,
            text: c(
              "希望深入研究塔罗、提高独立解牌能力，或有志于进一步学习塔罗咨询方法的学习者。",
              "Learners who want to explore tarot in depth, improve independent reading, or continue studying tarot consultation methods.",
            ),
          },
          {
            label: value,
            text: c(
              "不只是理解每张塔罗牌的含义，更是在个性化指导下，学会将不同牌面的象征信息整合为清晰、有深度且具有实际参考价值的解读。",
              "Go beyond individual card meanings: learn to combine their symbolic information into clear, thoughtful and practically useful readings through personalised guidance.",
            ),
          },
        ],
      },
      {
        id: "annual-membership",
        title: c(
          "年度会员 · 塔罗视频自学",
          "ANNUAL MEMBERSHIP · Tarot Video Self-Study",
        ),
        tagline: c(
          "按照自己的节奏，开启塔罗智慧探索之旅。",
          "Learn at Your Own Pace.",
        ),
        paragraphs: [
          {
            zh: [
              "加入 STELLARNESTS 年度付费会员，即可在会员有效期内进入「",
              { label: "星学影苑（Astrology Video Academy）", href: academy },
              "」，观看会员开放的塔罗术录播视频课程。",
            ],
            en: [
              "Become a STELLARNESTS annual paid member to access the ",
              { label: "Astrology Video Academy", href: academy },
              " during your membership and watch the recorded tarot courses available to members.",
            ],
          },
          c(
            "通过系统的视频学习，逐步认识塔罗牌的历史与结构、大阿尔卡纳、小阿尔卡纳、四元素、数字象征、牌阵布局以及基础解读方法。",
            "Through structured video study, learn about tarot history and structure, the Major and Minor Arcana, the four elements, numerical symbolism, spread layouts and foundational reading methods.",
          ),
          c(
            "在学习过程中，你可以逐步探索韦特塔罗与透特塔罗的不同象征体系，理解塔罗牌如何通过图像、符号与牌面组合表达复杂的主题。",
            "Explore the different symbolic systems of Rider–Waite and Thoth Tarot and understand how imagery, symbols and card combinations communicate complex themes.",
          ),
        ],
        highlights: [
          {
            label: audience,
            text: c(
              "塔罗初学者、神秘学爱好者、希望学习自我探索方法的用户，以及希望灵活安排学习时间的自主学习者。",
              "Tarot beginners, esoteric enthusiasts, people interested in self-exploration and independent learners who need flexible study times.",
            ),
          },
          {
            label: value,
            text: c(
              "不受固定上课时间限制，按照自己的学习节奏持续积累塔罗知识，逐步建立独立解读塔罗牌的基础能力，同时享受年度会员的其他权益。",
              "Build tarot knowledge at your own pace without fixed class times, gradually establishing the foundations of independent reading while enjoying the other annual membership benefits.",
            ),
          },
        ],
        cta: annualCta,
      },
    ],
    closing: {
      title: c("你的塔罗探索之旅，由此开启", "YOUR TAROT JOURNEY BEGINS HERE"),
      tagline: c(
        "卡牌呈现象征，而你探索其中的意义。",
        "The Cards Reveal Symbols. You Discover Meaning.",
      ),
      paragraphs: [
        c(
          "塔罗的价值，不在于替你决定未来，而在于帮助你从不同角度观察问题、理解内在需求，并重新思考人生的选择与可能性。",
          "Tarot's value is not in deciding your future, but in helping you look at a question from different perspectives, understand inner needs, and reconsider life's choices and possibilities.",
        ),
        c(
          "选择适合自己的学习道路，在 STELLARNESTS 开启属于你的塔罗研习之旅。",
          "Choose the learning path that suits you and begin your own tarot journey with STELLARNESTS.",
        ),
      ],
      disclaimer: c(
        "课程属于塔罗文化、象征体系与解释方法的教育性学习，不保证预测结果，也不替代专业医疗、心理、法律或财务建议。",
        "This course provides educational study of tarot culture, symbolism and interpretation. It does not guarantee predictive outcomes or replace professional medical, psychological, legal or financial advice.",
      ),
    },
  },
  "natal-masterclass": {
    tagline: c(
      "探索你的星辰，理解你的人生旅程。",
      "Explore Your Stars. Understand Your Journey.",
    ),
    introduction: [
      c(
        "星辰并不替你决定命运，而是为你提供理解自我的另一种视角。",
        "The stars do not decide your destiny. They offer another perspective from which to understand yourself.",
      ),
      {
        zh: [
          "每个人出生时的天空，都呈现出独特的行星排列。在占星学的象征体系中，这幅",
          { label: "出生星盘（Natal Chart）", href: "/astroplate" },
          "被视为探索个人特质、情感需求、人际关系及生命主题的重要工具。",
        ],
        en: [
          "The sky at each person's birth holds a unique planetary arrangement. Within astrology's symbolic system, this ",
          { label: "Natal Chart", href: "/astroplate" },
          " is an important tool for exploring personal qualities, emotional needs, relationships and life themes.",
        ],
      },
      c(
        "在 STELLARNESTS，我们将占星学的象征智慧与一对一在线交流相结合，帮助你从不同角度认识自己、理解关系，并反思人生中的选择与变化。",
        "At STELLARNESTS, we combine astrology's symbolic wisdom with one-to-one online conversation to help you understand yourself, explore relationships, and reflect on choices and changes in your life.",
      ),
      c(
        "无论你希望通过简短咨询探索一个具体问题，还是希望获得更深入、完整的个人星盘解读，我们都为你提供灵活的咨询方式。",
        "Whether you want a brief consultation about a specific question or a deeper, more comprehensive natal-chart reading, we offer flexible consultation options.",
      ),
    ],
    sections: [
      {
        id: "individual-consultation",
        title: c(
          "单次占星咨询 · 60分钟一对一在线服务",
          "Standalone Astrology Consultation · 60-Minute One-to-One Online Session",
        ),
        tagline: c(
          "深入探索个人星盘，发现更多值得思考的可能性。",
          "A Deeper Reading. A Clearer Perspective.",
        ),
        paragraphs: [
          {
            zh: [
              "如果你希望获得更充分的时间，深入讨论个人出生星盘、情感关系或人生发展主题，可以直接购买 STELLARNESTS 的",
              { label: "60分钟一对一在线占星咨询服务", href: "/classroom" },
              "。与15分钟的会员简短咨询不同，60分钟咨询提供更充足的交流时间，适合需要系统分析和深入讨论的客户。",
            ],
            en: [
              "For more time to explore your natal chart, relationships or life development themes, you can purchase a STELLARNESTS ",
              {
                label: "60-minute one-to-one online astrology consultation",
                href: "/classroom",
              },
              " directly. Unlike the brief 15-minute membership consultation, this session provides more time for systematic analysis and in-depth discussion.",
            ],
          },
        ],
        lists: [
          {
            title: consultationTopics,
            items: [
              c(
                "个人出生星盘解析：探索行星、星座、宫位及相位的综合象征意义。",
                "Natal Chart Reading: Explore the combined symbolism of planets, zodiac signs, houses and aspects.",
              ),
              c(
                "爱情与人际关系：理解个人情感需求、关系模式及沟通特点。",
                "Love & Relationships: Understand emotional needs, relationship patterns and communication styles.",
              ),
              c(
                "事业与人生方向：从星盘象征中探索个人优势、价值观与发展主题。",
                "Career & Life Direction: Explore strengths, values and developmental themes through chart symbolism.",
              ),
              c(
                "行运与人生周期：讨论当前行运周期及其象征性主题。",
                "Transits & Life Cycles: Discuss current transit cycles and their symbolic themes.",
              ),
              c(
                "个性化主题咨询：根据个人关注的问题，安排具有针对性的交流内容。",
                "Personal Questions: Focus the conversation on the questions that matter to you.",
              ),
            ],
          },
          {
            title: purchaseBenefits,
            items: [
              c(
                "一次完整的60分钟一对一在线占星咨询。",
                "One complete 60-minute one-to-one online astrology consultation.",
              ),
              c(
                "根据预约时提交的个人资料及咨询主题进行针对性讨论。",
                "A focused discussion based on the personal details and consultation themes submitted when booking.",
              ),
              c(
                "充分的提问、交流与分析时间。",
                "Ample time for questions, conversation and analysis.",
              ),
              c(
                "无需购买月度会员，即可独立预约咨询。",
                "Book a standalone consultation without purchasing a monthly membership.",
              ),
            ],
          },
        ],
      },
      {
        id: "monthly-membership",
        title: c(
          "月度会员 · 15分钟在线占星咨询或塔罗咨询",
          "Monthly Membership · A 15-Minute Online Astrology or Tarot Consultation",
        ),
        tagline: c(
          "每个月，为自己留出一段探索星辰的时间。",
          "A Moment of Insight, Every Month.",
        ),
        paragraphs: [
          {
            zh: [
              "成为 STELLARNESTS 月度付费会员，即可在当月会员有效期内，享受一次",
              {
                label: "15分钟的一对一在线占星咨询或塔罗咨询服务",
                href: "/classroom",
              },
              "。",
            ],
            en: [
              "Become a STELLARNESTS monthly paid member to receive one ",
              {
                label:
                  "15-minute one-to-one online astrology or tarot consultation",
                href: "/classroom",
              },
              " during your active membership month.",
            ],
          },
          c(
            "你可以围绕一个具体的主题，与咨询师进行简短交流，例如个人星盘中的某个重要特征、情感关系中的困惑，或近期希望探索的人生主题。",
            "Use this short conversation to explore one specific theme, such as an important feature of your natal chart, a relationship concern, or a life theme you are currently considering.",
          ),
        ],
        lists: [
          {
            title: monthlyBenefits,
            items: [
              c(
                "当月享有一次15分钟的一对一在线占星或塔罗咨询。",
                "One 15-minute one-to-one online astrology or tarot consultation during the membership month.",
              ),
              c(
                "可围绕一个具体问题或主题进行交流。",
                "A conversation focused on one specific question or theme.",
              ),
              ...memberAccess,
            ],
          },
        ],
        note: monthlyNote,
        cta: monthlyCta,
      },
      {
        id: "why-consult",
        title: c(
          "为什么选择占星咨询？",
          "Why Choose an Astrology Consultation?",
        ),
        highlights: [
          {
            label: c("01 · 深入认识自我", "01 · Self-Discovery"),
            text: c(
              "通过个人出生星盘，探索你的性格倾向、内在需求、优势与成长方向，获得不同于日常思考的自我观察视角。",
              "Explore personality tendencies, inner needs, strengths and growth through your natal chart, gaining a perspective on yourself that differs from everyday thinking.",
            ),
          },
          {
            label: c("02 · 理解情感与关系", "02 · Relationship Insights"),
            text: c(
              "从金星、月亮及其他星盘因素出发，探索情感需求、沟通模式与关系中的差异，帮助你更清晰地理解自己与他人。",
              "Explore emotional needs, communication and differences in relationships through Venus, the Moon and other chart factors, helping you understand yourself and others more clearly.",
            ),
          },
          {
            label: c("03 · 探索人生方向", "03 · Life Direction"),
            text: c(
              "结合星盘中的宫位、行星与象征主题，反思事业发展、个人目标及重要的人生选择。",
              "Reflect on career development, personal goals and important choices through the houses, planets and symbolic themes of your chart.",
            ),
          },
          {
            label: c("04 · 认识人生周期", "04 · Life Cycles"),
            text: c(
              "通过行运（Transits）等占星技术，了解不同时间周期的象征意义，以更开放的视角看待生活中的变化与成长。",
              "Use techniques such as transits to explore the symbolic meaning of different cycles and approach life's changes and growth with a more open perspective.",
            ),
          },
          {
            label: c("05 · 获得个性化交流", "05 · Personal Guidance"),
            text: c(
              "在一对一在线咨询中，围绕你的实际关注点展开讨论，帮助你整理思路、探索不同可能性，并建立更清晰的自我认识。",
              "Focus a one-to-one online consultation on your real concerns to organise your thoughts, explore possibilities and develop clearer self-understanding.",
            ),
          },
        ],
      },
    ],
    closing: {
      title: journey,
      tagline: c(
        "星辰提供视角，而人生的选择始终属于你。",
        "The Stars Offer Perspective. The Choices Remain Yours.",
      ),
      paragraphs: [
        c(
          "无论是每月一次的简短交流，还是一场深入的个人星盘解析，STELLARNESTS 都希望通过占星学的象征语言，帮助你认识自己、理解变化，并以更清晰的思路面对人生。",
          "Whether through a brief monthly conversation or an in-depth natal-chart reading, STELLARNESTS uses astrology's symbolic language to help you understand yourself, make sense of change and approach life with greater clarity.",
        ),
      ],
      disclaimer: c(
        "占星咨询属于文化性、象征性与自我探索服务，不保证对未来事件的准确预测，也不构成医疗、心理、法律、投资或其他专业建议。",
        "Astrology consultations are cultural, symbolic and self-exploratory services. They do not guarantee accurate predictions of future events or constitute medical, psychological, legal, investment or other professional advice.",
      ),
    },
  },
  "tarot-reading": {
    tagline: c(
      "探索塔罗的奥秘，发现内在的智慧。",
      "Explore the Cards. Discover Your Inner Wisdom.",
    ),
    introduction: [
      c(
        "每一张塔罗牌，都是一面映照内心的镜子。",
        "Every tarot card is a mirror of the inner world.",
      ),
      c(
        "塔罗不仅仅是78张充满神秘色彩的卡牌，更是一套融合象征、心理原型与生命经验的古老智慧体系。",
        "Tarot is more than 78 mysterious cards. It is an ancient wisdom tradition combining symbolism, psychological archetypes and lived experience.",
      ),
      c(
        "从愚者的启程到宇宙的圆满，每一张塔罗牌都蕴含着独特的象征意义，为我们提供观察情感、理解关系、探索人生选择的不同视角。",
        "From the Fool's departure to the fulfilment of the Universe, every card carries distinctive symbolism, offering different perspectives on emotions, relationships and life's choices.",
      ),
      c(
        "在 STELLARNESTS，我们将韦特塔罗（Rider–Waite Tarot）与透特塔罗（Thoth Tarot）的象征体系融入一对一在线咨询，帮助你在复杂的问题中整理思绪、认识内在需求，并探索不同选择的可能性。",
        "At STELLARNESTS, we bring the symbolic systems of Rider–Waite and Thoth Tarot into one-to-one online consultations, helping you organise your thoughts around complex questions, understand inner needs and explore the possibilities of different choices.",
      ),
      c(
        "无论你希望通过简短的塔罗咨询探索一个具体问题，还是希望获得更深入的牌阵解析，我们都为你提供灵活的咨询方式。",
        "Whether you want a brief tarot consultation about a specific question or a deeper spread interpretation, we offer flexible consultation options.",
      ),
    ],
    sections: [
      {
        id: "individual-consultation",
        title: c(
          "单次塔罗咨询 · 60分钟一对一在线服务",
          "Standalone Tarot Consultation · 60-Minute One-to-One Online Session",
        ),
        tagline: c(
          "更深入的解读，更清晰的视角。",
          "A Deeper Reading. A Clearer Perspective.",
        ),
        lists: [
          {
            title: consultationTopics,
            items: [
              c(
                "爱情与人际关系：探索情感需求、互动模式及关系中的挑战。",
                "Love & Relationships: Explore emotional needs, interaction patterns and relationship challenges.",
              ),
              c(
                "事业与人生方向：反思个人优势、发展目标及不同选择的可能性。",
                "Career & Life Direction: Reflect on strengths, developmental goals and the possibilities of different choices.",
              ),
              c(
                "自我成长：通过塔罗象征探索内在需求、情绪模式与成长主题。",
                "Personal Growth: Explore inner needs, emotional patterns and developmental themes through tarot symbolism.",
              ),
              c(
                "选择与可能性：运用不同牌阵，比较选择背后的考虑因素与潜在挑战。",
                "Choices & Possibilities: Use different spreads to compare considerations and potential challenges behind your choices.",
              ),
              c(
                "个性化主题咨询：根据个人关注的问题，安排具有针对性的牌阵解读与交流。",
                "Personal Questions: Focus the spread and conversation on the questions that matter to you.",
              ),
            ],
          },
          {
            title: purchaseBenefits,
            items: [
              c(
                "一次完整的60分钟一对一在线塔罗咨询。",
                "One complete 60-minute one-to-one online tarot consultation.",
              ),
              c(
                "根据预约时提交的咨询主题进行针对性的牌阵选择与解读。",
                "A spread selected and interpreted for the consultation theme submitted when booking.",
              ),
              c(
                "可结合韦特塔罗或透特塔罗的象征体系展开分析。",
                "Analysis drawing on the symbolic systems of Rider–Waite or Thoth Tarot.",
              ),
              c(
                "充分的提问、交流与讨论时间。",
                "Ample time for questions, conversation and discussion.",
              ),
              c(
                "无需购买月度会员，即可独立预约咨询。",
                "Book a standalone consultation without purchasing a monthly membership.",
              ),
            ],
          },
        ],
      },
      {
        id: "monthly-membership",
        title: c(
          "月度会员 · 15分钟在线塔罗咨询或占星咨询服务",
          "Monthly Membership · A 15-Minute Online Tarot or Astrology Consultation",
        ),
        tagline: c(
          "每个月，为自己留出一段倾听内心的时间。",
          "A Moment of Clarity, Every Month.",
        ),
        paragraphs: [
          c(
            "成为 STELLARNESTS 月度付费会员，即可在当月会员有效期内，享受一次15分钟的一对一在线塔罗咨询或占星咨询服务。",
            "Become a STELLARNESTS monthly paid member to receive one 15-minute one-to-one online tarot or astrology consultation during your active membership month.",
          ),
          c(
            "你可以围绕一个具体的问题或主题，与塔罗占星咨询师进行简短交流，例如情感关系中的困惑、近期面临的选择，或希望进一步理解的个人成长主题。",
            "Explore one specific question or theme in a short conversation with a tarot and astrology consultant: a relationship concern, a recent choice, or a personal growth theme you want to understand more deeply.",
          ),
        ],
        lists: [
          {
            title: monthlyBenefits,
            items: [
              c(
                "当月享有一次15分钟的一对一在线塔罗咨询或占星咨询。",
                "One 15-minute one-to-one online tarot or astrology consultation during the membership month.",
              ),
              c(
                "可围绕一个具体问题或主题进行塔罗牌阵或星盘解读。",
                "A tarot spread or chart reading focused on one specific question or theme.",
              ),
              ...memberAccess,
            ],
          },
        ],
        note: monthlyNote,
        cta: monthlyCta,
      },
      {
        id: "why-consult",
        title: c("为什么选择塔罗咨询？", "Why Choose a Tarot Consultation?"),
        highlights: [
          {
            label: c("01 · 探索内在自我", "01 · Self-Discovery"),
            text: c(
              "通过塔罗牌的图像与象征，反思自己的情绪、价值观、内在需求与成长方向，从不同角度认识真实的自己。",
              "Reflect on emotions, values, inner needs and growth through tarot imagery and symbolism, approaching your authentic self from different perspectives.",
            ),
          },
          {
            label: c("02 · 理解情感与关系", "02 · Love & Relationships"),
            text: c(
              "探索爱情、友情、家庭及人际关系中的互动模式，理解情感需求、沟通障碍与关系中值得关注的问题。",
              "Explore interaction patterns in love, friendship, family and other relationships, understanding emotional needs, communication barriers and concerns that deserve attention.",
            ),
          },
          {
            label: c("03 · 思考人生选择", "03 · Life Decisions"),
            text: c(
              "当你面临事业、学习、关系或生活中的重要选择时，通过塔罗牌阵探索不同方向的可能性，帮助你整理思路，而不是替你作出决定。",
              "When facing important choices in work, study, relationships or life, use tarot spreads to explore different directions and organise your thoughts rather than letting the cards decide for you.",
            ),
          },
          {
            label: c("04 · 发现隐藏的模式", "04 · Hidden Patterns"),
            text: c(
              "通过卡牌之间的象征联系，观察可能被忽略的情绪反应、思维习惯与行为模式，获得新的反思角度。",
              "Observe emotional responses, thinking habits and behavioural patterns you may have overlooked through the symbolic connections between cards, gaining new angles for reflection.",
            ),
          },
          {
            label: c("05 · 获得个性化交流", "05 · Personal Guidance"),
            text: c(
              "在一对一在线咨询中，围绕你的实际问题进行有针对性的塔罗解读与交流，帮助你更清晰地理解当前处境及个人需求。",
              "Focus a one-to-one online consultation on your actual questions through a targeted tarot reading and conversation, helping you understand your current situation and needs more clearly.",
            ),
          },
        ],
      },
    ],
    closing: {
      title: journey,
      tagline: c(
        "塔罗提供视角，而人生的选择始终属于你。",
        "The Cards Offer Perspective. The Choices Remain Yours.",
      ),
      paragraphs: [
        c(
          "塔罗的意义，不在于为人生提供绝对的答案，而在于帮助你重新审视问题、探索内在需求，并发现更多值得思考的可能性。",
          "Tarot's meaning is not in offering absolute answers to life, but in helping you reconsider a question, explore inner needs and discover possibilities worth thinking about.",
        ),
        c(
          "无论是每月一次的简短交流，还是一场深入的个人塔罗解读，STELLARNESTS 都希望通过塔罗的象征语言，陪伴你探索自我、理解变化，并以更清晰的思路面对人生。",
          "Whether through a brief monthly conversation or an in-depth personal tarot reading, STELLARNESTS uses tarot's symbolic language to accompany your self-exploration, understanding of change and clearer approach to life.",
        ),
      ],
      disclaimer: c(
        "塔罗咨询属于文化性、象征性与自我探索服务，不保证对未来事件的准确预测，也不构成医疗、心理、法律、投资或其他专业建议。",
        "Tarot consultations are cultural, symbolic and self-exploratory services. They do not guarantee accurate predictions of future events or constitute medical, psychological, legal, investment or other professional advice.",
      ),
    },
  },
};
