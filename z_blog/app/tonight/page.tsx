import Container from "@/components/site/container";
import { PageShell } from "@/components/site/page-shell";
import TonightExperience from "@/components/site/tonight-experience";

import { createClient } from "@/lib/supabase/server";
import { memberDailyDraw } from "@/features/star-message/member-draws";
import { readDraw, sydneyDay } from "@/features/star-message/daily";
import { starCardBackImage, starCardImage } from "@/features/star-message/storage";

export const metadata = { title: "今夜星辰想对你说 · Tonight, the Stars Speak" };

export default async function TonightPage() {
  const day = sydneyDay();
  const db = await createClient();
  const [{ data: { user } }, browserDraw] = await Promise.all([db.auth.getUser(), readDraw()]);
  const accountDraw = user ? await memberDailyDraw(db, user.id, day).catch(() => null) : null;
  const draw = accountDraw ?? browserDraw;
  const initial = draw?.day === day
    ? await starCardImage(draw.cardId).then((image) => ({ cardId: draw.cardId, drawId: draw.id, image })).catch(() => null)
    : null;
  const backImage = initial ? null : await starCardBackImage().catch(() => null);
  return (
    <PageShell>
      <Container>
        <TonightExperience initial={initial} backImage={backImage} />
      </Container>
    </PageShell>
  );
}
