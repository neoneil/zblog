export function useRouter() {
  // Deliberately unstable to cover router identities changing after refresh.
  return {
    refresh: () => window.dispatchEvent(new Event("wallet-test-refresh")),
  };
}

export function useSearchParams() {
  return new URLSearchParams(window.location.search);
}
