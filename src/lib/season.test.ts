import { afterEach, describe, expect, it } from "vitest";
import { buildSeasonScript, resolveSeason, seasonForMonth } from "./season";

describe("seasonForMonth", () => {
  it.each([
    [11, "winter"], [0, "winter"], [1, "winter"],
    [2, "spring"], [3, "spring"], [4, "spring"],
    [5, "summer"], [6, "summer"], [7, "summer"],
    [8, "autumn"], [9, "autumn"], [10, "autumn"],
  ])("month %i is %s", (month, season) => {
    expect(seasonForMonth(month)).toBe(season);
  });
});

describe("resolveSeason", () => {
  const november = new Date(2026, 10, 9);

  it("uses the fixed season from settings regardless of the date", () => {
    expect(resolveSeason("winter", november)).toBe("winter");
  });

  it("picks the season by date in auto mode", () => {
    expect(resolveSeason("auto", november)).toBe("autumn");
  });

  it("lets a valid override win", () => {
    expect(resolveSeason("winter", november, "summer")).toBe("summer");
  });

  it("ignores an invalid override", () => {
    expect(resolveSeason("winter", november, "monsoon")).toBe("winter");
  });
});

describe("buildSeasonScript", () => {
  afterEach(() => {
    delete document.documentElement.dataset.season;
    window.history.replaceState(null, "", "/");
  });

  function run(script: string) {
    new Function(script)();
    return document.documentElement.dataset.season;
  }

  it("sets the fixed season on <html>", () => {
    expect(run(buildSeasonScript("winter"))).toBe("winter");
  });

  it("sets a season by the current month in auto mode", () => {
    expect(run(buildSeasonScript("auto"))).toBe(seasonForMonth(new Date().getMonth()));
  });

  it("respects ?season= in the address", () => {
    window.history.replaceState(null, "", "/?season=spring");
    expect(run(buildSeasonScript("winter"))).toBe("spring");
  });

  it("ignores an unknown ?season= value", () => {
    window.history.replaceState(null, "", "/?season=lava");
    expect(run(buildSeasonScript("winter"))).toBe("winter");
  });
});
