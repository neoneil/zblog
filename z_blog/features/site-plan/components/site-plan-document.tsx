import Link from "next/link";
import {
  ArrowLeft,
  ArrowDown,
  BookOpen,
  CalendarDays,
  Check,
  Compass,
  Crown,
  Globe,
  GraduationCap,
  Hash,
  Heart,
  Layers,
  Library,
  Mail,
  Orbit,
  ShieldCheck,
  Sparkles,
  Star,
  Telescope,
  TreePine,
  UserRound,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import {
  homeSections,
  proposedNavigation,
  moduleRequirements,
  stellarTools,
  membershipPlans,
  permissions,
  registrationSteps,
  paymentSteps,
  accountFields,
  openDecisions,
} from "../lib/plan";
import PricingPreview from "./pricing-preview";
import styles from "./site-plan.module.css";

const sections = [
  ["architecture", "首页整体布局"],
  ["requirements", "各模块要求"],
  ["stellar", "STELLAR 子系统"],
  ["membership", "会员等级与权限"],
  ["account", "注册与我的账户"],
  ["pricing", "收费方案预览"],
  ["payments", "在线支付与邮件"],
  ["newsletter", "欢迎邮件预览"],
  ["decisions", "实施边界与待确认"],
] as const;
const moduleIcons = [
  TreePine,
  Layers,
  Orbit,
  Library,
  Sparkles,
  BookOpen,
  Compass,
  Layers,
  Orbit,
  Heart,
  Globe,
  Hash,
  Telescope,
  Star,
  CalendarDays,
  Video,
  GraduationCap,
  BookOpen,
  Sparkles,
  Orbit,
];

function SectionHeading({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.sectionHeading}>
      <p>{number}</p>
      <h2 id={id}>{title}</h2>
      {children}
    </header>
  );
}
function Flow({ steps }: { steps: readonly (readonly [string, string])[] }) {
  return (
    <ol className={styles.flow}>
      {steps.map(([title, detail], index) => (
        <li key={title}>
          <span className={styles.stepNumber}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>{title}</h3>
            <p>{detail}</p>
          </div>
          {index < steps.length - 1 && (
            <ArrowDown className={styles.flowArrow} size={16} aria-hidden />
          )}
        </li>
      ))}
    </ol>
  );
}

