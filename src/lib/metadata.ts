import type { Metadata } from "next";
import type { SiteContent } from "@/content";
import { BASE_PATH, withBasePath } from "./base-path";
import { toUrl } from "./url";

/** Meta title/description, Open Graph и favicon из content.meta. */
export function buildMetadata(meta: SiteContent["meta"], basePath: string = BASE_PATH): Metadata {
  const base = toUrl(meta.siteUrl);
  // Соцсетям нужен абсолютный адрес картинки — без настоящего домена её не отдаём
  const images = base && meta.ogImage ? [{ url: meta.ogImage, width: 1200, height: 630 }] : undefined;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: base,
    alternates: base ? { canonical: "/" } : undefined,
    openGraph: {
      type: "website",
      locale: meta.locale,
      siteName: meta.siteName,
      title: meta.title,
      description: meta.description,
      url: base ? "/" : undefined,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: meta.title,
      description: meta.description,
    },
    // Next.js не добавляет базовый путь к иконкам из метаданных — добавляем сами
    icons: { icon: [{ url: withBasePath("/favicon.svg", basePath), type: "image/svg+xml" }] },
  };
}
