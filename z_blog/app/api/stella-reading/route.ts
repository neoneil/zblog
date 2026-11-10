import { NextResponse } from "next/server";
import { STELLA_CONSULTATION_HREF } from "@/features/stella/lib/consultation";

// Retired: old clients must not generate readings or consume an allowance.
export async function POST() {
  return NextResponse.json(
    {
      code: "consultation_required",
      consultationUrl: STELLA_CONSULTATION_HREF,
      message: {
        zh: "请前往星盘咨询页面获取专业解读。",
        en: "Please visit the chart consultation page for a professional reading.",
      },
    },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  );
}
