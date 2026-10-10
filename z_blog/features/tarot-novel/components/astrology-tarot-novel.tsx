import Image from "next/image";
import Link from "next/link";
import Container from "@/components/site/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const YOUTUBE_TRAILER_URL = "https://www.youtube.com/watch?v=M7lc1UVf-VE";

const chapters = [
  { number: "01", title: "梦从一张牌开始", status: "已发布" },
  { number: "02", title: "海龟与南方星辰", status: "本章" },
  { number: "03", title: "行星的第一次会面", status: "预告" },
  { number: "04", title: "影子里的答案", status: "预告" },
  { number: "05", title: "回家的方向", status: "预告" },
];

const readerReviews = [
  {
    name: "Lily",
    role: "教师",
    quote: "故事温柔但不失深度，孩子会自然地对星辰与内心产生好奇。",
  },
  {
    name: "Ethan",
    role: "9 岁读者",
    quote: "我喜欢海龟出现的那一段，也想知道下一张牌会带大家去哪里。",
  },
  {
    name: "Mia",
    role: "家长",
    quote: "章节短而完整，很适合作为亲子睡前阅读和谈心的开始。",
  },
];

export function AstrologyTarotNovel() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Container>
        <div className="py-5 sm:py-7 lg:py-9">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-[var(--text-soft)] transition-colors hover:text-[var(--primary)]"
          >
            返回首页
          </Link>

          <section className="relative mt-4 min-h-[480px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-lg)] sm:min-h-[540px] lg:min-h-[600px]">
            <Image
              src="/hero.png"
              alt="占星塔罗小说主视觉"
              fill
              loading="eager"
              sizes="(max-width: 1280px) calc(100vw - 48px), 1152px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--hero-overlay-strong)] via-[var(--hero-overlay-soft)] to-transparent" />

            <div className="relative z-10 flex min-h-[480px] items-end px-5 py-8 sm:min-h-[540px] sm:px-8 sm:py-10 lg:min-h-[600px] lg:items-center lg:px-12">
              <div className="max-w-xl">
                <Badge className="mb-4">占星塔罗小说</Badge>
                <h1 className="text-3xl font-semibold leading-tight text-[var(--text-white)] sm:text-4xl lg:text-5xl">
                  小小先知的南方星辰之旅
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text-white)] sm:text-base">
                  一段关于星辰、塔罗与成长的温柔冒险。跟随主人公穿过未知海岸，在每一次选择里认识自己，也学会理解身边的人。
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="secondary">成长故事</Badge>
                  <Badge variant="secondary">占星启蒙</Badge>
                  <Badge variant="secondary">亲子共读</Badge>
                </div>
                <div className="mt-7">
                  <ButtonLink href="#current-chapter" variant="hero" size="lg">
                    开始阅读
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="min-w-0 space-y-5">
              <Card id="current-chapter" className="scroll-mt-24 overflow-hidden">
                <CardHeader className="flex-col items-start gap-3 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center">
                  <div>
                    <CardDescription>当前章节</CardDescription>
                    <CardTitle className="mt-1 text-xl sm:text-2xl">
                      第二章：海龟与南方星辰
                    </CardTitle>
                  </div>
                  <Badge variant="secondary">新章节</Badge>
                </CardHeader>
                <CardContent className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)] md:items-center">
                  <a
                    href={YOUTUBE_TRAILER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative block aspect-video overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-soft)] focus-visible:outline-none focus-visible:shadow-[var(--focus-outline)]"
                    aria-label="在 YouTube 观看故事预告"
                  >
                    <Image
                      src="/hero.png"
                      alt="第二章故事预告"
                      fill
                      sizes="(max-width: 767px) calc(100vw - 88px), (max-width: 1023px) 56vw, 520px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="absolute inset-0 bg-[color:var(--hero-overlay-soft)] transition-colors group-hover:bg-[color:var(--hero-overlay-strong)]" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded-[var(--radius-md)] border border-[color:var(--text-white)]/40 bg-[color:var(--card)]/20 px-5 py-3 text-sm font-semibold text-[var(--text-white)] backdrop-blur-md">
                        观看故事预告
                      </span>
                    </span>
                  </a>

                  <div>
                    <p className="text-sm leading-7 text-[var(--text-soft)]">
                      海面渐渐安静，远方的星光落在潮汐之间。主人公在一只古老海龟的带领下，第一次看见属于自己的星盘，也遇见一张等待被解读的塔罗牌。
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">
                      本章以故事方式介绍直觉、选择与情绪表达，为后续的行星旅程建立清晰线索。
                    </p>
                    <ButtonLink href="#chapters" className="mt-6" variant="primary">
                      查看章节目录
                    </ButtonLink>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-5 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div>
                      <CardDescription>阅读延伸</CardDescription>
                      <CardTitle className="mt-1">给小小探索者的线索</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 text-sm leading-6 text-[var(--text-soft)]">
                      <li>观察故事里反复出现的颜色与符号。</li>
                      <li>说出主人公做决定前后的感受。</li>
                      <li>画下你心里代表勇气的那颗星。</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div>
                      <CardDescription>星辰连接</CardDescription>
                      <CardTitle className="mt-1">海王星：梦与想象</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm leading-7 text-[var(--text-soft)]">
                      本章以海王星象征想象力与同理心，并通过塔罗画面帮助读者把抽象感受转化为可以讨论的语言。
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="border-b border-[var(--border)] pb-5">
                  <div>
                    <CardDescription>读者反馈</CardDescription>
                    <CardTitle className="mt-1 text-xl">Reader Says</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 p-5 sm:p-6 md:grid-cols-3">
                  {readerReviews.map((review) => (
                    <blockquote
                      key={review.name}
                      className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] p-4"
                    >
                      <p className="text-sm leading-6 text-[var(--text-soft)]">
                        “{review.quote}”
                      </p>
                      <footer className="mt-4 text-sm font-semibold text-[var(--text)]">
                        {review.name}
                        <span className="ml-2 font-normal text-[var(--text-faint)]">
                          {review.role}
                        </span>
                      </footer>
                    </blockquote>
                  ))}
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <Card>
                <CardHeader>
                  <div>
                    <CardDescription>系列介绍</CardDescription>
                    <CardTitle className="mt-1">关于这个故事</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm leading-7 text-[var(--text-soft)]">
                    这是一个将神话叙事、占星符号与塔罗意象结合的成长系列。每一章围绕一个清晰主题，适合独立阅读，也适合亲子共同讨论。
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge variant="secondary">每周更新</Badge>
                    <Badge variant="secondary">全年龄</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card id="chapters" className="scroll-mt-24">
                <CardHeader>
                  <div>
                    <CardDescription>故事进度</CardDescription>
                    <CardTitle className="mt-1">章节目录</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-4">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.number}
                      className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card-soft)] px-3 py-3"
                    >
                      <span className="text-xs font-semibold text-[var(--text-faint)]">
                        {chapter.number}
                      </span>
                      <span className="min-w-0 text-sm font-medium text-[var(--text)]">
                        {chapter.title}
                      </span>
                      <span className="text-xs text-[var(--text-soft)]">
                        {chapter.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div>
                    <CardDescription>更新提醒</CardDescription>
                    <CardTitle className="mt-1">不错过下一章</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="mb-5 text-sm leading-6 text-[var(--text-soft)]">
                    新章节发布后，可通过站内 Newsletter 获取更新。
                  </p>
                  <ButtonLink href="/newsletter" variant="secondary" fullWidth>
                    订阅更新
                  </ButtonLink>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </Container>
    </main>
  );
}
