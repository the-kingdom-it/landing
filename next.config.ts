import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статический экспорт: `npm run build` кладёт готовый сайт в папку out/
  output: "export",
  // Оптимизация картинок требует сервера, при static export она выключена
  images: { unoptimized: true },
};

export default nextConfig;
