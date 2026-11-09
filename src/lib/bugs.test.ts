import { describe, expect, it } from "vitest";
import { BUG, isInLens, isOffscreen, spawnBug, stepBug, type Bug } from "./bugs";

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
