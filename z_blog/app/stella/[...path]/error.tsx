"use client";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";
export default function StellaError({ reset }: { reset: () => void }) {
  const { t } = usePreferences();
  return (
    <main className="grid min-h-[65svh] place-content-center gap-6 bg-[var(--explore-bg)] p-8 text-[var(--explore-text)]">
      <h1>
        {t({ en: "Unable to calculate this page", zh: "暂时无法计算此页面" })}
      </h1>
      <Button onClick={reset}>{t({ en: "Try again", zh: "重新尝试" })}</Button>
    </main>
  );
}
