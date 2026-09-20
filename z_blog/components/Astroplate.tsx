import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

type AstroplateProps = {
    imageSrc: string;
};

export default function Astroplate({ imageSrc }: AstroplateProps) {
    return (
        <section className="relative min-h-[230px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card-soft)] p-5 shadow-[var(--shadow-md)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] sm:p-6">
            <div className="absolute inset-0 bg-[var(--section-gradient)]" />

            <div className="absolute bottom-2 right-2 top-2 w-[48%] opacity-95 sm:right-4 sm:w-[46%] md:w-[48%] lg:w-[44%] xl:w-[42%]">
                <Image
                    src={imageSrc}
                    alt="星盘"
                    fill
                    priority
                    className="object-contain object-right"
                    sizes="(max-width: 768px) 46vw, 22vw"
                />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--card-soft)_0%,color-mix(in_srgb,var(--card-soft)_82%,transparent)_48%,transparent_72%)]" />

            <div className="relative z-10 flex h-full max-w-[58%] flex-col justify-between gap-5 sm:max-w-[56%]">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-muted)]">
                        Astroplate
                    </p>

                    <h2 className="text-xl font-semibold leading-snug text-[var(--primary)] sm:text-2xl">
                        查看你的星盘结构
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[var(--primary)]">
                        从核心星体、宫位与能量节奏开始，快速获得更清晰的自我观察入口。
                    </p>
                </div>

                <div>
                    <ButtonLink href="/astroplate" variant="primary" size="sm">
                        打开星盘
                    </ButtonLink>
                </div>
            </div>
        </section>
    );
}
