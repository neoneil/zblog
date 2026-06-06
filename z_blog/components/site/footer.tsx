import Link from "next/link";
import Container from "./container";

const footerColumns = [
  {
    title: "主要分类",
    links: [
      { label: "理解儿童", href: "/" },
      { label: "学习与教育", href: "/" },
      { label: "情绪智慧", href: "/" },
      { label: "宇宙想象", href: "/" },
    ],
  },
  {
    title: "探索",
    links: [
      { label: "最新文章", href: "/" },
      { label: "精选主题", href: "/" },
      { label: "资源", href: "/" },
      { label: "阅读指南", href: "/" },
    ],
  },
  {
    title: "社区",
    links: [
      { label: "合作伙伴", href: "/" },
      { label: "协作者", href: "/" },
      { label: "特邀作者", href: "/" },
      { label: "订阅通讯", href: "/" },
    ],
  },
  {
    title: "关于",
    links: [
      { label: "我们的故事", href: "/" },
      { label: "使命", href: "/" },
      { label: "联系", href: "/" },
      { label: "支持", href: "/" },
    ],
  },
  {
    title: "更多",
    links: [
      { label: "隐私", href: "/" },
      { label: "条款", href: "/" },
      { label: "常见问题", href: "/" },
      { label: "首页", href: "/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--card-muted)] shadow-[var(--shadow-md)] backdrop-blur-xl">
      <Container>
        <div className="py-10 sm:py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">
                星语童年
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[var(--text-soft)]">
                一个关于童年、学习、情绪与想象力的温柔空间。
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  {column.title}
                </h3>

                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--text-soft)] transition hover:text-[var(--text)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-faint)] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 星语童年. 保留所有权利。</p>
            <p>
              制作：<span className="font-medium text-[var(--text-soft)]">Chi</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
