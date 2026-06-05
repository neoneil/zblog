export default function AboutUsCosmicPage() {
  const features = [
    {
      title: "星盘解读",
      desc: "从本命盘、上升、月亮到宫位与相位，帮助用户更直观地理解自己的能量结构。",
      icon: "✦",
    },
    {
      title: "塔罗指引",
      desc: "通过不同牌阵与主题问题，为关系、事业、情绪与阶段选择提供温柔的参考。",
      icon: "🃏",
    },
    {
      title: "AI 中文分析",
      desc: "把复杂的占星与塔罗语言转成更容易理解的表达，适合新手用户浏览与体验。",
      icon: "☾",
    },
    {
      title: "宇宙系视觉体验",
      desc: "结合深蓝夜空、金色轨迹、星图纹理与梦幻角色元素，营造沉浸式浏览氛围。",
      icon: "☼",
    },
  ];

  const values = [
    {
      title: "温柔陪伴",
      text: "我们希望这里不是冰冷的工具页，而像一段安静的夜晚对话。",
    },
    {
      title: "神秘但不晦涩",
      text: "把占星与塔罗保留浪漫感，同时用清晰的方式呈现给每一位用户。",
    },
    {
      title: "未来持续扩展",
      text: "现在有些功能还在准备中，但整个宇宙已经开始发光，新的内容会陆续加入。",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--card-soft)] text-[var(--text)] overflow-hidden relative">
      <div className="absolute inset-0 bg-[var(--bg-soft)]" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--primary-soft)_0.8px,transparent_0.8px)] [background-size:32px_32px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-8 lg:px-10">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-xs uppercase tracking-[0.28em] text-[var(--primary)] shadow-[var(--shadow-md)]">
              About Us
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight text-[var(--text)] md:text-6xl">
              一个关于
              <span className="text-[var(--primary)]">星盘、塔罗、梦境与宇宙感</span>
              的灵感空间
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--primary)] md:text-lg">
              这是一个融合占星与塔罗体验的网站。我们把本命盘、塔罗牌、AI 中文解读和视觉化宇宙元素结合在一起，
              希望让用户在神秘、柔和、沉浸的氛围里，慢慢认识自己。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-sm text-[var(--primary)]">Natal Chart</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-sm text-[var(--primary)]">Tarot Reading</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-sm text-[var(--primary)]">AI Interpretation</span>
              <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-4 py-2 text-sm text-[var(--primary)]">Cosmic Design</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto flex aspect-square max-w-[560px] items-center justify-center rounded-[36px] border border-[var(--border)] bg-[var(--bg-soft)] shadow-[var(--shadow-md)]">
              <div className="absolute inset-8 rounded-full border border-[var(--border)]" />
              <div className="absolute inset-16 rounded-full border border-[var(--border)]" />
              <div className="absolute inset-24 rounded-full border border-[var(--border)]" />

              <div className="absolute left-[10%] top-[15%] text-5xl drop-shadow-[var(--drop-shadow)]">🐢</div>
              <div className="absolute right-[12%] top-[18%] text-5xl drop-shadow-[var(--drop-shadow)]">🧚</div>
              <div className="absolute bottom-[13%] left-[16%] text-5xl drop-shadow-[var(--drop-shadow)]">🧒</div>
              <div className="absolute bottom-[15%] right-[15%] text-5xl drop-shadow-[var(--drop-shadow)]">🃏</div>

              <div className="flex h-[62%] w-[62%] items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-soft)] shadow-[var(--shadow-md)]">
                <div className="relative h-[82%] w-[82%] rounded-full border border-[var(--border)]">
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--card-soft)]" />
                  <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--card-soft)]" />
                  <div className="absolute inset-[12%] rounded-full border border-[var(--border)]" />
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div>
                      <div className="text-5xl text-[var(--primary)]">✦</div>
                      <div className="mt-3 text-lg font-medium text-[var(--text)]">Cosmic Story</div>
                      <div className="mt-1 text-sm text-[var(--primary)]">星盘 · 塔罗 · 灵感宇宙</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-[26px] border border-[var(--border)] bg-[var(--bg-soft)] p-6 shadow-[var(--shadow-md)]"
            >
              <div className="text-3xl text-[var(--primary)]">{item.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--text)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--primary)]">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="mt-18 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-[var(--border)] bg-[var(--bg-soft)] p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--primary)]">Our Vision</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--text)] md:text-4xl">
              不只是占卜页，
              而是一个让人愿意停留的宇宙角落
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--primary)]">
              我们喜欢海龟、仙女、小孩、卡牌、星图这些充满象征感的意象。
              它们并不只是装饰，而是在告诉用户：这里关于好奇、想象、情绪、命运、选择，也关于成长。
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--primary)]">
              目前网站已经具备多项核心功能，也有一部分内容还暂未开放。
              未来我们会继续扩展更多互动体验，让整个页面世界更完整。
            </p>
          </div>

          <div className="grid gap-5">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-[26px] border border-[var(--border)] bg-[var(--bg-soft)] p-6"
              >
                <h3 className="text-xl font-semibold text-[var(--primary)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--primary)]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="rounded-[34px] border border-[var(--border)] bg-[var(--bg-soft)] px-6 py-10 md:px-10 md:py-14 text-center shadow-[var(--shadow-md)]">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--primary)]">Still Growing</p>
              <h2 className="mt-4 text-3xl font-semibold text-[var(--text)] md:text-5xl">
                这片宇宙还在继续生成中
              </h2>
              <p className="mt-5 text-base leading-8 text-[var(--primary)] md:text-lg">
                有些功能已经完成，有些功能正在准备。现在的 About Us，既是在介绍我们，也是在告诉用户：这个世界还会继续发光、继续更新、继续扩展。
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-6 py-3 text-sm font-semibold text-[var(--primary)] shadow-[var(--shadow-md)] transition hover:brightness-110">
                  Explore the Universe
                </button>
                <button className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-6 py-3 text-sm font-medium text-[var(--primary)] transition hover:border-[var(--border)] hover:text-[var(--primary)]">
                  Coming Soon Features
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
