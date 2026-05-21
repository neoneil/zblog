import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import SubscribeAuthorizedClient from "./subscribe-authorized-client";

export const metadata = {
  title: "Subscribe Authorized",
};

export default async function SubscribeAuthorizedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未登录
  if (!user) {
    redirect("/login");
  }

  // 查 role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 非 admin
  if (profile?.role !== "admin") {
    redirect("/");
  }

  return <SubscribeAuthorizedClient />;
}