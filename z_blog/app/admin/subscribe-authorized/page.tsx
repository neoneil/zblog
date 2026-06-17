import SubscribeAuthorizedClient from "./subscribe-authorized-client";
import { requireRole } from "@/lib/auth/require-user";

export const metadata = {
  title: "Subscribe Authorized",
};

export default async function SubscribeAuthorizedPage() {
  await requireRole(["admin"]);
  return <SubscribeAuthorizedClient />;
}
