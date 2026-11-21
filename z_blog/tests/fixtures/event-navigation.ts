export function useRouter() {
  return { refresh() {}, push(href: string) { window.dispatchEvent(new CustomEvent("event-test-route", { detail: href })); } };
}
