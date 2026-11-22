"use client";

import { ButtonLink } from "@/components/ui/button";
import { usePreferences } from "@/components/site/preferences-provider";
import { MEMBERSHIPS } from "../lib/stardust-config";

const defaultActions = ["signUp", "signIn", "monthly", "annual"] as const;
type MembershipAction = (typeof defaultActions)[number];

export function MembershipActions({
  signedIn,
  actions = defaultActions,
  returnTo,
}: {
  signedIn: boolean;
  actions?: readonly MembershipAction[];
  returnTo?: string;
}) {
  const { language, t } = usePreferences();
  const authQuery = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
  const links = {
    signUp: {
      href: `/sign-up${authQuery}`,
      label: t({ zh: "注册免费会员", en: "Sign up for free" }),
    },
    signIn: {
      href: `/login${authQuery}`,
      label: t({ zh: "登录账户", en: "Sign in" }),
    },
    monthly: {
      href: "/pricing#membership-monthly",
      label: MEMBERSHIPS.monthly[language],
    },
    annual: {
      href: "/pricing#membership-annual",
      label: MEMBERSHIPS.annual[language],
    },
  };
  const visibleActions = actions.filter(
    (action) => !signedIn || (action !== "signUp" && action !== "signIn"),
  );
  if (!visibleActions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleActions.map((action) => (
        <ButtonLink
          key={action}
          href={links[action].href}
          variant={action === "signUp" ? "primary" : "secondary"}
          className="h-auto min-h-11 py-2 text-center"
        >
          {links[action].label}
        </ButtonLink>
      ))}
    </div>
  );
}
