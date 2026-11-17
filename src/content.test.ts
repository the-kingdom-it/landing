import { describe, expect, it } from "vitest";
import { content } from "./content";
import { ART_NAMES } from "./lib/art";
import { SEASONS } from "./lib/season";

/*
 * Тесты проверяют структуру контента, а не количество пунктов:
 * добавить вопрос в FAQ или шаг в план можно без правки тестов.
 */

function sectionIds(): string[] {
  return Object.values(content as Record<string, unknown>)
    .filter((value): value is { id: string } => typeof value === "object" && value !== null && "id" in value)
    .map((value) => value.id);
}

describe("content", () => {
  it("hero report has passed steps and ends with the pending step", () => {
    const steps = content.hero.report.steps;
    expect(steps.some((step) => step.passed)).toBe(true);
    expect(steps[steps.length - 1].passed).toBe(false);
  });

  it("lists are not empty", () => {
    expect(content.audience.items.length).toBeGreaterThan(0);
    expect(content.team.members.length).toBeGreaterThan(0);
    expect(content.faq.items.length).toBeGreaterThan(0);
    expect(content.header.nav.length).toBeGreaterThan(0);
  });

  it("every in-page link in content points to a section id from content", () => {
    const ids = sectionIds();
    const links = [
      ...content.header.nav,
      content.header.cta,
      content.hero.primaryCta,
      content.hero.secondaryCta,
      content.referral.cta,
    ];
    for (const { href } of links.filter((link) => link.href.startsWith("#"))) {
      expect(ids).toContain(href.slice(1));
    }
  });

  it("section ids are unique", () => {
    const ids = sectionIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("team photo is null, a path from public/ or an absolute URL, and always has alt text", () => {
    for (const member of content.team.members) {
      if (member.photo !== null) expect(member.photo).toMatch(/^(\/|https?:\/\/)/);
      expect(member.photoAlt.trim().length).toBeGreaterThan(0);
    }
  });

  it("telegram button links to t.me", () => {
    expect(content.cta.button.href.startsWith("https://t.me/")).toBe(true);
  });

  it("telegram handle under the button matches the link", () => {
    const nick = content.cta.button.href.replace("https://t.me/", "");
    expect(content.cta.handle).toBe(`@${nick}`);
  });

  it("every plan's button leads to the same Telegram as the CTA", () => {
    expect(content.pricing.plans.length).toBeGreaterThan(0);
    for (const plan of content.pricing.plans) {
      expect(plan.cta.href).toBe(content.cta.button.href);
      expect(plan.cta.label.trim().length).toBeGreaterThan(0);
    }
  });

  it("plans are manual and automation with the agreed prices", () => {
    expect(content.pricing.plans.map((plan) => [plan.id, plan.price])).toEqual([
      ["manual", "2 000 ₽"],
      ["auto", "2 500 ₽"],
    ]);
    for (const plan of content.pricing.plans) expect(plan.share).toBe("99% от оффера");
  });

  it("automation plan has everything from manual plus live coding", () => {
    const [manual, auto] = content.pricing.plans;
    for (const feature of manual.features) expect(auto.features).toContain(feature);
    expect(auto.features).toContain("Лайвкодинг");
  });

  it("plan titles never leave a one-letter word hanging at a line end", () => {
    for (const plan of content.pricing.plans) expect(plan.title).not.toMatch(/(^|\s)[а-яё] /i);
  });

  it("plan ids are unique", () => {
    const ids = content.pricing.plans.map((plan) => plan.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("FAQ: no offer means no postpayment", () => {
    const item = content.faq.items.find((faq) => faq.question === "Что будет, если я не получу оффер?");
    expect(item?.answer).toBe("Тогда постоплату не платишь.");
  });

  it("every roadmap track has two AI chapters: tools and applying them", () => {
    expect(content.roadmap.tracks.length).toBeGreaterThan(1);
    for (const track of content.roadmap.tracks) {
      expect(track.stages.length).toBeGreaterThan(0);
      expect(track.stages.filter((stage) => stage.ai)).toHaveLength(2);
    }
  });

  it("roadmap track ids are unique", () => {
    const ids = content.roadmap.tracks.map((track) => track.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("scene season is a known season or auto", () => {
    expect([...SEASONS, "auto"]).toContain(content.scene.season);
  });

  it("default theme follows the visitor's system", () => {
    expect(content.scene.theme).toBe("system");
  });

  it("hero title is circled by hand (style 9) by default", () => {
    expect(content.hero.titleStyle).toBe("9");
  });

  it("CTA highlights the word «бесплатного»", () => {
    expect(content.cta.titleHighlights).toEqual(["бесплатного"]);
  });

  it("every roadmap stage has a known picture", () => {
    for (const track of content.roadmap.tracks) {
      for (const stage of track.stages) expect(ART_NAMES).toContain(stage.art);
    }
  });

  it("site texts use the short dash instead of the em dash", () => {
    expect(JSON.stringify(content)).not.toContain("\u2014");
  });
});
