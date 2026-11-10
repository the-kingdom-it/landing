/*
 * ВЕСЬ ТЕКСТ САЙТА – ЗДЕСЬ.
 *
 * Меняй строки, цены, ссылки и списки прямо в этом файле: компоненты только выводят их.
 * Значения в [КВАДРАТНЫХ СКОБКАХ] – плейсхолдеры, их нужно заменить перед публикацией.
 * Поле `id` у секции – это якорь в адресе (#roadmap). Если меняешь id, поправь ссылки в header.nav.
 */

import type { SeasonSetting } from "@/lib/season";

export type LinkItem = {
  label: string;
  href: string;
};

/** Иконки, доступные для карточек «Кому подойдёт». */
export type AudienceIcon = "compass" | "code" | "trending-up";

export type ReportStep = {
  label: string;
  passed: boolean;
};

export type TeamMember = {
  name: string;
  role: string;
  description: string;
  /** Технологии – выводятся моноширинными тегами. Пустой массив – блок не показывается. */
  stack: string[];
  /** Путь от папки public/, например "/team/valentin.jpg". null – плейсхолдер с инициалами. */
  photo: string | null;
  photoAlt: string;
  /** Ссылки под описанием, например Telegram. Пустой массив — без ссылок. */
  links: LinkItem[];
  /** Значок компании под фото: логотип из public/ и название. null — без значка. */
  company: { name: string; logo: string } | null;
};

export type RoadmapStage = {
  title: string;
  subtitle: string;
  /** Что изучаем на этапе. */
  learn: string;
  /** Глава про AI — помечается отдельным тегом. */
  ai: boolean;
};

export type RoadmapTrack = {
  id: string;
  title: string;
  goal: string;
  stages: RoadmapStage[];
};

export type RoadmapLabels = {
  tabs: string;
  goal: string;
  stage: string;
  learn: string;
  ai: string;
};

/** Награда за пойманных жуков: вместо счётчика появляются промокод и ссылка. */
export type BugReward = {
  goal: number;
  title: string;
  codeLabel: string;
  linkLabel: string;
  href: string;
};

export type PriceCard = {
  label: string;
  amount: string;
  text: string;
  /** Ссылка после текста, например на Telegram. null — без ссылки. */
  link: LinkItem | null;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    siteName: string;
    /** Адрес сайта с https://. Пока это плейсхолдер, og:url не выставляется. */
    siteUrl: string;
    locale: string;
    /** Картинка для соцсетей 1200×630 из public/, например "/og.png". null – без картинки. */
    ogImage: string | null;
  };
  scene: {
    /**
     * Сезон фона: "winter" | "spring" | "summer" | "autumn" или "auto" — по текущему месяцу.
     * Для проверки любой сезон можно открыть по адресу ?season=summer.
     */
    season: SeasonSetting;
  };
  brand: {
    /** Буквы в favicon. */
    initials: string;
    /** Название в шапке, ведёт наверх страницы. */
    name: string;
  };
  ui: {
    skipToContent: string;
    navLabel: string;
  };
  header: {
    nav: LinkItem[];
    cta: LinkItem;
  };
  hero: {
    id: string;
    /** Моноширинная надпись над заголовком. null — без надписи. */
    eyebrow: string | null;
    title: string;
    subtitle: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    report: {
      fileName: string;
      passedLabel: string;
      progressLabel: string;
      statusPassed: string;
      statusPending: string;
      /** Статусы «прогона» шагов в карточке, как в отчёте автотестов. */
      runLabels: { pending: string; running: string; passed: string };
      steps: ReportStep[];
    };
  };
  audience: {
    id: string;
    title: string;
    items: { icon: AudienceIcon; title: string; text: string }[];
  };
  roadmap: {
    id: string;
    title: string;
    lead: string;
    /** Блок о том, зачем в обучении главы про AI. */
    ai: { title: string; text: string };
    labels: RoadmapLabels;
    /** Последний шаг каждого трека. */
    final: { title: string; text: string };
    tracks: RoadmapTrack[];
  };
  pricing: {
    id: string;
    title: string;
    lead: string;
    postpayment: PriceCard;
  };
  team: {
    id: string;
    title: string;
    members: TeamMember[];
  };
  referral: {
    id: string;
    title: string;
    text: string;
    cta: LinkItem;
  };
  faq: {
    id: string;
    title: string;
    lead: string;
    /** link — необязательная ссылка под ответом. */
    items: { question: string; answer: string; link?: LinkItem }[];
  };
  cta: {
    id: string;
    title: string;
    text: string;
    button: LinkItem;
    handle: string;
  };
  /** Жуки, которых ловят лупой. null — жуков нет. */
  bugs: {
    hint: string;
    counterLabel: string;
    /** null — без награды, только счётчик. */
    reward: BugReward | null;
  } | null;
  footer: {
    /** Текст после «© год» слева. null — только «© год». */
    owner: string | null;
    /** Текст справа: ФИО, реквизиты или статус самозанятого. */
    legal: string;
  };
};

