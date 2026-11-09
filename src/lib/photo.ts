import { existsSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";

/**
 * Проверяет фото при сборке.
 * null или файла нет в public/ → null (компонент покажет плейсхолдер вместо битой картинки).
 * Имя сверяется с учётом регистра: macOS считает valentin.JPG и valentin.jpg одним файлом,
 * а nginx на Linux — нет, и на проде была бы битая картинка.
 * Внешний URL (https://…) возвращается как есть.
 */
export function resolvePhoto(
  photo: string | null,
  publicDir: string = join(process.cwd(), "public"),
): string | null {
  if (!photo) return null;
  if (/^https?:\/\//.test(photo)) return photo;
  const file = join(publicDir, photo);
  const dir = dirname(file);
  if (!existsSync(dir)) return null;
  return readdirSync(dir).includes(basename(file)) ? photo : null;
}
