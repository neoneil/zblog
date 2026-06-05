import Link from "next/link";

const cards = [
    {
        title: "ASK TAROT MOM",
        href: "/parentinglab/asktarotmom",
        description: "Intuitive support for parents through tarot-inspired reflection.",
    },
    {
        title: "HEALING DAILY",
        href: "/parentinglab/healingdaily",
        description: "Gentle emotional care, small rituals, and everyday healing moments.",
    },
    {
        title: "MUSIC THERAPY",
        href: "/parentinglab/musictherapy",
        description: "Creative sound, rhythm, and music-centered ideas for children.",
    },
];

export default function ParentingLabSection() {
    return (
        <section className="px-4 py-8 md:px-6 lg:px-8">
            <div className="mx-auto max-w-[1280px]">
                <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card-soft)] shadow-[var(--shadow-md)]">
                    <main className="min-h-screen bg-[var(--card-soft)] px-4 py-8 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-[1280px]">
                            <section className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card-soft)] shadow-[var(--shadow-md)]">
                                {/* background layers */}
                                <div className="absolute inset-0 bg-[var(--bg-soft)]" />
                                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(var(--primary-soft)_0.8px,transparent_0.8px)] [background-size:28px_28px]" />
                                <div className="absolute inset-0 bg-[var(--bg-soft)]" />

                                {/* soft decorative glows */}
                                <div className="absolute left-[-40px] top-[40px] h-[180px] w-[180px] rounded-full bg-[var(--card-soft)] blur-3xl" />
                                <div className="absolute bottom-[-30px] right-[120px] h-[160px] w-[160px] rounded-full bg-[var(--card-soft)] blur-3xl" />
                                <div className="absolute right-[-20px] top-[120px] h-[140px] w-[140px] rounded-full bg-[var(--card-soft)] blur-3xl" />

                                <div className="relative z-10 grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_340px] lg:gap-8">
                                    {/* left side */}
                                    <div>
                                        <div className="mb-6 flex items-center gap-3">
                                            <h1 className="text-[28px] font-medium tracking-[0.01em] text-[var(--primary)] md:text-[34px]">
                                                Cosmic Parenting Lab
                                            </h1>
                                            <div className="hidden h-px flex-1 bg-gradient-to-r  to-transparent md:block" />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            {cards.map((card) => (
                                                <Link
                                                    key={card.title}
                                                    href={card.href}
                                                    className="group overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--bg-soft)] shadow-[var(--shadow-md)] transition duration-300 hover:-translate-y-1 hover:border-[var(--border)]"
                                                >
                                                    {/* image area placeholder */}
                                                    <div className="relative h-[170px] overflow-hidden bg-[var(--bg-soft)]">
                                                        <div className="absolute inset-0 bg-[var(--bg-soft)]" />

                                                        {/* fake warm bokeh */}
                                                        <div className="absolute left-[14%] top-[18%] h-6 w-6 rounded-full bg-[var(--card-soft)] blur-md" />
                                                        <div className="absolute right-[18%] top-[24%] h-7 w-7 rounded-full bg-[var(--card-soft)] blur-md" />
                                                        <div className="absolute left-[32%] bottom-[22%] h-5 w-5 rounded-full bg-[var(--card-soft)] blur-md" />

                                                        {/* portrait placeholder */}
                                                        <div className="absolute inset-x-6 bottom-5 top-4 rounded-[14px] border border-[var(--border)] bg-[var(--bg-soft)] shadow-[var(--shadow-md)]" />

                                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                                            <div className="rounded-[10px] bg-[var(--card-soft)] px-3 py-2 backdrop-blur-[2px]">
                                                                <p className="text-center text-[13px] font-medium tracking-[0.08em] text-[var(--primary)]">
                                                                    {card.title}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        <p className="text-sm leading-6 text-[var(--primary)]">
                                                            {card.description}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* right side newsletter */}
                                    <div className="flex">
                                        <div className="w-full rounded-[22px] border border-[var(--border)] bg-[var(--bg-soft)] p-5 text-[var(--primary)] shadow-[var(--shadow-md)] md:p-6">
                                            <div className="flex h-full flex-col justify-between">
                                                <div>
                                                    <p className="text-[30px] font-medium italic leading-none text-[var(--primary)]">
                                                        Newsletter
                                                    </p>
                                                    <p className="mt-2 text-[26px] leading-none text-[var(--primary)]">
                                                        Stay Connected
                                                    </p>

                                                    <p className="mt-5 text-sm leading-7 text-[var(--primary)]">
                                                        Subscribe to receive new articles on early childhood
                                                        education and cosmic parenting.
                                                    </p>

                                                    <div className="mt-6 space-y-3">
                                                        <input
                                                            type="email"
                                                            placeholder="Your Email"
                                                            className="w-full rounded-[12px] border border-[var(--border)] bg-[var(--card-soft)] px-4 py-3 text-sm text-[var(--primary)] outline-none placeholder:text-[var(--primary)] focus:border-[var(--border)]"
                                                        />

                                                        <Link
                                                            href="/newsletter"
                                                            className="inline-flex w-full items-center justify-center rounded-[12px] bg-[var(--card-soft)] px-4 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--card-soft)]"
                                                        >
                                                            Subscribe
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="mt-6 border-t border-[var(--border)] pt-4">
                                                    <p className="text-xs leading-6 text-[var(--primary)]">
                                                        Gentle updates, inspiration, and future community news.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
}