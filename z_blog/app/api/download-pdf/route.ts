import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未登录
  if (!user) {
    return NextResponse.json(
      { error: "请先登录." },
      { status: 401 }
    );
  }

  // 查 role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 非 subscribed
  if (profile?.role !== "subscribed" &&
      profile?.role !== "admin") {
    return NextResponse.json(
      { error: "此功能为订阅功能，请联系主办人." },
      { status: 403 }
    );
  }

  // 放行 PDF
  const pdfUrl = "/pdfs/astro-guide.pdf";

  return NextResponse.json({
    ok: true,
    url: pdfUrl,
  });
}