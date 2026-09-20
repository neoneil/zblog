import Link from "next/link";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  meta?: string;
  children?: ReactNode;
  className?: string;
};

export function FeatureCard({
  title,
  description,
  href,
  badge,
  meta = "进入",
  children,
  className,
}: FeatureCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden bg-[color:var(--card)]/94 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[var(--shadow-md)]",
          className
        )}
      >
        <CardContent className="flex h-full flex-col p-0">
          <div className="border-b border-[var(--border)] bg-[linear-gradient(135deg,var(--card-soft),var(--bg-soft))] p-5">
            <div className="flex items-center justify-between gap-3">
              {badge ? <Badge variant="secondary">{badge}</Badge> : <span />}
              <span className="text-xs font-medium text-[var(--text-faint)]">
                {meta}
              </span>
            </div>
            {children ? <div className="mt-5">{children}</div> : null}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-semibold text-[var(--text)] transition group-hover:text-[var(--primary)]">
              {title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-6 text-[var(--text-soft)]">
              {description}
            </p>
            <p className="mt-5 text-sm font-semibold text-[var(--primary)]">
              打开 →
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

