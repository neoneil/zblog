export const proposedNavigation = [
  "HOME",
  "NOVEL",
  "KNOWLEDGE",
  "TAROT",
  "ASTROLOGY",
  "SHOP",
  "ABOUT",
  "CONTACT",
];

export const homeSections = [
  {
    id: "01",
    title: "品牌小说",
    en: "FEATURED NOVEL",
    items: ["STELLARNESTS — The Story"],
    description:
      "首页首个核心内容：品牌小说、世界观、人物故事与连载阅读，用故事引导访客认识 STELLARNESTS。",
  },
  {
    id: "02",
    title: "知识体系",
    en: "KNOWLEDGE SYSTEM",
    items: [
      "Tree of Life · 生命树",
      "Thoth Tarot · 透特塔罗知识",
      "Astrology · 占星知识",
      "Library · 资料库",
    ],
    description: "四个独立知识入口，集中承接系统教学与公开学习资料。",
  },
  {
    id: "03",
    title: "塔罗系统",
    en: "TAROT SYSTEM",
    items: [
      "Rider–Waite Reading · 韦特占卜",
      "Waite Knowledge Base · 韦特飞书知识库",
      "Thoth Reading · 透特占卜",
      "Thoth Card Guide · 透特牌解释",
    ],
    description: "占卜工具与牌义知识分开组织；韦特与透特各有清晰入口。",
  },
  {
    id: "04",
    title: "个人测算",
    en: "PERSONAL CALCULATORS",
    items: [
      "Birth Chart · 单人星盘",
      "Synastry · 双人合盘",
      "Stellar Birth Chart · 测算与指南",
      "Numerology · 生命数字",
    ],
    description:
      "四个测算入口。Stellar Birth Chart 的 Calculator 与 Guide 合并在同一个入口内。",
  },
  {
    id: "05",
    title: "占星系统",
    en: "STELLAR ASTROLOGY",
    items: [
      "STELLAR · Astrology Explorer",
      "12 Zodiac Signs · 十二星座",
      "Horoscopes · 星座运势",
      "Learn Videos · 学习视频",
    ],
    description: "STELLAR 内收纳八项探索功能，不在首页拆成八个独立模块。",
  },
  {
    id: "06",
    title: "课程与服务",
    en: "PRODUCTS & SERVICES",
    items: [
      "Astrology Course · 占星课程",
      "Tarot Course · 塔罗课程",
      "Tarot Reading · 塔罗咨询",
      "Chart Consultation · 星盘咨询",
    ],
    description:
      "每项连接在线支付、订单确认与团队通知。课程和真人咨询独立售卖，不包含在会员费内。",
  },
  {
    id: "07",
    title: "联系我",
    en: "CONTACT ME",
    items: ["邮箱地址 + 文字留言"],
    description:
      "客户填写邮箱与留言；提交后网站接收，并提供明确的成功或失败反馈。",
  },
  {
    id: "08",
    title: "订阅通讯",
    en: "NEWSLETTER",
    items: ["确认订阅 → 欢迎邮件 → 星盘入口"],
    description:
      "用户确认订阅后发送品牌欢迎邮件，延续长期联系。Newsletter 同时出现在首页下方与页脚。",
  },
  {
    id: "09",
    title: "关于我们",
    en: "ABOUT US",
    items: ["创始人 · 团队 · 专业领域 · 服务理念"],
    description: "以真实团队介绍说明品牌背景、专业方向与陪伴理念。",
  },
  {
    id: "10",
    title: "页脚",
    en: "FOOTER",
    items: ["精简导航 · Newsletter · 联系入口"],
    description:
      "统一承接站内导航与长期联系入口；Library 归入 Knowledge，STELLAR 归入 Astrology。",
  },
] as const;

export const moduleRequirements = [
  ["01 小说", "首页置顶，展示品牌故事、人物设定、小说章节和阅读入口。"],
  ["02 知识体系", "生命树、透特塔罗知识、占星术知识、Library，四个独立入口。"],
  [
    "03 塔罗系统",
    "韦特占卜工具、韦特飞书知识库、透特占卜工具、透特牌解释，桌面四列。",
  ],
  [
    "04 测算系统",
    "单人星盘、双人合盘、Stellar Birth Chart Calculator & Guide、Numerology，桌面四列。",
  ],
  ["05 占星系统", "STELLAR、十二星座、星座运势、学习视频，桌面四列。"],
  [
    "06 Products / Services",
    "占星课程、塔罗课程、塔罗咨询、星盘咨询，分别连接在线支付与订单邮件。",
  ],
  ["07 Contact Me", "收集客户邮箱及文字留言，由网站接收。"],
  ["08 Newsletter", "邮箱确认订阅后自动发送欢迎邮件，并引导进入星盘测算。"],
  ["09 About Us", "介绍创始人、团队成员、专业领域与服务理念。"],
  [
    "移除项 Resources",
    "目标方案中删除原模块及其导航入口；本预览页不会执行删除。",
  ],
] as const;

