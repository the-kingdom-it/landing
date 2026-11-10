/**
 * Базовый путь сайта. Пусто — сайт в корне домена (свой домен, VPS).
 * На GitHub Pages без своего домена сайт живёт в подпапке, например /landing:
 * его передаёт сборке переменная NEXT_PUBLIC_BASE_PATH (см. .github/workflows/deploy.yml).
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Добавляет базовый путь к пути внутри сайта: "/team/a.jpg" → "/landing/team/a.jpg". */
export function withBasePath(path: string, base: string = BASE_PATH): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${base.replace(/\/+$/, "")}${path}`;
}
