# Лендинг менторства в QA / AQA

Next.js (App Router) + TypeScript + Tailwind CSS v4. Статический экспорт: после сборки в папке `out/`
лежит готовый сайт из HTML, CSS и JS, его можно залить на любой хостинг.

## Быстрый старт

```bash
npm install
npm run dev      # локально: http://localhost:3000
npm test         # тесты (Vitest)
npm run build    # сборка в папку out/
```

Нужен Node.js 20.9 или новее.

## Где что менять

| Что | Где |
| --- | --- |
| Все тексты, цены, ссылки, пункты списков, FAQ, meta и Open Graph | `src/content.ts` |
| Цвета (акцент и остальные) | `src/app/globals.css`, блок `:root` |
| Шрифты | `src/app/fonts.ts` (какие шрифты грузить) и `src/app/globals.css` (`--font-display`, `--font-sans`, `--font-mono`) |
| Фото команды | `public/team/` + поле `photo` в `src/content.ts` (подробности в `public/team/README.txt`) |
| Порядок секций, убрать секцию | массив `sections` в `src/app/page.tsx` |
| Вёрстка отдельной секции | `src/components/sections/<Секция>.tsx` |
| Сезон фона (зима, весна, лето, осень или по дате) | `content.scene.season` в `src/content.ts` |
| Картинки сцены | `public/scene/` |
| Роадмап: треки, этапы, главы про AI | `content.roadmap` в `src/content.ts` (у этапа `ai: true` — тег AI) |
| Жуки: подсказка, счётчик, выключить | `content.bugs` в `src/content.ts`; скорость и поведение — `src/lib/bugs.ts` |

### Тексты

Всё в `src/content.ts`, в компонентах текста нет (это проверяет тест). Значения в `[КВАДРАТНЫХ СКОБКАХ]`
нужно заменить перед публикацией. Их легко найти поиском по `[`:

- `[https://ваш-домен.ru]` — `meta.siteUrl`. Пока здесь плейсхолдер, `og:url` и `og:image` не выводятся.

Картинка для соцсетей: положи `public/og.png` (1200×630) и укажи `ogImage: "/og.png"`.
Она появится в разметке, когда в `siteUrl` будет настоящий домен.

### Цвета

Тема — «тёмное стекло» поверх сцены. Цвета кнопок — `--accent`, акцентный текст на тёмном — `--gold`,
стекло — `--glass` / `--glass-strong`, затемнение сцены — `--scene-overlay`. Всё в блоке `:root`
файла `src/app/globals.css`; оттуда цвета попадают в утилиты Tailwind (`bg-accent`, `text-gold`, `glass`…) и в favicon.
В Tailwind v4 нет отдельного `tailwind.config`: его роль играет блок `@theme inline` в том же файле.

### Favicon

Генерируется при сборке (`src/app/favicon.svg/route.ts`): инициалы берутся из `content.brand.initials`,
цвет — из `--accent`. Отдельно править не нужно.

### Королевство: сцена, сезоны, частицы, жуки

- **Сезон.** `content.scene.season`: `"winter"`, `"spring"`, `"summer"`, `"autumn"` или `"auto"` (по месяцу:
  дек–фев зима, мар–май весна, июн–авг лето, сен–ноя осень). Любой сезон можно посмотреть по адресу `?season=summer`.
- **Картинки.** `public/scene/<сезон>.webp` (десктоп) и `<сезон>-m.webp` (портретный кроп для телефонов).
  Загружается только картинка текущего сезона. Пересобрать из PNG:
  `cwebp -q 72 -m 6 autumn.png -o public/scene/autumn.webp` и
  `cwebp -q 72 -m 6 -crop 480 0 620 1033 autumn.png -o public/scene/autumn-m.webp`.
- **Тема и фон.** По умолчанию белый стиль на фоне 12 «Бумага»; кнопка солнце/луна в шапке включает тёмную тему
  на фоне 7 «Графит», браузер посетителя запоминает выбор. Настройки — `content.scene.theme` и
  `content.scene.backgrounds` (`"kingdom"` — королевство по сезонам, `"1"`…`"17"` — фоны из `public/backgrounds/`,
  названия — `src/lib/backgrounds.ts`). Цвета белого стиля — блок `html[data-theme="light"]` в `globals.css`.
- **Посмотреть другой фон** без правок: `?bg=3` в адресе (фон в своей теме, `?theme=dark|light` её меняет)
  или `BG=3 npm run dev`; `THEME=dark npm run dev` — тёмная тема по умолчанию.
- **Частицы.** Снег, листья, лепестки или светлячки по сезону: часть летит за стеклом, часть — поверх.
  Количество — `src/lib/particles.ts`, внешний вид — блок «ЧАСТИЦЫ» в `globals.css`.
- **Жуки.** Ползают по экрану. Поймать — кликнуть по жуку или навести на него курсор и задержать,
  на телефоне — тап. Тексты — `content.bugs`, `bugs: null` убирает жуков, подсказку и счётчик.
- Если в системе включено «уменьшить движение» или JS не загрузился, частиц и жуков нет.

### Секции

```tsx
// src/app/page.tsx
const sections = [Hero, Audience, Roadmap, Pricing, Team, Referral, Faq, Cta];
```

Убрать секцию — удали её из массива. Если на неё вели ссылки (меню, кнопки — поиск по `#id` в `content.ts`),
поправь их: `npm test` перечислит все ссылки, которые остались без цели.
Переставить — поменяй элементы местами. Шапка и футер — строки `<Header />` и `<Footer />` там же.

### Анимации

- Блоки проявляются при прокрутке: у них атрибут `data-reveal` (хелпер `revealProps` в `src/lib/reveal.ts`),
  а включает эффект компонент `<ScrollReveal />` в `src/app/page.tsx`. Удали эту строку, и всё будет видно сразу.
- Первый экран анимируется при загрузке: классы `motion-rise`, `motion-pop`, `motion-grow-x`.
- Длительность, сдвиг и плавность настраиваются в блоке «АНИМАЦИИ» в `src/app/globals.css`.
- Если в системе включено «уменьшить движение» или JS не загрузился, анимаций нет и весь контент виден сразу.

## Деплой

```bash
npm ci
npm run build
```

Залей содержимое папки `out/` на хостинг (любой статический: S3, Netlify, GitHub Pages, обычный веб-сервер).

### GitHub Pages

Публикация настроена в `.github/workflows/deploy.yml`: после каждого изменения в `main` GitHub Actions
прогоняет тесты, собирает сайт и выкладывает его на GitHub Pages.

1. Репозиторий должен быть публичным (на бесплатном плане GitHub Pages работает только для публичных).
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Влей изменения в `main` (или Actions → Deploy to GitHub Pages → Run workflow).
4. Сайт откроется по адресу `https://<организация>.github.io/<репозиторий>/`.

Сайт в подпапке (`/<репозиторий>/`) работает сам: workflow передаёт сборке путь через `NEXT_PUBLIC_BASE_PATH`.
Свой домен подключается в Settings → Pages → Custom domain; после этого подпапка исчезает автоматически.

### VPS + nginx

```bash
rsync -avz --delete out/ user@server:/var/www/mentoring/
```

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    root /var/www/mentoring;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    # файлы со хешем в имени можно кешировать навсегда
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    error_page 404 /404.html;
}
```

HTTPS удобно получить через certbot: `sudo certbot --nginx -d ваш-домен.ru`.
