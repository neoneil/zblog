"use client";

import { useSyncExternalStore } from "react";
import type { EmailReadingDraft } from "../lib/email-reading-order";

// Consultation data stays in memory only, separate from the persisted cart.
let draft: EmailReadingDraft | null = null;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
const getSnapshot = () => draft;
const getServerSnapshot = () => null;
export function setEmailReadingDraft(value: EmailReadingDraft | null) {
  draft = value;
  listeners.forEach((listener) => listener());
}
export function useEmailReadingDraft() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
