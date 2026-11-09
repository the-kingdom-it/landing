import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Проверяет фото при сборке.
 * null или файла нет в public/ → null (компонент покажет плейсхолдер вместо битой картинки).
 * Внешний URL (https://…) возвращается как есть.
 */
export function resolvePhoto(
  photo: string | null,
  publicDir: string = join(process.cwd(), "public"),
): string | null {
  if (!photo) return null;
  if (/^https?:\/\//.test(photo)) return photo;
  return existsSync(join(publicDir, photo)) ? photo : null;
}
