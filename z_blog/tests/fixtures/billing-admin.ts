export function createAdminClient() {
  const client = (globalThis as { stardustTestAdmin?: unknown })
    .stardustTestAdmin;
  if (!client) throw new Error("Isolated test client not initialized");
  return client;
}
