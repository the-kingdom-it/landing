import { afterEach, describe, expect, it } from "vitest";
import { buildTitleScript, splitTitle, TITLE_STYLES } from "./title";

describe("splitTitle", () => {
  const title = "Доведём до оффера в QA и AQA";

  it("marks the highlighted words and keeps the text intact", () => {
    const parts = splitTitle(title, ["QA", "AQA"]);
    expect(parts.map((part) => (part.prefix ?? "") + part.text).join("")).toBe(title);
    expect(parts.filter((part) => part.mark).map((part) => part.text)).toEqual(["QA", "AQA"]);
  });

  it("keeps a preposition glued with a non-breaking space together with the marked word", () => {
    const parts = splitTitle("оффера в\u00a0QA и\u00a0AQA", ["QA", "AQA"]);
    expect(parts.filter((part) => part.mark)).toEqual([
      { text: "QA", mark: true, prefix: "в\u00a0" },
      { text: "AQA", mark: true, prefix: "и\u00a0" },
    ]);
    expect(parts.map((part) => (part.prefix ?? "") + part.text).join("")).toBe("оффера в\u00a0QA и\u00a0AQA");
  });

  it("does not mark a word inside a longer one", () => {
    expect(splitTitle("AQA", ["QA"])).toEqual([{ text: "AQA", mark: false }]);
  });

  it("returns the whole title when nothing is highlighted", () => {
    expect(splitTitle(title, [])).toEqual([{ text: title, mark: false }]);
  });
});

describe("title styles", () => {
  it("has a plain default and numbered variants", () => {
    expect(TITLE_STYLES[0].id).toBe("0");
    expect(TITLE_STYLES.length).toBeGreaterThanOrEqual(8);
  });
});

describe("buildTitleScript", () => {
  afterEach(() => {
    delete document.documentElement.dataset.title;
    window.history.replaceState(null, "", "/");
  });

  const run = (def: string) => {
    new Function(buildTitleScript(def))();
    return document.documentElement.dataset.title;
  };

  it("uses the default style", () => {
    expect(run("0")).toBe("0");
  });

  it("switches by ?title= and ignores unknown values", () => {
    window.history.replaceState(null, "", "/?title=3");
    expect(run("0")).toBe("3");
    window.history.replaceState(null, "", "/?title=zz");
    expect(run("0")).toBe("0");
  });
});
