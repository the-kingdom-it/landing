# Black Friday Promo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A switchable promo on the plan cards: badge, crossed-out old price, deadline line.

**Architecture:** `content.pricing.promo` (or `null`) plus `oldPrice` per plan; `PlanCard` renders the extras only when both are set. No runtime date logic.

**Tech Stack:** existing (Next 16 static export, React 19, Tailwind v4, Vitest).

**Spec:** `docs/superpowers/specs/2026-11-17-black-friday-design.md`

## Global Constraints
- Old prices `4\u00a0000\u00a0₽` (manual) and `5\u00a0000\u00a0₽` (auto); escapes in source, never literal invisible characters.
- Promo copy: label `BLACK FRIDAY −50%`, note `Цена действует до 31\u00a0декабря`, screen-reader label `Старая цена`.
- No automatic expiry.
- No overflow inside cards at 320–1280px, both themes.

## Review Focus
1. Prices change later → badge percent lies → content test recomputes the percent from prices.
2. `promo: null` → cards identical to today (no badge, no `<s>`, no note) → page test with promo switched off.
3. Screen reader hears the old price as old → `<s>` contains a sr-only `Старая цена` prefix → page test.
4. 320px card: badge and old price fit → Playwright overflow check.
5. A plan without `oldPrice` while promo is on → no badge on that card → covered by the render condition and test 2's helper.

---

### Task 1: Promo data
**Files:** `src/content.ts`, `src/content.test.ts`
**Produces:** `type PricePromo = { label: string; note: string | null; oldPriceLabel: string }`, `pricing.promo: PricePromo | null`, `PricePlan.oldPrice: string | null`.
- [ ] Failing tests: `"BLACK FRIDAY: plans show crossed-out 4 000 and 5 000"` (id→oldPrice pairs); `"promo badge percent matches every discounted plan's prices"` (digits of price/oldPrice → `Math.round((1 - price / old) * 100)` → label contains `−${pct}%`); `"promo is on with a BLACK FRIDAY badge"`.
- [ ] Implement, run `npx vitest run src/content.test.ts` → PASS.

### Task 2: Promo on the cards
**Files:** `src/components/sections/Pricing.tsx`, `src/app/page.test.tsx`, `README.md`
- [ ] Failing tests: `"discounted plans show the promo badge, the crossed-out old price and the deadline"` (per card: label text, `s` element text = `${oldPriceLabel} ${oldPrice}` with the label in `.sr-only`, note text); `"with the promo switched off the cards show no badge, old price or deadline"` (set `content.pricing.promo = null` in try/finally, render, assert none of the three and no `s`).
- [ ] Implement in `PlanCard`: badge pill (accent background) above the title; old price `<s>` right-aligned above the big price; note under the prepayment line.
- [ ] `npm test`, `npx tsc --noEmit`, `npm run build`, Playwright 320/360/768/1280 both themes: no overflow, screenshots. README row for the promo. Commit.

### Task 3: Review and PR
- [ ] Code review, fixes, privacy grep, push, PR.
