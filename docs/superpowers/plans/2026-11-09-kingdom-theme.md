# Kingdom Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The landing lives inside the owner's kingdom scene: dark glass panels, seasonal particles, catchable bugs.

**Architecture:** Fixed background layers (`Scene`, `Particles`) sit at `-z-10` under non-positioned content; sections become glass panels; `Bugs` is a fixed `z-30` layer under the `z-40` header. Season comes from `content.scene.season` (`"auto"` = by month), applied to `<html data-season>` by an inline head script before paint. Pure logic (season, bug motion) lives in `src/lib/` and is unit-tested.

**Tech Stack:** existing (Next 16 static export, React 19, Tailwind v4, Vitest). No new dependencies. Images converted with ffmpeg to WebP.

**Spec:** `docs/superpowers/specs/2026-11-09-kingdom-theme-design.md`

## Global Constraints

- Landing copy unchanged, except: header brand `Kingdom IT`, new `bugs.hint` and `bugs.counterLabel`.
- Owner asked for **winter now**: `content.scene.season = "winter"`; `"auto"` must also work.
- Text contrast ≥ WCAG AA on glass; buttons ≥44px; no horizontal scroll at 360–1280px.
- `prefers-reduced-motion` or no JS → no particles, no bugs, no animations; scene and glass still render.
- Only the active season image is downloaded.

## Review Focus

1. Bright parts of the scene behind glass → text still readable (check worst case: snow/sky behind panels).
2. Bugs never block buttons for long and never sit above the header.
3. Phone: no custom cursor, tap catches, 2 bugs, fewer particles.
4. `?season=<invalid>` → falls back to configured season.
5. Tab in background → bug loop paused (no runaway dt jump on return).

---

### Task 1: Season config, head script, scene layer
**Files:** `src/lib/season.ts` (+test), `src/content.ts` (`scene`), `src/app/layout.tsx`, `src/components/theme/Scene.tsx`, `src/app/globals.css`, `public/scene/*.webp`
**Produces:** `type Season = "winter"|"spring"|"summer"|"autumn"`, `type SeasonSetting = Season | "auto"`,
`seasonForMonth(month0: number): Season`, `resolveSeason(setting, date, override?: string|null): Season`, `buildSeasonScript(setting): string`.
- [ ] Tests: months 11,0,1→winter; 2–4 spring; 5–7 summer; 8–10 autumn. Fixed setting wins over date; valid `override` wins; invalid override ignored. Script evaluated in jsdom sets `documentElement.dataset.season` (fixed, auto, `?season=` override).
- [ ] Implement; WebP: desktop full-size, mobile portrait centre crop; CSS picks `--scene-image` by `html[data-season]` and viewport.

### Task 2: Dark glass theme + Kingdom IT header + favicon
**Files:** `globals.css` tokens/utilities (`glass`, `glass-strong`), `ui/Panel.tsx`, all sections, `ButtonLink`, `ReportCard`, `Avatar`, `content.ts` (`brand`).
- [ ] Tests: header home link named `Kingdom IT`, no initials square in header; favicon uses `KI`.
- [ ] Restyle: sections in glass panels with scene gaps; accent text → gold; pricing card stays paper-light; Process grid hairlines via borders (translucent cells).

### Task 3: Seasonal particles
**Files:** `src/components/theme/Particles.tsx` (+test), `globals.css`.
**Produces:** `particleCount(season, isMobile): number`.
- [ ] Tests: winter → N snow particles after mount; reduced motion → none; season read from `<html data-season>`.
- [ ] Implement CSS animations (individual `translate`/`rotate` properties): snow, leaf, petal, firefly.

### Task 4: Bugs
**Files:** `src/lib/bugs.ts` (+test), `src/components/theme/Bugs.tsx` (+test), `BugSprite`, `globals.css` (lens cursor, catch animation), `content.ts` (`bugs`), `Hero.tsx` (hint).
**Produces:** `spawnBug(view, rand): Bug`, `stepBug(bug, dtMs, view, cursor|null, rand): Bug`, `isOffscreen(bug, view): boolean`, `isInLens(bug, cursor, radius): boolean`.
- [ ] Tests: spawn on an edge heading inward; step moves by speed×dt; near cursor bug speeds up and distance grows; lens hit test; click on a bug → counter chip shows `counterLabel: 1`; reduced motion → no bugs.
- [ ] Implement rAF loop with refs (no per-frame React renders), dwell 300 ms or click/tap to catch, respawn, pause on `visibilitychange`.

### Task 5: Verify, docs, PR
- [ ] `npm test`, `tsc`, `npm run build`; Playwright: winter image loaded, snow animating, bug caught by click, no h-scroll 360/375/768/1280, reduced motion clean, focus visible; README section; PR.
