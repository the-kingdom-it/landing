/**
 * Фоны страницы. "kingdom" — картинки королевства по сезонам, цифры — минималистичные фоны
 * из public/backgrounds/<номер>.webp. У каждого фона своя тема: на светлых фонах — белый стиль
 * (светлое стекло, тёмный текст), на тёмных — тёмное стекло.
 */
export type Theme = "light" | "dark";
/** "system" — как в системе посетителя (светлая или тёмная тема ОС). */
export type ThemeSetting = Theme | "system";

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
  // darkVariant: у фона есть тёмная версия public/backgrounds/<id>-dark.webp для тёмной темы
  { id: "12", name: "Бумага", theme: "light", darkVariant: true },
  { id: "13", name: "Мята", theme: "light" },
  { id: "14", name: "Океан", theme: "dark" },
  { id: "15", name: "Неон", theme: "dark" },
  { id: "16", name: "Изумруд", theme: "dark" },
  { id: "17", name: "Космос", theme: "dark" },
] as const satisfies readonly { id: string; name: string; theme: Theme; darkVariant?: boolean }[];

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

/** Ключ, под которым браузер посетителя помнит выбранную тему. */
export const THEME_STORAGE_KEY = "kingdom-theme";

export type SceneConfig = {
  /** Тема по умолчанию: "system" — как в системе посетителя. */
  theme: ThemeSetting;
  /** Основной фон. Переключатель темы работает только на нём. */
  background: BackgroundId;
  /** Фон, заданный при запуске (BG=3 npm run dev), — работает как ?bg=. */
  forcedBg: BackgroundId | null;
};

export type SceneState = { theme: Theme; bg: BackgroundId; preview: boolean };

/**
 * Какой фон и тему показать.
 * ?bg= (или BG=) с другим фоном — предпросмотр: фон в его «родной» теме, ?theme= может её поменять,
 * переключатель темы скрыт. Иначе — основной фон, тема из ?theme=, выбора посетителя или по умолчанию.
 */
export function resolveScene(
  config: SceneConfig,
  input: { bg?: string | null; theme?: string | null; stored?: string | null; system?: Theme | null },
): SceneState {
  const requested = isBackground(input.bg) ? input.bg : config.forcedBg;
  if (requested && requested !== config.background) {
    return { theme: isTheme(input.theme) ? input.theme : backgroundTheme(requested), bg: requested, preview: true };
  }
  const fallback: Theme = config.theme === "system" ? (input.system ?? "light") : config.theme;
  const theme = isTheme(input.theme) ? input.theme : isTheme(input.stored) ? input.stored : fallback;
  return { theme, bg: config.background, preview: false };
}

/** Скрипт для <head>: до первой отрисовки ставит <html data-bg data-theme data-preview> по правилам resolveScene. */
export function buildBackgroundScript(config: SceneConfig): string {
  const themes = JSON.stringify(Object.fromEntries(BACKGROUNDS.map((bg) => [bg.id, bg.theme])));
  return `(function(){try{var t=${themes},c=${JSON.stringify(config)},p=new URLSearchParams(location.search),ok=function(v){return v==="light"||v==="dark"},q=p.get("bg"),qt=p.get("theme"),st=null;try{st=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var r=Object.prototype.hasOwnProperty.call(t,q)?q:c.forcedBg,d=document.documentElement.dataset;if(r&&r!==c.background){d.theme=ok(qt)?qt:t[r];d.bg=r;d.preview=""}else{var sys="light";try{if(matchMedia("(prefers-color-scheme: dark)").matches)sys="dark"}catch(e){}d.theme=ok(qt)?qt:ok(st)?st:c.theme==="system"?sys:c.theme;d.bg=c.background;delete d.preview}}catch(e){}})()`;
}
