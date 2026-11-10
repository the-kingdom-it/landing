/**
 * Фоны страницы. "kingdom" — картинки королевства по сезонам, цифры — минималистичные фоны
 * из public/backgrounds/<номер>.webp. У каждого фона своя тема: на светлых фонах — белый стиль
 * (светлое стекло, тёмный текст), на тёмных — тёмное стекло.
 */
export type Theme = "light" | "dark";
/** "auto" — тема по фону. */
export type ThemeSetting = Theme | "auto";

export const BACKGROUNDS = [
  { id: "kingdom", name: "Королевство (по сезонам)", theme: "dark" },
  { id: "1", name: "Бело-синяя абстракция", theme: "light" },
  { id: "2", name: "Полночь", theme: "dark" },
  { id: "3", name: "Аврора", theme: "dark" },
  { id: "4", name: "Королевское золото", theme: "dark" },
  { id: "5", name: "Сетка", theme: "dark" },
  { id: "6", name: "Сумерки", theme: "dark" },
  { id: "7", name: "Графит", theme: "dark" },
  { id: "8", name: "Лёд", theme: "light" },
  { id: "9", name: "Облака", theme: "light" },
  { id: "10", name: "Жемчуг", theme: "light" },
  { id: "11", name: "Утро", theme: "light" },
  { id: "12", name: "Бумага", theme: "light" },
  { id: "13", name: "Мята", theme: "light" },
  { id: "14", name: "Океан", theme: "dark" },
  { id: "15", name: "Неон", theme: "dark" },
  { id: "16", name: "Изумруд", theme: "dark" },
  { id: "17", name: "Космос", theme: "dark" },
] as const satisfies readonly { id: string; name: string; theme: Theme }[];

export type BackgroundId = (typeof BACKGROUNDS)[number]["id"];

const IDS: readonly string[] = BACKGROUNDS.map((bg) => bg.id);
const THEMES: readonly string[] = ["light", "dark"];

function isBackground(value: string | null | undefined): value is BackgroundId {
  return value != null && IDS.includes(value);
}

function isTheme(value: string | null | undefined): value is Theme {
  return value != null && THEMES.includes(value);
}

/** Фон с учётом настройки и необязательного ?bg= из адреса. Неизвестное значение — королевство. */
export function resolveBackground(setting: string | undefined, override?: string | null): BackgroundId {
  if (isBackground(override)) return override;
  return isBackground(setting) ? setting : "kingdom";
}

/** Тема, которая подходит фону. */
export function backgroundTheme(id: BackgroundId): Theme {
  return BACKGROUNDS.find((bg) => bg.id === id)?.theme ?? "dark";
}

/** Тема: ?theme= из адреса, затем настройка, "auto" — по фону. */
export function resolveTheme(setting: string | undefined, background: BackgroundId, override?: string | null): Theme {
  if (isTheme(override)) return override;
  return isTheme(setting) ? setting : backgroundTheme(background);
}

/**
 * Скрипт для <head>: до первой отрисовки ставит <html data-bg> и <html data-theme>.
 * ?bg=3 в адресе переключает фон, ?theme=light|dark — тему.
 */
export function buildBackgroundScript(defaultBg: BackgroundId, themeSetting: string): string {
  const themes = JSON.stringify(Object.fromEntries(BACKGROUNDS.map((bg) => [bg.id, bg.theme])));
  return `(function(){try{var t=${themes},p=new URLSearchParams(location.search),q=p.get("bg"),b=Object.prototype.hasOwnProperty.call(t,q)?q:${JSON.stringify(defaultBg)},s=p.get("theme"),f=${JSON.stringify(themeSetting)},d=document.documentElement.dataset;d.bg=b;d.theme=s==="light"||s==="dark"?s:f==="light"||f==="dark"?f:t[b]}catch(e){}})()`;
}
