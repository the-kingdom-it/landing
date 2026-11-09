import { describe, expect, it } from "vitest";
import { makeParticles, particleCount } from "./particles";

describe("particleCount", () => {
  it("gives winter the most particles and halves them on phones", () => {
    expect(particleCount("winter", false)).toBe(64);
    expect(particleCount("winter", true)).toBe(28);
  });

  it("has fewer particles in other seasons", () => {
    for (const season of ["spring", "summer", "autumn"] as const) {
      expect(particleCount(season, false)).toBeLessThan(particleCount("winter", false));
      expect(particleCount(season, true)).toBeLessThan(particleCount(season, false));
    }
  });
});

describe("makeParticles", () => {
  const rand = () => 0.5;

  it("creates the requested number of particles", () => {
    expect(makeParticles("winter", 7, rand)).toHaveLength(7);
  });

  it("places particles across the screen width with a negative delay so they are mid-air on load", () => {
    const [flake] = makeParticles("winter", 1, rand);
    expect(flake["--x"]).toBe("50%");
    expect(parseFloat(flake["--delay"])).toBeLessThan(0);
  });

  it("gives leaves a color and a spin", () => {
    const [leaf] = makeParticles("autumn", 1, rand);
    expect(leaf["--color"]).toMatch(/^#/);
    expect(leaf["--spin"]).toMatch(/s$/);
  });

  it("keeps fireflies in the lower part of the screen", () => {
    const [low] = makeParticles("summer", 1, () => 0);
    expect(parseFloat(low["--y"])).toBeGreaterThanOrEqual(35);
  });
});