export default function SitePlanDocument() {
  return (
    <main className={styles.root}>
      <div className={styles.wrap}>
        <Link href="/admin" className={styles.back}>
          <ArrowLeft size={16} aria-hidden />
          返回管理后台
        </Link>
        <header className={styles.documentHeader}>
          <div className={styles.badges}>
            <Badge variant="outline">
              <ShieldCheck size={14} aria-hidden />
              仅管理员可见
            </Badge>
            <Badge variant="warning">规划预览 · 非已实施</Badge>
          </div>
          <p className={styles.brand}>STELLARNESTS</p>
          <h1>网页布局和会员详情</h1>
          <p className={styles.tagline}>Discover Your Soul&apos;s Blueprint</p>
          <p>
            新版网站的信息架构、会员权益及收费功能需求总览。内容依据提供的文字与七张参考图整理。
          </p>
        </header>
        <aside className={styles.notice}>
          <strong>本页是需求与功能预览，不是网站现状说明。</strong>
          <p>
            不会更改公开首页、导航、品牌名称、会员配额、真实价格、订阅或支付。文中的“移除”“自动发送”“自动开通”均描述目标方案，需另行实施。
          </p>
        </aside>
        <dl className={styles.metrics}>
          <div>
            <dt>首页展示区块</dt>
            <dd>10</dd>
          </div>
          <div>
            <dt>STELLAR 内部功能</dt>
            <dd>8</dd>
          </div>
          <div>
            <dt>会员等级</dt>
            <dd>2</dd>
          </div>
          <div>
            <dt>付费价格</dt>
            <dd>待确认</dd>
          </div>
        </dl>
        <div className={styles.layout}>
          <nav className={styles.contents} aria-label="规划文档目录">
            <p>文档目录</p>
            <ol>
              {sections.map(([id, title], i) => (
                <li key={id}>
                  <a href={`#${id}`}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.content}>
            <section aria-labelledby="architecture">
              <SectionHeading
                id="architecture"
                number="01 · INFORMATION ARCHITECTURE"
                title="网站首页整体布局"
              >
                <p>
                  小说置顶，随后依次呈现知识、工具、服务与联系入口。四项入口组在桌面端四列、手机端两列。
                </p>
              </SectionHeading>
              <div className={styles.proposedHeader}>
                <strong>STELLARNESTS</strong>
                <span>Discover Your Soul&apos;s Blueprint</span>
                <ul aria-label="建议顶部导航">
                  {proposedNavigation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.architecture}>
                {homeSections.map((group, index) => (
                  <section
                    className={styles.moduleBand}
                    key={group.id}
                    aria-labelledby={`module-${group.id}`}
                  >
                    <header>
                      <span className={styles.moduleNumber}>{group.id}</span>
                      <div>
                        <p className={styles.eyebrow}>{group.en}</p>
                        <h3 id={`module-${group.id}`}>{group.title}</h3>
                      </div>
                    </header>
                    {group.items.length === 4 ? (
                      <div className={styles.moduleGrid}>
                        {group.items.map((item, i) => {
                          const Icon =
                            moduleIcons[(index - 1) * 4 + i] ?? BookOpen;
                          return (
                            <Card key={item} className={styles.moduleTile}>
                              <Icon size={20} aria-hidden />
                              <h4>{item}</h4>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={styles.singleModule}>
                        {group.id === "01" ? (
                          <BookOpen size={28} aria-hidden />
                        ) : group.id === "08" ? (
                          <Mail size={22} aria-hidden />
                        ) : null}
                        <strong>{group.items[0]}</strong>
                      </div>
                    )}
                    <p>{group.description}</p>
                  </section>
                ))}
              </div>
              <p className={styles.callout}>
                品牌目标统一为
                STELLARNESTS，不再沿用原“星语童年”主题。本页只展示目标，不执行全站更名。
              </p>
            </section>

            <section aria-labelledby="requirements">
              <SectionHeading
                id="requirements"
                number="02 · MODULE REQUIREMENTS"
                title="各模块具体功能"
              />
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th scope="col">模块</th>
                      <th scope="col">目标要求</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moduleRequirements.map(([name, detail]) => (
                      <tr key={name}>
                        <th scope="row">{name}</th>
                        <td>{detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.muted}>
                首页展示的第 10 项为 Footer；Resources
                是单独的移除项，不增加新的首页区块。
              </p>
            </section>

            <section aria-labelledby="stellar">
              <SectionHeading
                id="stellar"
                number="03 · ASTROLOGY EXPLORER"
                title="STELLAR 子系统"
              >
                <p>
                  八项功能均放入 STELLAR 内部。出生星盘、Guide 与 Numerology
                  已归入个人测算，不重复拆到此处。
                </p>
              </SectionHeading>
              <div className={styles.stellarGrid}>
                {stellarTools.map(([title, description], i) => (
                  <div key={title}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className={styles.callout}>
                归属规则：Library → Knowledge；STELLAR → Astrology；Newsletter →
                首页下方与 Footer。
              </p>
            </section>

            <section aria-labelledby="membership">
              <SectionHeading
                id="membership"
                number="04 · MEMBERSHIP"
                title="会员等级与权限"
              >
                <p>
                  邮箱免费注册 +
                  付费订阅双层模式。课程和真人咨询独立收费，不能与工具会员混为一项权益。
                </p>
              </SectionHeading>
              <div className={styles.planGrid}>
                {membershipPlans.map((plan, index) => (
                  <Card key={plan.name} className={styles.planCard}>
                    {index ? (
                      <Crown size={24} aria-hidden />
                    ) : (
                      <UserRound size={24} aria-hidden />
                    )}
                    <h3>{plan.name}</h3>
                    <p>{plan.label}</p>
                    <strong className={styles.planPrice}>{plan.price}</strong>
                    <ul>
                      {plan.benefits.map((benefit) => (
                        <li key={benefit}>
                          <Check size={16} aria-hidden />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
              <p className={styles.callout}>
                <strong>共享额度：</strong>
                免费会员每周总共三次塔罗，韦特与透特共用，不是各三次。个人单盘为注册后一次，不属于每周赠送。
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption>会员权限对照（目标方案）</caption>
                  <thead>
                    <tr>
                      <th scope="col">网站功能</th>
                      <th scope="col">免费会员</th>
                      <th scope="col">付费会员</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map(([name, free, premium]) => (
                      <tr key={name}>
                        <th scope="row">{name}</th>
                        <td>{free}</td>
                        <td>{premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={styles.muted}>
                付费“不限次数”仍需合理防滥用保护；不等于无限并发、允许自动化刷取或取消安全限流。
              </p>
            </section>

            <section aria-labelledby="account">
              <SectionHeading
                id="account"
                number="05 · ACCOUNT JOURNEY"
                title="会员注册与升级流程"
              />
              <Flow steps={registrationSteps} />
              <h3 className={styles.subheading}>MY ACCOUNT · 我的账户</h3>
              <dl className={styles.accountFields}>
                {accountFields.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="pricing">
              <SectionHeading
                id="pricing"
                number="06 · PRICING DRAFT"
                title="会员订阅收费预览"
              >
                <p>
                  收费周期与金额均待决定。输入框为讨论方案的本地演示，不是正式定价配置。
                </p>
              </SectionHeading>
              <PricingPreview monthlyExample="9.90" yearlyExample="89.00" />
            </section>

            <section aria-labelledby="payments">
              <SectionHeading
                id="payments"
                number="07 · PAYMENTS & EMAIL"
                title="在线支付及订单邮件"
              >
                <p>
                  课程、真人咨询与会员订阅复用一致的支付确认和邮件通知流程，分别交付对应权益。
                </p>
              </SectionHeading>
              <Flow steps={paymentSteps} />
              <div className={styles.delivery}>
                <div>
                  <h3>课程产品</h3>
                  <p>付款确认后开通所购课程的学习权限，并发送访问说明。</p>
                </div>
                <div>
                  <h3>真人咨询</h3>
                  <p>
                    付款后发送订单邮件，由团队确认预约时间、咨询问题及所需出生资料。
                  </p>
                </div>
                <div>
                  <h3>会员订阅</h3>
                  <p>
                    确认有效付款与订阅状态后解锁工具，续费、取消与到期均由服务端管理。
                  </p>
                </div>
              </div>
              <p className={styles.callout}>
                目标实现：核验支付服务商通知、按订单去重处理、失败可追踪。不能仅凭浏览器付款成功跳转就发放权益。
              </p>
            </section>

            <section aria-labelledby="newsletter">
              <SectionHeading
                id="newsletter"
                number="08 · WELCOME EMAIL"
                title="Newsletter 自动欢迎邮件"
              >
                <p>
                  用户输入邮箱并完成订阅确认后触发。账户注册欢迎邮件与
                  Newsletter 订阅确认应区分，不默认替用户订阅营销邮件。
                </p>
              </SectionHeading>
              <article
                className={styles.emailPreview}
                aria-label="欢迎邮件内容预览"
              >
                <Mail size={24} aria-hidden />
                <h3>STELLARNESTS</h3>
                <p className={styles.emailTagline}>
                  DISCOVER YOUR SOUL&apos;S BLUEPRINT
                </p>
                <p>
                  The universe holds a unique story written in the stars at the
                  moment of your birth.
                </p>
                <p>
                  Discover your cosmic blueprint and begin your journey of
                  self-exploration.
                </p>
                <ButtonLink href="/">FILL YOUR CHART</ButtonLink>
              </article>
              <p className={styles.muted}>
                CTA 当前预览指向首页；正式上线应连接实际出生星盘测算页。使用
                FILL YOUR CHART，不使用 FULL YOUR
                CHART；如强调立即生成，也可采用 GENERATE YOUR BIRTH CHART。
              </p>
            </section>

            <section aria-labelledby="decisions">
              <SectionHeading
                id="decisions"
                number="09 · DELIVERY BOUNDARIES"
                title="实施边界与待确认项"
              />
              <ul className={styles.decisions}>
                {openDecisions.map((item) => (
                  <li key={item}>
                    <span aria-hidden className={styles.pendingDot} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.principle}>
                <h3>结构原则</h3>
                <p>
                  小说负责品牌故事，知识模块负责教学，免费工具吸引访客，Products
                  & Services 承接商业转化，Newsletter 维系长期联系。
                </p>
              </div>
              <p className={styles.muted}>
                本页没有开通会员、发起支付、写入订阅价格、修改配额或发送邮件的操作。真实实施需单独确认范围与收费方案。
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
