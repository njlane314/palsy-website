# IngressShield Website

Next.js product site for IngressShield, the commercial brand for the Palsy package-ingress
engine.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Motion
- MDX configured for future docs, blog, and changelog content
- Vercel deployment
- PostHog funnel/event analytics
- Postmark contact-form delivery

Sanity is intentionally omitted for now. Add it only if non-developers need to edit site
content.

## Development

Use Node `22.13.0` or newer. The local machine used to scaffold this app had Node `22.9.0`,
which installs with an engine warning from one transitive lint dependency.

```bash
cd website
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content

The public product surface has a homepage, separate documentation page, and trust page:

- `src/app/page.tsx` contains the homepage, editorial hero, trusted-team strip, key highlights,
  admission workspace preview, product-capabilities band, numbered platform story, decision model,
  policy playground, rollout story, use cases, CLI demo replay, deploy YAML, pricing, and contact
  form.
- `src/app/docs/page.tsx` contains the dedicated documentation route.
- `src/app/trust/page.tsx` contains release evidence, SBOM/provenance/checksum messaging, and
  buyer-side verification commands.
- `src/components/live-admission-demo.tsx` contains the animated admission-control demo.
- `src/components/policy-playground.tsx` contains the strict/review/observe policy controls.
- `src/components/hero-console.tsx` contains the premium first-viewport product console.
- `src/components/product-diagram.tsx` contains the request-to-permit system diagram.
- `src/components/trust-band.tsx` contains the customer-ready trust band.
- `src/components/site-footer.tsx` contains the shared product footer.
- `src/components/reveal.tsx` contains restrained scroll-in motion for sections.
- `src/components/hero-scene.tsx` contains the animated first-viewport product scene.
- `src/components/docs-shell.tsx` contains the Read-the-Docs-style documentation layout.
- `src/components/code-block.tsx` adds copy controls for documentation commands.
- `src/lib/docs-content.ts` contains grouped documentation navigation and examples.
- `src/lib/site.ts` contains product metadata, navigation, and Stripe Payment Link wiring.
- `public/demo/malicious-package-denied.gif` is generated from the real five-minute CLI demo
  output.
- `src/app/api/contact/route.ts` handles demo requests.

MDX is installed and configured for later long-form docs, blog, or changelog expansion.
The current docs route uses structured TypeScript content so the first product documentation
surface can ship with search/filtering and copyable command examples.

## Analytics

Set these on Vercel to enable PostHog:

```text
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

The contact form captures `demo_request_submitted` after successful submission.

## Stripe

Create live Stripe Payment Links for the Team and Business plans, then set:

```text
NEXT_PUBLIC_STRIPE_TEAM_LINK=
NEXT_PUBLIC_STRIPE_BUSINESS_LINK=
```

When either value is unset, the matching pricing button falls back to the contact form instead of
using a fake checkout URL.

## Contact Form

Set these on Vercel to send demo requests through Postmark:

```text
POSTMARK_SERVER_TOKEN=
CONTACT_TO_EMAIL=sales@example.com
CONTACT_FROM_EMAIL=sales@example.com
```

Without these values, the API route accepts the request locally but skips email delivery.

## Deploy

Create a Vercel project pointed at `website/` as the root directory. Add the environment
variables above, then deploy from `main`.
