# Portfolio 2026

Personal portfolio for John Dennis "Jaydee" Bernardo — Senior AI Engineer & Full-Stack Developer.

Built with Nuxt 4, Vue 3, TypeScript, Tailwind CSS v4, GSAP, and HTML5 Canvas.

## Local setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Commands

```bash
pnpm dev          # development server
pnpm build        # production build
pnpm generate     # static generation to .output/public
pnpm dlx serve .output/public -l 3000   # preview the static build
pnpm typecheck    # TypeScript check
pnpm test         # unit + Nuxt component tests
pnpm test:e2e     # Playwright end-to-end tests
```

## Editing content

- **Site identity, links, navigation:** `app/data/site.ts`
- **Case studies:** `app/data/work.ts`
- **Services:** `app/data/services.ts`
- **Bug Smash file grid:** `app/data/bugSmash.ts`
- **Command palette entries:** `app/data/commands.ts`

Case studies are typed with `WorkStudy` in `app/types/content.ts`. Keep the four slugs stable unless you also update internal links.

## Contact form

Set the Formspree endpoint before deploying:

```bash
NUXT_PUBLIC_FORMSPREE_ENDPOINT="https://formspree.io/f/your-id"
```

If the endpoint is empty, the form falls back to a `mailto:` link instead of posting.

## Social image

`public/og-image.png` is the 1200×630 social card. The editable source is `public/og-image.svg`; regenerate the PNG after changing it:

```bash
pnpm dlx sharp-cli -i public/og-image.svg -o public/og-image.png
```

The `ogImage`, `ogImageAlt`, and `twitterImage` paths are set in:

- `app/pages/index.vue`
- `app/pages/work/[slug].vue`
- `app/pages/privacy.vue`

## Deployment

The site is statically generated. Deploy `.output/public` to any static host, or connect the repository to Vercel/Netlify with:

- Build command: `pnpm generate`
- Output directory: `.output/public`

`@nuxtjs/seo` generates `sitemap.xml` and `robots.txt` from the `site` config in `nuxt.config.ts`.

## Content guardrails

- Do **not** name the government agencies (PNA, DOJ). Use "a government agency website."
- The **5x** grading figure is an owner-stated estimate and must stay labeled as an estimate.
- Do not invent metrics, testimonials, or client outcomes.
- The four named web clients may appear as plain text; do not use their logos without permission.
- Keep the phone number private.
- No analytics at launch unless a privacy-friendly account is added deliberately.