export const stellarTools = [
  ["Compatibility", "星座及关系匹配"],
  ["Today's Sky", "今日天空行星状态"],
  ["Moon Calendar", "月相日历"],
  ["Retrograde Tracker", "行星逆行追踪"],
  ["Void of Course Moon", "月亮空亡时段"],
  ["Planets in Signs", "行星落入星座"],
  ["Birthday Horoscope", "生日星象分析"],
  ["Eclipses", "日月食资讯"],
] as const;

export const membershipPlans = [
  {
    name: "FREE MEMBER",
    label: "免费注册会员",
    price: "FREE",
    benefits: [
      "邮箱注册、验证及登录",
      "每周 3 次免费塔罗占卜（韦特与透特共用）",
      "注册后 1 次个人出生星盘测算（非每周重置）",
      "浏览公开知识内容与 Library",
      "可确认订阅 Newsletter",
    ],
  },
  {
    name: "PREMIUM MEMBER",
    label: "付费订阅会员",
    price: "价格待定",
    benefits: [
      "邮箱注册、验证及登录",
      "不限次数塔罗占卜，受合理防滥用规则约束",
      "不限次数占星测算",
      "包含单人星盘与双人合盘",
      "解锁全部网站占卜与测算工具",
    ],
  },
] as const;

export const permissions = [
  ["韦特塔罗占卜", "每周共享 3 次额度", "不限次数"],
  ["透特塔罗占卜", "与韦特共用上述 3 次", "不限次数"],
  ["个人出生星盘", "注册后 1 次", "不限次数"],
  ["双人合盘测算", "不包含", "包含，不限次数"],
  ["Numerology 生命数字", "建议开放基础版，待确认", "全部开放"],
  ["STELLAR 占星工具", "部分公开，范围待确认", "全部开放"],
  ["知识库及 Library", "公开内容", "公开内容"],
  ["付费课程、真人咨询", "单独购买", "仍需单独购买"],
] as const;

export const registrationSteps = [
  ["邮箱注册 STELLARNESTS", "创建账户，不将购买会员作为注册前提。"],
  [
    "验证邮箱与欢迎邮件",
    "Discover Your Soul's Blueprint；Newsletter 另行确认订阅。",
  ],
  ["进入 FREE MEMBER", "每周共享 3 次塔罗额度，加注册后 1 次个人星盘。"],
  ["升级 PREMIUM MEMBERSHIP", "选择收费周期并支付会员费。"],
  [
    "支付确认后解锁",
    "以服务端确认的有效订阅为准，自动开放全部占卜与测算工具。",
  ],
] as const;

export const paymentSteps = [
  ["选择课程或咨询", "确认项目、价格和交付安排。"],
  ["安全在线支付", "通过支付服务商处理，不由网页保存银行卡信息。"],
  [
    "确认付款与订单",
    "服务端验证支付通知，创建订单编号，避免重复开通或重复发送。",
  ],
  ["客户确认邮件", "发送订单编号、购买项目与后续安排。"],
  ["团队订单通知", "通知团队处理课程访问或咨询预约。"],
  ["交付对应服务", "课程自动开通学习权限；咨询通过邮件确认时间与所需资料。"],
] as const;

export const accountFields = [
  ["当前会员等级", "FREE / PREMIUM"],
  ["本周塔罗剩余额度", "免费会员显示 0–3 次，两个牌系共用"],
  ["个人星盘使用状态", "注册赠送的 1 次：未使用 / 已使用"],
  ["订阅状态与到期时间", "付费周期、有效期及取消后的剩余权限"],
  ["管理订阅入口", "查看或调整订阅，处理续费与取消"],
] as const;

export const openDecisions = [
  "会员收费周期：仅月付、仅年付，还是月付与年付并存。",
  "确认 AUD 月费、年费与正式上线日期；示例 9.90 / 89.00 不是正式售价。",
  "每周塔罗额度的重置日与时区；注册赠送的个人星盘不随周重置。",
  "明确免费开放的 STELLAR 项目及 Numerology 基础版范围。",
  "设定付费会员的公平使用、防自动化滥用与并发保护规则。",
  "确认订阅取消、到期、支付失败和退款后的权限处理，避免重复赠送个人星盘。",
  "确认课程交付、真人咨询预约安排及订单通知收件人。",
  "欢迎邮件 CTA 正式上线时，改连实际的出生星盘测算页。",
] as const;
