/**
 * Безопасно превращает строку в URL.
 * Плейсхолдер вроде "[https://ваш-домен.ru]" — не URL, тогда возвращаем undefined,
 * чтобы сборка не падала, пока домен не указан.
 */
export function toUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}
