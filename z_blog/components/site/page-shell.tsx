import { ReactNode } from "react";
import Container from "@/components/site/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main
      className={cn(
        "min-h-screen bg-[var(--bg)] bg-[image:var(--app-gradient)] text-[var(--text)]",
        className
      )}
    >
      {children}
    </main>
  );
}

type PageSectionProps = {
  children: ReactNode;
  className?: string;
};

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <section className={cn("py-8 sm:py-10 lg:py-12", className)}>
      <Container>{children}</Container>
    </section>
  );
}

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
  className,
}: PageHeroProps) {
  return (
    <PageSection className={cn("pt-6 sm:pt-8 lg:pt-10", className)}>
      <div className="grid gap-5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[color:var(--card)]/92 p-5 shadow-[var(--shadow-md)] backdrop-blur-xl sm:p-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:p-8">
        <div>
          {eyebrow ? (
            <Badge variant="secondary" className="mb-4">
              {eyebrow}
            </Badge>
          ) : null}
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-soft)] sm:text-base lg:text-lg">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </PageSection>
  );
}

