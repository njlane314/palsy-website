export const site = {
  name: "IngressShield",
  engine: "Palsy",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "Block unapproved PyPI/npm packages before they enter CI with self-hosted dependency admission and signed permits.",
  primaryClaim: "Block unapproved PyPI/npm packages before they enter CI.",
  nav: [
    { label: "Demo", href: "/#demo" },
    { label: "Onboarding", href: "/#contact" },
    { label: "Docs", href: "/docs" },
    { label: "Trust", href: "/trust" },
  ],
};

const teamStripeLink = process.env.NEXT_PUBLIC_STRIPE_TEAM_LINK;
const businessStripeLink = process.env.NEXT_PUBLIC_STRIPE_BUSINESS_LINK;

export const stripeLinks = {
  team: teamStripeLink || "/#contact",
  business: businessStripeLink || "/#contact",
  teamConfigured: Boolean(teamStripeLink),
  businessConfigured: Boolean(businessStripeLink),
};
