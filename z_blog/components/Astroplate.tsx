import Link from "next/link";
import Image from "next/image";

type AstroplateProps = {
    imageSrc: string;
};

export default function Astroplate({ imageSrc }: AstroplateProps) {
    return (
        <div className="relative h-full min-h-[520px] overflow-hidden rounded-[32px] border border-[var(--border)]">
            <Image
                src={imageSrc}
                alt="Astro plate"
                fill
                priority
                className="object-fill"
            />

            <div className="absolute inset-0 bg-[var(--card-muted)]" />

            <div className="relative flex h-full items-end justify-center p-8 md:p-10">
                <Link
                    href="/astroplate"
                    className="topic-btn-blue inline-flex min-w-[360px] items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-[var(--text)] transition-all duration-300"
                >
                    Discover your child&apos;s star map
                </Link>
            </div>
        </div>
    );
}