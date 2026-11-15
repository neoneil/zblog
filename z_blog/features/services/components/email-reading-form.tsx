"use client";

import { useId, useState, type FormEvent } from "react";
import { Mail, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePreferences } from "@/components/site/preferences-provider";
import { formatPrice } from "../lib/catalog";
import {
  normaliseEmailReadingDraft,
  type EmailReadingDraft,
} from "../lib/email-reading-order";
import { QuantityControl } from "./shop-shared";
import {
  setEmailReadingDraft,
  useEmailReadingDraft,
} from "./use-email-reading-draft";
import styles from "./email-reading.module.css";

type FormProps = {
  priceCents: number;
  onAdd: (draft: EmailReadingDraft) => void;
};
export default function EmailReadingForm(props: FormProps) {
  const draft = useEmailReadingDraft();
  return (
    <EmailReadingFields
      key={draft ? `${draft.email}-${draft.questions.length}` : "new"}
      {...props}
      draft={draft}
    />
  );
}
function EmailReadingFields({
  priceCents,
  onAdd,
  draft,
}: FormProps & { draft: EmailReadingDraft | null }) {
  const { t, language } = usePreferences();
  const [quantity, onQuantityChange] = useState(draft?.questions.length ?? 1);
  const [questions, setQuestions] = useState(draft?.questions ?? [""]);
  const [error, setError] = useState("");
  const prefix = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const value = normaliseEmailReadingDraft(
      {
        name: values.get("name"),
        birthDate: values.get("birthDate"),
        email: values.get("email"),
        background: values.get("background"),
        questions: values.getAll("questions"),
      },
      date,
    );
    if (!value || value.questions.length !== quantity) {
      setError(
        t({
          zh: "请填写姓名、有效邮箱及每个问题；出生日期须为有效的过去日期。",
          en: "Enter your name, a valid email and every question. Any birth date must be a valid past date.",
        }),
      );
      return;
    }
    setError("");
    setEmailReadingDraft(value);
    onAdd(value);
  }
  return (
    <form
      id="email-reading-order"
      onSubmit={submit}
      className={styles.form}
      aria-labelledby={`${prefix}-title`}
    >
      <h2 id={`${prefix}-title`}>
        {t({ zh: "私人塔罗邮件占卜", en: "Your Personal Email Reading" })}
      </h2>
      <p>
        {t({
          zh: "一个独立问题对应一份占卜。",
          en: "One reading covers one independent question.",
        })}
      </p>
      <label>
        {t({ zh: "咨询问题数量", en: "Number of questions" })}
        <QuantityControl
          value={quantity}
          onChange={onQuantityChange}
          label={t({ zh: "咨询问题数量", en: "Number of questions" })}
        />
      </label>
      <div className={styles.fields}>
        <div>
          <label htmlFor={`${prefix}-name`}>
            {t({ zh: "姓名或昵称", en: "Name or nickname" })} *
          </label>
          <Input
            id={`${prefix}-name`}
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            defaultValue={draft?.name ?? ""}
          />
        </div>
        <div>
          <label htmlFor={`${prefix}-birth`}>
            {t({ zh: "出生日期（选填）", en: "Birth date (optional)" })}
          </label>
          <Input
            id={`${prefix}-birth`}
            name="birthDate"
            type="date"
            defaultValue={draft?.birthDate ?? ""}
          />
        </div>
      </div>
      {Array.from({ length: quantity }, (_, index) => (
        <div key={index}>
          <label htmlFor={`${prefix}-question-${index}`}>
            {t({ zh: `问题 ${index + 1}`, en: `Question ${index + 1}` })} *
          </label>
          <Textarea
            id={`${prefix}-question-${index}`}
            name="questions"
            required
            maxLength={2000}
            rows={3}
            value={questions[index] ?? ""}
            onChange={(event) =>
              setQuestions((previous) => {
                const next = [...previous];
                next[index] = event.target.value;
                return next;
              })
            }
          />
        </div>
      ))}
      <div>
        <label htmlFor={`${prefix}-background`}>
          {t({
            zh: "当前处境或背景（选填）",
            en: "Current situation or background (optional)",
          })}
        </label>
        <Textarea
          id={`${prefix}-background`}
          name="background"
          maxLength={4000}
          rows={3}
          defaultValue={draft?.background ?? ""}
        />
      </div>
      <div>
        <label htmlFor={`${prefix}-email`}>
          {t({ zh: "接收结果的电子邮箱", en: "Email for your reading" })} *
        </label>
        <Input
          id={`${prefix}-email`}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          defaultValue={draft?.email ?? ""}
        />
      </div>
      <div className={styles.total}>
        <span>{t({ zh: "合计", en: "Total" })}</span>
        <strong>{formatPrice(priceCents * quantity, language)}</strong>
      </div>
      <p className={styles.delivery}>
        <Mail size={17} aria-hidden="true" />
        {t({
          zh: "正式订单确认后 24–48 小时邮件交付",
          en: "Email delivery within 24–48 hours after a confirmed order",
        })}
      </p>
      <p className={styles.notice}>
        {t({
          zh: "当前为预览，暂不收款或发送订单邮件，STARS 支付尚未开通。咨询资料仅保留在本次页面会话的内存中，刷新后会清空，不会自动发送。",
          en: "Preview only: no payment or order email is sent, and STARS payments are not enabled. Consultation details stay only in this page session's memory, are cleared on refresh and are not automatically transmitted.",
        })}
      </p>
      {error && <p role="alert">{error}</p>}
      <Button type="submit">
        <ShoppingCart size={18} aria-hidden="true" />
        {t({ zh: "加入购物车", en: "Add to cart" })}
      </Button>
    </form>
  );
}
