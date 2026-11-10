/**
 * Фоны страницы. "kingdom" — картинки королевства по сезонам, цифры — минималистичные фоны
 * из public/backgrounds/<номер>.webp. Временный режим для выбора фона.
 */
export const BACKGROUNDS = ["kingdom", "1", "2", "3", "4", "5", "6", "7"] as const;
export type BackgroundId = (typeof BACKGROUNDS)[number];

function isBackground(value: string | null | undefined): value is BackgroundId {
  return BACKGROUNDS.includes(value as BackgroundId);
}

/** Фон с учётом настройки и необязательного ?bg= из адреса. Неизвестное значение — королевство. */
export function resolveBackground(setting: string | undefined, override?: string | null): BackgroundId {
  if (isBackground(override)) return override;
  return isBackground(setting) ? setting : "kingdom";
}

/** Скрипт для <head>: ставит <html data-bg> до первой отрисовки (?bg=3 в адресе переключает фон). */
export function buildBackgroundScript(defaultBg: BackgroundId): string {
  const ids = JSON.stringify(BACKGROUNDS);
  return `(function(){try{var b=${ids},q=new URLSearchParams(location.search).get("bg");document.documentElement.dataset.bg=b.indexOf(q)>=0?q:${JSON.stringify(defaultBg)}}catch(e){}})()`;
}
