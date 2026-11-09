export const SEASONS = ["winter", "spring", "summer", "autumn"] as const;
export type Season = (typeof SEASONS)[number];
/** "auto" — сезон по текущему месяцу. */
export type SeasonSetting = Season | "auto";

/** Месяц с нуля (0 — январь): дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень. */
export function seasonForMonth(month0: number): Season {
  return SEASONS[Math.floor(((month0 + 1) % 12) / 3)];
}

function isSeason(value: string | null | undefined): value is Season {
  return SEASONS.includes(value as Season);
}

/** Сезон с учётом настройки и необязательного ?season= из адреса (для проверки). */
export function resolveSeason(setting: SeasonSetting, date: Date, override?: string | null): Season {
  if (isSeason(override)) return override;
  return setting === "auto" ? seasonForMonth(date.getMonth()) : setting;
}

/**
 * Скрипт для <head>: ставит <html data-season> до первой отрисовки,
 * чтобы сразу грузилась картинка нужного сезона.
 */
export function buildSeasonScript(setting: SeasonSetting): string {
  const seasons = JSON.stringify(SEASONS);
  const fixed = JSON.stringify(setting);
  return `(function(){try{var s=${seasons},f=${fixed},q=new URLSearchParams(location.search).get("season"),v=s.indexOf(q)>=0?q:f==="auto"?s[Math.floor(((new Date().getMonth()+1)%12)/3)]:f;document.documentElement.dataset.season=v}catch(e){}})()`;
}
