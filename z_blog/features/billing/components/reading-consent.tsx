"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";
import type { ReadingConsentDetail } from "../lib/reading-fetch";

export default function ReadingConsent() {
  const { t } = usePreferences();
  const ref = useRef<HTMLDialogElement>(null);
  const pending = useRef<ReadingConsentDetail | null>(null);
  const [stars, setStars] = useState(0);
  const finish = (allowed: boolean) => {
    pending.current?.resolve(allowed);
    pending.current = null;
    ref.current?.close();
  };
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ReadingConsentDetail>).detail;
      if (pending.current) {
        detail.resolve(false);
        return;
      }
      pending.current = detail;
      setStars(detail.stars);
      ref.current?.showModal();
    };
    window.addEventListener("stardust-consent", handler);
    return () => {
      window.removeEventListener("stardust-consent", handler);
      pending.current?.resolve(false);
      pending.current = null;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={() => finish(false)}
      aria-labelledby="stars-consent-title"
      className="m-auto w-[min(420px,calc(100vw-32px))] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--text)] shadow-[var(--shadow-lg)] backdrop:bg-[var(--archive-overlay)]"
    >
      <h2 id="stars-consent-title" className="text-xl font-semibold">
        {t({ zh: "确认积分支付", en: "Confirm STARS payment" })}
      </h2>
      <p className="my-5 leading-7">
        {t({
          zh: `本次完整解读需要 ${stars} STARS。成功生成报告后结算，失败自动退回。`,
          en: `This reading costs ${stars} STARS. Payment settles after a report is saved; failed readings are released.`,
        })}
      </p>
      <div className="flex gap-3">
        <Button onClick={() => finish(true)}>
          {t({ zh: "确认使用STARS", en: "Pay with STARS" })}
        </Button>
        <Button variant="secondary" onClick={() => finish(false)}>
          {t({ zh: "取消", en: "Cancel" })}
        </Button>
      </div>
    </dialog>
  );
}
