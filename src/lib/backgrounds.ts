/**
 * Фоны страницы. "kingdom" — картинки королевства по сезонам, цифры — минималистичные фоны
 * из public/backgrounds/<номер>.webp. У каждого фона своя тема: на светлых фонах — белый стиль
 * (светлое стекло, тёмный текст), на тёмных — тёмное стекло.
 */
export type Theme = "light" | "dark";

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

/** Ключ, под которым браузер посетителя помнит выбранную тему. */
export const THEME_STORAGE_KEY = "kingdom-theme";

export type SceneConfig = {
  /** Тема по умолчанию. */
  theme: Theme;
  /** Фон для каждой темы: переключатель темы меняет и фон. */
  backgrounds: Record<Theme, BackgroundId>;
  /** Фон, заданный при запуске (BG=3 npm run dev), — работает как ?bg=. */
  forcedBg: BackgroundId | null;
};

/**
 * Какой фон и тему показать.
 * ?bg= (или BG=) — этот фон в его «родной» теме, ?theme= может её поменять; сохранённый выбор не мешает.
 * Без ?bg= — ?theme=, затем выбор посетителя, затем тема по умолчанию; фон — пара для темы.
 */
export function resolveScene(
  config: SceneConfig,
  input: { bg?: string | null; theme?: string | null; stored?: string | null },
): { theme: Theme; bg: BackgroundId } {
  const forced = isBackground(input.bg) ? input.bg : config.forcedBg;
  if (forced) return { theme: isTheme(input.theme) ? input.theme : backgroundTheme(forced), bg: forced };
  const theme = isTheme(input.theme) ? input.theme : isTheme(input.stored) ? input.stored : config.theme;
  return { theme, bg: config.backgrounds[theme] };
}

/** Скрипт для <head>: до первой отрисовки ставит <html data-bg> и <html data-theme> по правилам resolveScene. */
export function buildBackgroundScript(config: SceneConfig): string {
  const themes = JSON.stringify(Object.fromEntries(BACKGROUNDS.map((bg) => [bg.id, bg.theme])));
  return `(function(){try{var t=${themes},c=${JSON.stringify(config)},p=new URLSearchParams(location.search),ok=function(v){return v==="light"||v==="dark"},q=p.get("bg"),qt=p.get("theme"),st=null;try{st=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}var f=Object.prototype.hasOwnProperty.call(t,q)?q:c.forcedBg,th,bg;if(f){th=ok(qt)?qt:t[f];bg=f}else{th=ok(qt)?qt:ok(st)?st:c.theme;bg=c.backgrounds[th]}var d=document.documentElement.dataset;d.theme=th;d.bg=bg}catch(e){}})()`;
}
