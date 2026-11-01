"use client";

import { useState, type FormEvent } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  createPricingDraft,
  displayAUD,
  type BillingMode,
  type PricingDraft,
} from "../lib/pricing";
import styles from "./site-plan.module.css";

export default function PricingPreview({
  monthlyExample,
  yearlyExample,
}: {
  monthlyExample: string;
  yearlyExample: string;
}) {
  const [mode, setMode] = useState<BillingMode>("both"),
    [monthly, setMonthly] = useState(monthlyExample),
    [yearly, setYearly] = useState(yearlyExample);
  const [draft, setDraft] = useState<PricingDraft | null>(null),
    [invalid, setInvalid] = useState(false);
  function reset() {
    setDraft(null);
    setInvalid(false);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    const next = createPricingDraft(mode, monthly, yearly);
    setInvalid(!next);
    setDraft(next);
  }
  return (
    <div className={styles.pricingTool}>
      <Badge variant="warning">示例金额 · 未确定</Badge>
      <form onSubmit={submit}>
        <fieldset>
          <legend>收费周期</legend>
          <div className={styles.radioGroup}>
            {(
              [
                ["monthly", "仅月付会员"],
                ["yearly", "仅年付会员"],
                ["both", "月付 + 年付"],
              ] as const
            ).map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="billing-mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => {
                    setMode(value);
                    reset();
                  }}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className={styles.priceFields}>
          {mode !== "yearly" && (
            <label>
              月费（AUD）
              <Input
                name="monthly-preview"
                value={monthly}
                inputMode="decimal"
                onChange={(event) => {
                  setMonthly(event.target.value);
                  reset();
                }}
                required
                aria-describedby="pricing-note"
              />
            </label>
          )}
          {mode !== "monthly" && (
            <label>
              年费（AUD）
              <Input
                name="yearly-preview"
                value={yearly}
                inputMode="decimal"
                onChange={(event) => {
                  setYearly(event.target.value);
                  reset();
                }}
                required
                aria-describedby="pricing-note"
              />
            </label>
          )}
        </div>
        <p id="pricing-note" className={styles.muted}>
          金额仅作示例。本页不保存方案，不修改真实会员价格，也不会发起支付。
        </p>
        {invalid && (
          <p role="alert" className={styles.error}>
            请输入大于 0、最多两位小数的有效金额。
          </p>
        )}
        <Button type="submit">
          <FileText size={16} aria-hidden />
          生成方案摘要
        </Button>
      </form>
      {draft && (
        <div className={styles.draftResult} role="status">
          <h3>收费方案草稿</h3>
          {draft.monthlyCents !== null && (
            <p>月付：{displayAUD(draft.monthlyCents)} / 月</p>
          )}
          {draft.yearlyCents !== null && (
            <p>年付：{displayAUD(draft.yearlyCents)} / 年</p>
          )}
          {draft.monthlyCents !== null &&
            draft.yearlyCents !== null &&
            draft.monthlyCents * 12 > draft.yearlyCents && (
              <p>
                年付比按月支付十二个月少{" "}
                {displayAUD(draft.monthlyCents * 12 - draft.yearlyCents)}。
              </p>
            )}
          <p className={styles.muted}>
            仅供方案讨论，尚未生效。课程与真人咨询仍单独收费。
          </p>
        </div>
      )}
    </div>
  );
}
