# Mentoring Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Static one-page landing for QA/AQA mentoring, fully driven by `src/content.ts`.

**Architecture:** Next.js App Router, `output: "export"`. Server components only (no client JS needed:
FAQ uses native `<details>`). Content is a typed object; sections are pure components reading it.
Design tokens are CSS variables mapped into Tailwind v4 via `@theme inline`.

**Tech Stack:** next 16.4.5, react 19.3.1, tailwindcss 4 + @tailwindcss/postcss, typescript ^5,
vitest 5 + @testing-library/react + jsdom.

**Spec:** `docs/superpowers/specs/2026-11-09-mentoring-landing-design.md`

## Global Constraints

- No hardcoded user-facing text in `src/components/**` — enforced by a test (no Cyrillic there).
- Colors only via tokens: canvas #F3F4F1, ink #0F1115, muted #3D424A, line #DCDED9, accent #2B50FF, passed #1B7A43.
- Fonts: Unbounded 700 (display), Inter (sans), JetBrains Mono (mono), subsets latin + cyrillic.
- Container `max-w-[1200px] px-6`; sections `py-24` (~96px) on desktop.
- Interactive targets `min-h-11` (44px). No gradients, no emoji, no left color stripes.
- Unknown values stay as `[PLACEHOLDER]` strings in content.ts.

## Review Focus

1. Photo path set but file missing → placeholder, not a broken image (Task 2 test).
2. 375px viewport → no horizontal scroll, nav wraps (Task 6 browser check).
3. Long placeholder strings (`[ИМЯ ФАМИЛИЯ]`) → initials still computed, layout not broken (Task 2 test).
4. Invalid `siteUrl` placeholder → build does not crash on `new URL` (Task 1 test).
5. Removing a section from the array → nav link to it is the only thing to adjust (Task 3 test checks nav ↔ ids).

---

### Task 1: Scaffold, tokens, fonts, safe URL helper

**Files:** `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `vitest.config.ts`,
`vitest.setup.ts`, `.gitignore`, `next-env.d.ts`, `src/app/globals.css`, `src/app/fonts.ts`,
`src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/url.ts`, test `src/lib/url.test.ts`

**Produces:** `toUrl(value: string): URL | undefined`; Tailwind utilities `bg-canvas bg-surface text-ink text-muted border-line bg-accent text-accent text-passed text-on-dark text-on-dark-muted border-line-dark bg-placeholder font-display font-sans font-mono`.

- [ ] Test: `toUrl("https://example.com")?.origin === "https://example.com"`; `toUrl("[https://домен]") === undefined`; `toUrl("") === undefined`.
- [ ] Run `npx vitest run src/lib/url.test.ts` → FAIL (module missing).
- [ ] Implement with `try { new URL(value) } catch`.
- [ ] Run → PASS. `npm run build` → `out/index.html` exists.
- [ ] Commit.

### Task 2: Helpers — initials, photo resolution, CSS var reader, favicon SVG

**Files:** `src/lib/initials.ts`, `src/lib/photo.ts`, `src/lib/css.ts`, `src/lib/favicon.ts` + tests.

**Produces:**
- `getInitials(name: string): string` — strips `[]`, first letter of first two words, uppercased.
- `resolvePhoto(photo: string | null, publicDir?: string): string | null` — null if photo null or file missing under `public/`.
- `readCssVar(css: string, name: string): string | null`.
- `buildFaviconSvg(initials: string, color: string): string`.

- [ ] Tests: `getInitials("Валентин Волков") === "ВВ"`, `getInitials("[ИМЯ ФАМИЛИЯ]") === "ИФ"`, `getInitials("Анна") === "А"`;
  `resolvePhoto(null) === null`, `resolvePhoto("/team/missing.jpg", tmp) === null`, existing tmp file → same path;
  `readCssVar(":root{--accent: #2B50FF;}", "--accent") === "#2B50FF"`, missing → null;
  favicon contains `fill="#2B50FF"` and `>ВВ<`, starts with `<svg`.
- [ ] Run → FAIL; implement; run → PASS; commit.

### Task 3: Content model

**Files:** `src/content.ts`, test `src/content.test.ts`

**Produces:** `export const content: SiteContent` and exported types (`LinkItem`, `TeamMember`, `ReportStep`, …)
with keys `meta, brand, ui, header, hero, audience, process, pricing, team, referral, faq, cta, footer`.
Sections with anchors carry `id`.

- [ ] Tests: report has 6 steps, 5 passed, last not passed; process has 6 steps; audience 3 items; FAQ 4 items;
  team 2 members; every `header.nav[].href` and `header.cta.href` resolves to an `id` present in content.
- [ ] Run → FAIL; write content; run → PASS; commit.

### Task 4: UI primitives

**Files:** `src/components/ui/{Container,ButtonLink,Icon,SectionHeading,Avatar,ReportCard}.tsx`, tests for Avatar and ReportCard.

**Produces:** `Avatar({ src, alt, initials })`, `ReportCard({ report })`, `ButtonLink({ href, variant: "primary"|"outline"|"light", children, icon? })`,
`Icon({ name, className })`, `Container`, `SectionHeading({ title, eyebrow?, tone? })`.

- [ ] Tests: Avatar with `src=null` renders initials and no `img`; with src renders `img` with given alt.
  ReportCard renders `5 / 6 passed` text and progressbar with `aria-valuenow=5 aria-valuemax=6`.
- [ ] Run → FAIL; implement; run → PASS; commit.

### Task 5: Sections + page

**Files:** `src/components/sections/{Header,Hero,Audience,Process,Pricing,Team,Referral,Faq,Cta,Footer}.tsx`, `src/app/page.tsx`,
tests `src/app/page.test.tsx`, `src/components/no-hardcoded-text.test.ts`.

- [ ] Tests: page renders h1 = `content.hero.title`; 4 `<details>` in FAQ; Telegram link href = `content.cta.button.href`;
  every section id from content exists in DOM; no Cyrillic in any `src/components/**/*.tsx`.
- [ ] Run → FAIL; implement; run → PASS; commit.

### Task 6: Favicon route, metadata, docs, verification

**Files:** `src/app/favicon.svg/route.ts`, `src/app/layout.tsx` (metadata), `public/team/README.txt`, `README.md`.

- [ ] `npm run build` → exit 0; `out/favicon.svg` exists; `out/index.html` has `og:title`.
- [ ] Browser check at 375px and 1280px: `scrollWidth <= innerWidth`, screenshots reviewed.
- [ ] Commit.
