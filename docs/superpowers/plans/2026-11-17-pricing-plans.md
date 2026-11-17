# Pricing Plans Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single postpayment card with two plan cards (manual / automation) that swipe sideways on phones and sit side by side from 768px.

**Architecture:** Plans are a typed array in `content.ts`; `Pricing.tsx` renders the section heading on top and a row of paper cards below. The row is a CSS scroll-snap strip below `md` and a two-column grid from `md`. No JS, no new dependencies.

**Tech Stack:** existing (Next 16 static export, React 19, Tailwind v4, Vitest + Testing Library).

**Spec:** `docs/superpowers/specs/2026-11-17-pricing-plans-design.md`

## Global Constraints

- Copy uses the short dash `–`, never `—` (test in `content.test.ts`).
- Prices: manual `2 000 ₽`, automation `2 500 ₽`; share `99% от оффера` for both; prepayment label `предоплата`.
- Results: `Middle QA Manual Engineer` / `120 000 – 200 000 ₽`; `Automation QA Engineer / SDET` / `170 000 – 300 000 ₽`.
- CTA label `Начать обучение`, href = `content.cta.button.href` (Telegram), opens in a new tab.
- No installment, no crossed-out prices, no gift badges.
- Number groups use NBSP inside prices (`2 000 ₽`) so a price never wraps.
- Buttons ≥44px; no horizontal page scroll at 360/375/768/1280 (only the strip scrolls); both themes readable.

## Review Focus

1. 360px phone: long feature or result text wraps inside the ~85% card; page itself has no horizontal scroll → Playwright check in Task 2.
2. Swipe on a touch device: `body` has `pointer-events:none`, the Panel re-enables it → the strip must still scroll (Playwright: `scrollLeft` changes after `scrollBy`).
3. Tab to the second card's button on a phone → browser scrolls it into view (native; checked in Playwright with focus).
4. Scroll reveal: a card clipped horizontally never intersects → reveal goes on the strip, not on each card (Task 2 test: cards have no `data-reveal`).
5. Light theme: paper card on white page stays distinguishable (border) → screenshot check in Task 2.

---

### Task 1: Plan data and FAQ copy

**Files:**
- Modify: `src/content.ts` (types near `PriceCard`, `SiteContent.pricing`, `pricing` value, FAQ answers 1–2)
- Test: `src/content.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type PricePlan = {
    id: string; title: string; audience: string;
    price: string; share: string; features: string[];
    result: { position: string; salary: string };
    cta: LinkItem;
  };
  pricing: { id; title; lead; labels: { prepayment: string; result: string; offerPrefix: string }; plans: PricePlan[] }
  ```
  `PriceCard` and `pricing.postpayment` are removed.

- [ ] **Step 1: Failing tests** in `content.test.ts` (replace the postpayment test):
  - `"every plan's button leads to the same Telegram as the CTA"`: each `plan.cta.href === content.cta.button.href`, labels non-empty.
  - `"plans are manual and automation with the agreed prices"`: `plans.map(p => [p.id, p.price])` equals `[["manual","2 000 ₽"],["auto","2 500 ₽"]]`; every `share === "99% от оффера"`.
  - `"automation plan has everything from manual plus live coding"`: auto features ⊇ manual features and include `"Лайвкодинг"`.
  - `"plan ids are unique"`.
  - `"FAQ: no offer means no postpayment"`: answer to `"Что будет, если я не получу оффер?"` is `"Тогда постоплату не платишь."`.
- [ ] **Step 2:** `npx vitest run src/content.test.ts` → FAIL (`plans` undefined).
- [ ] **Step 3:** Implement types and values. Copy (verbatim):
  - manual: title `Ручное тестирование с нуля`, audience `Старт в IT для новичков. Выйдешь на уровень Middle QA Manual.`
  - auto: title `Автотестирование`, audience `Для тех, кто уже тестирует руками и хочет перейти в автоматизацию.`
  - manual features: `Личный план обучения`, `Учебные материалы`, `Личные созвоны`, `Подготовка резюме`, `Мок-собеседования`, `Сопровождение до оффера`; auto = same + `Лайвкодинг`.
  - labels: prepayment `предоплата`, result `Результат`, offerPrefix `Оффер на позицию`.
  - FAQ 1: `…ты оплачиваешь обучение.` → `…вносишь основную оплату.`; FAQ 2 answer → `Тогда постоплату не платишь.`
- [ ] **Step 4:** `npx vitest run src/content.test.ts` → PASS. (`tsc` will fail in `Pricing.tsx` / `page.test.tsx` until Task 2 — commit together with Task 2 if preferred.)

### Task 2: Plan cards in the Pricing section

**Files:**
- Modify: `src/components/sections/Pricing.tsx`, `src/app/page.test.tsx:209-218`, `src/app/globals.css` (hidden scrollbar utility if needed)

**Interfaces:**
- Consumes: `content.pricing.labels`, `content.pricing.plans` (Task 1).

- [ ] **Step 1: Failing test** `"renders a card per plan with price, result and a Telegram button"` in `page.test.tsx` (replaces the postpayment test, keeps the referral assertion): for each plan, within the pricing section there is an `article` named by its title heading containing `plan.price`, `plan.share` text, every feature, `plan.result.position`, `plan.result.salary`, and a link named `plan.cta.label` with `href` = `plan.cta.href`, `target="_blank"`; the strip element `[data-plans]` has `data-reveal` and no card inside it has `data-reveal`.
- [ ] **Step 2:** `npx vitest run src/app/page.test.tsx` → FAIL.
- [ ] **Step 3:** Implement. Layout: `Panel strong` → `SectionHeading` → strip `ul[data-plans]` with `{...revealProps(1)}`:
  below md `flex snap-x snap-mandatory overflow-x-auto` with negative side margin equal to Panel padding (cards scroll to the panel edge) and matching scroll padding; cards `w-[85%] shrink-0 snap-start`; from md `grid grid-cols-2 overflow-visible` with zero margin.
  Card `article`: `bg-paper text-paper-ink rounded-2xl`, flex column, `h3` title, audience, price (`font-display text-accent`) + `{labels.prepayment} + {share}`, features with `Icon name="check"`, result box (thin accent border) with label, `offerPrefix` + position, salary, `ButtonLink` at `mt-auto`, full width.
- [ ] **Step 4:** `npm test` and `npx tsc --noEmit` → all pass.
- [ ] **Step 5:** `npm run build`; serve `out/` and run Playwright (360, 768, 1280; light + dark): no page h-scroll, strip scrolls at 360 and not at 768+, both cards visible at 768+, focused second button visible at 360, screenshots look right.
- [ ] **Step 6: Commit** content + component + tests + spec + plan.

### Task 3: Review and PR
- [ ] Code review (superpowers:requesting-code-review), fix findings, re-run `npm test` + build, privacy grep of the staged diff, push `feat/pricing-plans`, open PR.
