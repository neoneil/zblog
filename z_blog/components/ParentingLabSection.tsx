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
                <div className="relative overflow-hidden rounded-[28px] border border-[#d5b47a]/20 bg-[#1a1616] shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                    <main className="min-h-screen bg-[#0f0d12] px-4 py-8 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-[1280px]">
                            <section className="relative overflow-hidden rounded-[28px] border border-[#d5b47a]/20 bg-[#1a1616] shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                                {/* background layers */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,206,125,0.12),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(255,214,158,0.14),transparent_20%),radial-gradient(circle_at_50%_100%,rgba(118,78,39,0.18),transparent_34%),linear-gradient(180deg,#2a231d_0%,#1b1715_48%,#141113_100%)]" />
                                <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,234,189,0.9)_0.8px,transparent_0.8px)] [background-size:28px_28px]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(0,0,0,0.20)_100%)]" />

                                {/* soft decorative glows */}
                                <div className="absolute left-[-40px] top-[40px] h-[180px] w-[180px] rounded-full bg-[#f6c87a]/10 blur-3xl" />
                                <div className="absolute bottom-[-30px] right-[120px] h-[160px] w-[160px] rounded-full bg-[#e8a96c]/10 blur-3xl" />
                                <div className="absolute right-[-20px] top-[120px] h-[140px] w-[140px] rounded-full bg-[#f6d6a0]/10 blur-3xl" />

                                <div className="relative z-10 grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_340px] lg:gap-8">
                                    {/* left side */}
                                    <div>
                                        <div className="mb-6 flex items-center gap-3">
                                            <h1 className="text-[28px] font-medium tracking-[0.01em] text-[#f4e6c7] md:text-[34px]">
                                                Cosmic Parenting Lab
                                            </h1>
                                            <div className="hidden h-px flex-1 bg-gradient-to-r from-[#d4b06e]/40 to-transparent md:block" />
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-3">
                                            {cards.map((card) => (
                                                <Link
                                                    key={card.title}
                                                    href={card.href}
                                                    className="group overflow-hidden rounded-[18px] border border-[#dfbf84]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:border-[#e6c07f]/38"
                                                >
                                                    {/* image area placeholder */}
                                                    <div className="relative h-[170px] overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(255,216,150,0.22),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(255,210,135,0.16),transparent_20%),linear-gradient(180deg,#6b4f36_0%,#5c4230_32%,#3b2c24_100%)]">
                                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18)_65%,rgba(0,0,0,0.45)_100%)]" />

                                                        {/* fake warm bokeh */}
                                                        <div className="absolute left-[14%] top-[18%] h-6 w-6 rounded-full bg-[#ffd590]/35 blur-md" />
                                                        <div className="absolute right-[18%] top-[24%] h-7 w-7 rounded-full bg-[#ffe2aa]/30 blur-md" />
                                                        <div className="absolute left-[32%] bottom-[22%] h-5 w-5 rounded-full bg-[#ffc778]/30 blur-md" />

                                                        {/* portrait placeholder */}
                                                        <div className="absolute inset-x-6 bottom-5 top-4 rounded-[14px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,236,207,0.14),rgba(255,214,158,0.06))] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />

                                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                                            <div className="rounded-[10px] bg-[rgba(55,30,21,0.62)] px-3 py-2 backdrop-blur-[2px]">
                                                                <p className="text-center text-[13px] font-medium tracking-[0.08em] text-[#f5e3c1]">
                                                                    {card.title}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        <p className="text-sm leading-6 text-[#dbcdb4]/78">
                                                            {card.description}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* right side newsletter */}
                                    <div className="flex">
                                        <div className="w-full rounded-[22px] border border-[#deb979]/28 bg-[linear-gradient(180deg,#efd8b7_0%,#e5c69c_100%)] p-5 text-[#4a2d1b] shadow-[0_14px_40px_rgba(0,0,0,0.22)] md:p-6">
                                            <div className="flex h-full flex-col justify-between">
                                                <div>
                                                    <p className="text-[30px] font-medium italic leading-none text-[#5b331f]">
                                                        Newsletter
                                                    </p>
                                                    <p className="mt-2 text-[26px] leading-none text-[#6a4228]">
                                                        Stay Connected
                                                    </p>

                                                    <p className="mt-5 text-sm leading-7 text-[#6f4c36]">
                                                        Subscribe to receive new articles on early childhood
                                                        education and cosmic parenting.
                                                    </p>

                                                    <div className="mt-6 space-y-3">
                                                        <input
                                                            type="email"
                                                            placeholder="Your Email"
                                                            className="w-full rounded-[12px] border border-[#c9a47a] bg-[#fff7ea] px-4 py-3 text-sm text-[#5a3825] outline-none placeholder:text-[#9a775d] focus:border-[#9f734f]"
                                                        />

                                                        <Link
                                                            href="/newsletter"
                                                            className="inline-flex w-full items-center justify-center rounded-[12px] bg-[#7c8f57] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#70824d]"
                                                        >
                                                            Subscribe
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="mt-6 border-t border-[#caa882]/55 pt-4">
                                                    <p className="text-xs leading-6 text-[#7a5944]">
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