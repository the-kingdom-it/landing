import type { NextConfig } from "next";

// Подпапка сайта на GitHub Pages (например, /landing). Пусто — сайт в корне домена.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // Статический экспорт: `npm run build` кладёт готовый сайт в папку out/
  output: "export",
  basePath,
  // Оптимизация картинок требует сервера, при static export она выключена
  images: { unoptimized: true },
  // Скрыть плавающую кнопку Next.js в режиме npm run dev (на собранный сайт она и так не попадает)
  devIndicators: false,
};

export default nextConfig;
