import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import AstrologyClient from "./astrology-client";

export const metadata = {
  title: "星盘解读",
  description: "AI 星盘解读",
};

export default async function AstrologyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 没登录
  if (!user) {
    redirect("/login");
  }

  // 已登录，放行
  return <AstrologyClient />;
}
