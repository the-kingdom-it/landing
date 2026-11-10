import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { buildMetadata } from "./metadata";

const base = { ...content.meta, siteUrl: "https://mentor.example.ru", ogImage: "/og.png" };

describe("buildMetadata", () => {
  it("takes title and description from content", () => {
    const meta = buildMetadata(content.meta);
    expect(meta.title).toBe(content.meta.title);
    expect(meta.description).toBe(content.meta.description);
  });

  it("fills Open Graph from content", () => {
    const og = buildMetadata(content.meta).openGraph as Record<string, unknown>;
    expect(og.title).toBe(content.meta.title);
    expect(og.description).toBe(content.meta.description);
    expect(og.siteName).toBe(content.meta.siteName);
    expect(og.locale).toBe(content.meta.locale);
    expect(og.type).toBe("website");
  });

  it("skips metadataBase, og:url and images while siteUrl is a placeholder", () => {
    const meta = buildMetadata({ ...content.meta, siteUrl: "[https://ваш-домен.ru]", ogImage: "/og.png" });
    const og = meta.openGraph as Record<string, unknown>;
    expect(meta.metadataBase).toBeUndefined();
    expect(og.url).toBeUndefined();
    expect(og.images).toBeUndefined();
  });

  it("sets metadataBase, og:url and og:image when siteUrl is real", () => {
    const meta = buildMetadata(base);
    const og = meta.openGraph as Record<string, unknown>;
    expect(String(meta.metadataBase)).toBe("https://mentor.example.ru/");
    expect(og.url).toBe("/");
    expect(og.images).toEqual([{ url: "/og.png", width: 1200, height: 630 }]);
  });

  it("points the icon to the generated favicon.svg", () => {
    expect(buildMetadata(content.meta).icons).toEqual({ icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] });
  });

  it("adds the base path to the favicon for a site served from a subfolder", () => {
    expect(buildMetadata(content.meta, "/landing").icons).toEqual({
      icon: [{ url: "/landing/favicon.svg", type: "image/svg+xml" }],
    });
  });
});
