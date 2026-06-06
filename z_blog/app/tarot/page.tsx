import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import TarotClient from "@/components/tarot/tarot-client";

export const metadata = {
  title: "塔罗解读",
  description: "抽取三张塔罗牌，获得 AI 解读。",
};

export default async function TarotPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 没登录
  if (!user) {
    redirect("/login");
  }

  // 查 profiles.role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 不是 subscribed 也不是 admin
  if (
    profile?.role !== "subscribed" &&
    profile?.role !== "admin"
  ) {
    redirect("/pricing");
  }

  // 放行
  return <TarotClient />;
}
