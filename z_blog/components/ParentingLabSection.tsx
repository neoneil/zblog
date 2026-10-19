import { FeatureCard } from "@/components/site/feature-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const cards = [
  {
    title: "Ask Tarot",
    href: "/parentinglab/asktarotmom",
    adminHref: "/parentinglab/asktarotmom",
    badge: "塔罗",
    description: "用塔罗式提问整理情绪、关系与选择，适合作为亲子沟通前的思考工具。",
  },
  {
    title: "The Art of Tarot",
    href: "/parentinglab/healingdaily",
    adminHref: "/parentinglab/healingdaily/videos",
    badge: "疗愈",
    description: "展示已发布的视频内容，让每日练习、情绪照顾与家庭节奏更容易落地。",
  },
  {
    title: "The Tarot Archive ",
    href: "/parentinglab/musictherapy",
    adminHref: "/admin/tarot-gallery",
    badge: "素材",
    description: "管理员可进入图片知识库与飞书文档入口，集中查看当前整理好的素材资产。",
  },
];

type ParentingLabSectionProps = {
  isAdmin?: boolean;
};

export default function ParentingLabSection({
  isAdmin = false,
}: ParentingLabSectionProps) {
  return (
    <section className="py-8 sm:py-10">
      <Card className="overflow-hidden bg-[color:var(--card)]/94">
        <CardHeader className="border-b border-[var(--border)] bg-[var(--section-gradient)] px-5 py-6 sm:px-6">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="secondary">Parenting Lab</Badge>
              <CardTitle className="mt-3 text-2xl sm:text-3xl">
                亲子实验室
              </CardTitle>
              <CardDescription className="max-w-2xl leading-6">
                把 AI、疗愈视频与素材知识库放在同一个运营入口里，前端体验保持轻量，后台入口清晰可控。
              </CardDescription>
            </div>

            <ButtonLink href="/parentinglab" variant="secondary" size="sm">
              查看全部
            </ButtonLink>
          </div>
        </CardHeader>

        <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_320px] sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {cards.map((card) => (
              <FeatureCard
                key={card.title}
                title={card.title}
                description={card.description}
                href={isAdmin ? card.adminHref : card.href}
                badge={card.badge}
                meta={isAdmin ? "Admin" : "Front"}
              />
            ))}
          </div>

          <Card className="bg-[var(--card-soft)]">
            <CardHeader className="block px-5 py-5">
              <Badge variant="outline">Newsletter</Badge>
              <CardTitle className="mt-3 text-xl">订阅更新</CardTitle>
              <CardDescription className="leading-6">
                用于后续承接课程、视频和会员权益更新。
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 px-5 pb-5 pt-0">
              <Input type="email" placeholder="你的邮箱" />
              <ButtonLink href="/newsletter" variant="primary" fullWidth>
                订阅
              </ButtonLink>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
}