/** Telegram: ник меняется здесь, ссылка и подпись обновятся во всех блоках. */
const telegram = {
  url: "https://t.me/SadLiter",
  handle: "@SadLiter",
};

export const content: SiteContent = {
  meta: {
    title: "Менторство в QA и AQA – Валентин Волков",
    description:
      "Доведём до оффера в QA и автоматизации тестирования: личный план обучения, подготовка и мок-собеседования. Основная оплата – после оффера.",
    siteName: "Волков · менторство",
    siteUrl: "[https://ваш-домен.ru]",
    locale: "ru_RU",
    ogImage: null,
  },

  scene: {
    season: "winter",
  },

  brand: {
    initials: "KI",
    name: "Kingdom IT",
  },

  ui: {
    skipToContent: "Перейти к содержанию",
    navLabel: "Навигация по странице",
  },

  header: {
    nav: [
      { label: "Роадмап", href: "#roadmap" },
      { label: "Оплата", href: "#pricing" },
      { label: "Команда", href: "#team" },
      { label: "Вопросы", href: "#faq" },
    ],
    cta: { label: "Записаться", href: "#cta" },
  },

  hero: {
    id: "top",
    eyebrow: null,
    title: "Доведём до оффера в QA и AQA",
    subtitle:
      "Составим личный план обучения, натаскаем и будем проводить собеседования, пока не получишь оффер. Основная оплата – только после оффера.",
    primaryCta: { label: "Записаться на бесплатный созвон", href: "#cta" },
    secondaryCta: { label: "Как это работает", href: "#roadmap" },
    report: {
      fileName: "path_to_offer.spec",
      passedLabel: "passed",
      progressLabel: "Пройдено шагов на пути к офферу",
      statusPassed: "пройдено",
      statusPending: "впереди",
      runLabels: { pending: "PENDING", running: "RUNNING", passed: "PASSED" },
      steps: [
        { label: "Диагностика уровня", passed: true },
        { label: "Личный план", passed: true },
        { label: "Практика и проекты", passed: true },
        { label: "Мок-собеседования", passed: true },
        { label: "Резюме и отклики", passed: true },
        { label: "Оффер", passed: false },
      ],
    },
  },

  audience: {
    id: "audience",
    title: "Кому подойдёт",
    items: [
      {
        icon: "compass",
        title: "С нуля в IT",
        text: "Хочешь войти в IT через тестирование, но не понимаешь, с чего начать и что учить. Соберём базу и понятный маршрут до первой работы.",
      },
      {
        icon: "code",
        title: "Manual → AQA",
        text: "Уже работаешь в ручном тестировании и хочешь в автоматизацию. Выберем язык и стек, соберём проект, который не стыдно показать на собеседовании.",
      },
      {
        icon: "trending-up",
        title: "Хочешь грейд выше",
        text: "Целишься в бигтех или на следующий грейд. Закроем пробелы, подтянем архитектуру тестов и подготовим к сильным собеседованиям.",
      },
    ],
  },

  roadmap: {
    id: "roadmap",
    title: "Роадмап: выбери свой трек",
    lead: "У каждого этапа понятный результат на выходе.",
    ai: {
      title: "AI уже здесь",
      text: "Мы видим это изнутри: AI-ассистенты уже пишут тест-кейсы, генерируют тестовые данные и помогают с автотестами. Требования к тестировщикам изменились – от кандидатов ждут, что они умеют работать с AI. Поэтому мы адаптируем обучение под современные требования рынка: в каждом треке есть отдельные главы про AI.",
    },
    labels: {
      tabs: "Треки обучения",
      goal: "цель трека:",
      stage: "ЭТАП",
      learn: "изучаем",
      ai: "AI",
    },
    final: {
      title: "Оффер",
      text: "Получаешь оффер – и только после этого вносишь основную оплату.",
    },
    tracks: [
      {
        id: "qa",
        title: "QA с нуля",
        goal: "Первый оффер на позицию QA-инженера",
        stages: [
          {
            title: "Знакомство и личный план",
            subtitle: "бесплатная диагностика",
            learn: "Что уже умеешь, сколько времени есть, какая цель. Составляем личный план обучения.",
            ai: false,
          },
          {
            title: "Основы тестирования",
            subtitle: "как думает тестировщик",
            learn: "Виды и уровни тестирования, тест-дизайн, чек-листы, тест-кейсы и баг-репорты.",
            ai: false,
          },
          {
            title: "Веб, API и базы данных",
            subtitle: "что происходит под капотом",
            learn: "Клиент-сервер, HTTP, DevTools, Postman, основы SQL.",
            ai: false,
          },
          {
            title: "Инфраструктура и процессы",
            subtitle: "как устроена работа в команде",
            learn: "Docker и Kubernetes на уровне тестировщика, логирование и поиск причин багов в логах, процессы в командах, Agile и Scrum.",
            ai: false,
          },
          {
            title: "AI в работе тестировщика",
            subtitle: "отдельная глава",
            learn: "Как с AI разбирать требования, генерировать тест-кейсы и тестовые данные – и как ловить ошибки самого AI.",
            ai: true,
          },
          {
            title: "Резюме и собеседования",
            subtitle: "выход на рынок",
            learn: "Резюме под вакансии, стратегия откликов, мок-собеседования с разбором.",
            ai: false,
          },
        ],
      },
      {
        id: "aqa",
        title: "Manual → AQA",
        goal: "Оффер на позицию автоматизатора",
        stages: [
          {
            title: "Диагностика и выбор стека",
            subtitle: "бесплатная диагностика",
            learn: "Что уже умеешь, сколько времени есть, какая цель. Составляем личный план обучения.",
            ai: false,
          },
          {
            title: "Язык программирования",
            subtitle: "код для тестов",
            learn: "Основы языка под автотесты: синтаксис, структуры данных, ООП, работа с пакетами.",
            ai: false,
          },
          {
            title: "Автотесты UI и API",
            subtitle: "фреймворк с нуля",
            learn: "Playwright и pytest, Page Object, фикстуры, работа с API и тестовыми данными.",
            ai: false,
          },
          {
            title: "AI в автоматизации",
            subtitle: "отдельная глава",
            learn: "AI-ассистенты для написания и рефакторинга автотестов, генерация данных.",
            ai: true,
          },
          {
            title: "CI и отчёты",
            subtitle: "тесты в пайплайне",
            learn: "Запуск в CI, параллельный прогон, Allure-отчёты, Docker на базовом уровне.",
            ai: false,
          },
          {
            title: "Резюме и собеседования",
            subtitle: "выход на рынок",
            learn: "Резюме автоматизатора, live-coding, мок-собеседования с разбором.",
            ai: false,
          },
        ],
      },
      {
        id: "grade",
        title: "Грейд выше",
        goal: "Оффер на следующий грейд или в бигтех",
        stages: [
          {
            title: "Диагностика пробелов",
            subtitle: "бесплатная диагностика",
            learn: "Сравниваем твой опыт с требованиями целевого грейда и компаний.",
            ai: false,
          },
          {
            title: "Стратегия и архитектура тестирования",
            subtitle: "уровень выше",
            learn: "Пирамида тестов, контрактное тестирование, тестовые окружения, стратегия для команды.",
            ai: false,
          },
          {
            title: "Сложные системы",
            subtitle: "глазами QA",
            learn: "Микросервисы, очереди, базы данных, логи и мониторинг.",
            ai: false,
          },
          {
            title: "AI в процессах QA",
            subtitle: "отдельная глава",
            learn: "Внедрение AI-инструментов в команду, оценка качества ответов модели.",
            ai: true,
          },
          {
            title: "Собеседования уровня бигтех",
            subtitle: "финальная подготовка",
            learn: "Секции по тестированию, кодингу и проектированию, разбор каждой попытки.",
            ai: false,
          },
        ],
      },
    ],
  },

  pricing: {
    id: "pricing",
    title: "Платишь, когда есть результат",
    lead: "Основная оплата – после оффера. Нам так же важно, чтобы ты дошёл до результата, как и тебе.",
    postpayment: {
      label: "Постоплата",
      amount: "После оффера",
      text: "За актуальными условиями – в Telegram:",
      link: { label: telegram.handle, href: telegram.url },
    },
  },

  team: {
    id: "team",
    title: "Кто с тобой работает",
    members: [
      {
        name: "Валентин Волков",
        role: "AQA Engineer",
        description:
          "За 7 месяцев вырос от стажёра в Т-Банке до ведущего инженера по автоматизации, поэтому знаю, где застреваешь на первых этапах. Проведу тебе бесплатный созвон-знакомство.",
        stack: [],
        photo: "/team/valentin.jpg",
        photoAlt: "Валентин Волков, AQA Engineer",
        links: [{ label: "Канал @different_it", href: "https://t.me/different_it" }],
        company: { name: "Т-Банк", logo: "/team/tbank.svg" },
      },
      {
        name: "Александр",
        role: "AQA Lead",
        description:
          "Опыт в тестировании более 8 лет. Вырос от ручного тестировщика до AQA Lead в крупном бигтехе. Сам нанимает тестировщиков, поэтому знает рынок изнутри.",
        stack: [],
        photo: "/team/qa-lead.jpg",
        photoAlt: "Александр, AQA Lead",
        links: [{ label: "Написать @praleksander", href: "https://t.me/praleksander" }],
        company: null,
      },
    ],
  },

  referral: {
    id: "referral",
    title: "Приведи друга – получи 10%",
    text: "Порекомендуй менторство другу и получи 10% от постоплаты.",
    cta: { label: "Узнать условия", href: "#cta" },
  },

  faq: {
    id: "faq",
    title: "Частые вопросы",
    lead: "Не нашёл ответа – спроси на бесплатном созвоне.",
    items: [
      {
        question: "Что значит оплата после трудоустройства (постоплата)?",
        answer:
          "Я предоставляю тебе все материалы, довожу до оффера и помогаю в процессе трудоустройства. И только после того, как получишь первую зарплату, ты оплачиваешь обучение.",
      },
      {
        question: "Что будет, если я не получу оффер?",
        answer:
          "Платишь только после оффера: нет оффера – нет оплаты.",
      },
      {
        question: "Что если меня уволили с испытательного срока?",
        answer:
          "Постоплата встаёт на паузу, пока не найдёшь новую работу. Всё, что ты уже выплатил, засчитывается – на новом месте процент не начинается с нуля.",
      },
      {
        question: "Как долго длится обучение?",
        answer:
          "Сроки зависят от твоей вовлечённости: чем больше времени ты готов уделять каждый день, тем быстрее выйдешь на собеседования и получишь оффер. При этом полгода учить теорию перед первым собеседованием не придётся. Смысла в этом нет: к концу забудешь то, что выучил в начале, и придётся повторять заново – пустая трата времени.",
      },
      {
        question: "Какая зарплата у меня будет после обучения?",
        answer:
          "Ориентируемся на среднюю зарплату уровня Middle. Конкретные цифры зависят от того, куда попадёшь.",
        link: { label: "Пример статистики зарплат", href: "https://t.me/offer_insights/119" },
      },
      {
        question: "Что ты не делаешь как ментор?",
        answer:
          "Я не репетитор, который ходит за тобой с журналом, отмечает пропуски и напоминает о каждой несданной домашке. С меня – план и обратная связь, с тебя – самостоятельная работа и соблюдение дедлайнов. Основное общение идёт в чате.",
      },
      {
        question: "Есть ли общий чат с учениками?",
        answer: "Да, есть. Доступ к нему и к материалам предоставляется навсегда.",
      },
      {
        question: "Обучаете работать с ИИ?",
        answer: "Да, обучаем.",
      },
    ],
  },

  cta: {
    id: "cta",
    title: "Начнём с бесплатного созвона",
    text: "Расскажи, где ты сейчас и куда хочешь прийти. Разберём твой уровень и предложим план.",
    button: { label: "Написать в Telegram", href: telegram.url },
    handle: telegram.handle,
  },

  bugs: {
    hint: "По сайту ползают баги – поймай лупой 10 штук и получи скидку в 1000 рублей",
    counterLabel: "поймано багов",
    reward: {
      goal: 10,
      title: "Скидка получена",
      codeLabel: "промокод",
      linkLabel: "Писать сюда",
      href: telegram.url,
    },
  },

  footer: {
    owner: null,
    legal: "Волков Валентин Александрович",
  },
};
