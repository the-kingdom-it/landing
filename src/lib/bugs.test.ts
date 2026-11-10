import { describe, expect, it } from "vitest";
import { BUG, isInLens, isOffscreen, makePromoCode, scatterBug, spawnBug, stepBug, type Bug } from "./bugs";

const view = { width: 1000, height: 800 };
const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};
const still = () => 0.5; // без случайных поворотов
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);
const bugAt = (over: Partial<Bug>): Bug => ({ id: 1, x: 500, y: 400, angle: 0, turn: 0, speed: 60, baseSpeed: 60, dwell: 0, ...over });

describe("spawnBug", () => {
  it.each([
    [0, "top"],
    [0.3, "right"],
    [0.6, "bottom"],
    [0.9, "left"],
  ])("starts just outside the %s edge and crawls inward", (edgeRoll) => {
    const bug = spawnBug(1, view, sequence(edgeRoll, 0.5, 0.5, 0.5, 0.5));
    const outside = bug.y < 0 || bug.x > view.width || bug.y > view.height || bug.x < 0;
    expect(outside).toBe(true);
    const center = { x: view.width / 2, y: view.height / 2 };
    const next = stepBug(bug, 500, view, null, still);
    expect(dist(next, center)).toBeLessThan(dist(bug, center));
  });

  it("gives the bug a speed within limits", () => {
    const bug = spawnBug(1, view, sequence(0, 0.5, 0.5, 0.5, 1));
    expect(bug.baseSpeed).toBeGreaterThanOrEqual(BUG.minSpeed);
    expect(bug.baseSpeed).toBeLessThanOrEqual(BUG.maxSpeed);
  });
});

describe("stepBug", () => {
  it("moves along its heading by speed × time", () => {
    const next = stepBug(bugAt({ angle: 0 }), 16, view, null, still);
    expect(next.x).toBeCloseTo(500 + 60 * 0.016, 5);
    expect(next.y).toBeCloseTo(400, 5);
  });

  it("caps a long frame so a bug does not teleport after the tab was in background", () => {
    const next = stepBug(bugAt({ angle: 0 }), 5000, view, null, still);
    expect(next.x - 500).toBeLessThanOrEqual(60 * (BUG.maxFrameMs / 1000) + 1e-9);
  });

  it("speeds up and turns away when the lens comes close", () => {
    const cursor = { x: 530, y: 400 };
    let bug = bugAt({ angle: 0 });
    const before = dist(bug, cursor);
    for (let i = 0; i < 60; i++) bug = stepBug(bug, 16, view, cursor, still);
    expect(dist(bug, cursor)).toBeGreaterThan(before);
    expect(bug.speed).toBeGreaterThan(bug.baseSpeed);
  });
});

describe("isOffscreen", () => {
  it("is false on screen and true well beyond an edge", () => {
    expect(isOffscreen(bugAt({}), view)).toBe(false);
    expect(isOffscreen(bugAt({ x: -BUG.margin - 1 }), view)).toBe(true);
    expect(isOffscreen(bugAt({ y: view.height + BUG.margin + 1 }), view)).toBe(true);
  });
});

describe("isInLens", () => {
  it("detects a bug inside the lens ring", () => {
    expect(isInLens(bugAt({}), { x: 505, y: 404 })).toBe(true);
    expect(isInLens(bugAt({}), { x: 560, y: 400 })).toBe(false);
    expect(isInLens(bugAt({}), null)).toBe(false);
  });
});

describe("makePromoCode", () => {
  it("is a six-digit number without a leading zero", () => {
    for (let i = 0; i < 50; i++) expect(makePromoCode()).toMatch(/^[1-9]\d{5}$/);
  });

  it("is driven by the random source", () => {
    expect(makePromoCode(() => 0)).toBe("100000");
    expect(makePromoCode(() => 0.999999)).toBe("999999");
  });
});

describe("scatterBug", () => {
  it("sends the bug fast toward the nearest edge, away from the center", () => {
    const left = scatterBug(bugAt({ x: 200, y: 400, angle: 0 }), view);
    expect(Math.cos(left.angle)).toBeLessThan(-0.9);
    expect(left.speed).toBe(BUG.scatterSpeed);
    const bottom = scatterBug(bugAt({ x: 500, y: 700, angle: -Math.PI / 2 }), view);
    expect(Math.sin(bottom.angle)).toBeGreaterThan(0.9);
  });

  it("leaves the screen without turning back", () => {
    let bug = scatterBug(bugAt({ x: 300, y: 300 }), view);
    for (let i = 0; i < 200 && !isOffscreen(bug, view); i++) bug = stepBug(bug, 16, view, null, () => 0.5);
    expect(isOffscreen(bug, view)).toBe(true);
  });
});

describe("stepBug with obstacles", () => {
  const panel = { left: 560, top: 300, right: 900, bottom: 500 };
  const inside = (b: { x: number; y: number }) => b.x > panel.left && b.x < panel.right && b.y > panel.top && b.y < panel.bottom;

  it("turns away from a panel ahead instead of crawling under it", () => {
    let bug = bugAt({ x: 420, y: 400, angle: 0 });
    for (let i = 0; i < 300; i++) {
      bug = stepBug(bug, 16, view, null, () => 0.5, [panel]);
      expect(inside(bug)).toBe(false);
    }
  });

  it("walks out of a panel it already happens to be under", () => {
    let bug = bugAt({ x: 700, y: 400, angle: 0 });
    for (let i = 0; i < 400 && inside(bug); i++) bug = stepBug(bug, 16, view, null, () => 0.5, [panel]);
    expect(inside(bug)).toBe(false);
  });

  it("moves as before when there are no obstacles", () => {
    const a = stepBug(bugAt({ angle: 0 }), 16, view, null, () => 0.5);
    const b = stepBug(bugAt({ angle: 0 }), 16, view, null, () => 0.5, []);
    expect(b).toEqual(a);
  });
});
