/**
 * Константы для панели репетитора
 */

export const ROUTES = {
  DASHBOARD: 'dashboard',
  STUDENTS: 'students',
  SCHEDULE: 'schedule',
  LESSONS_HISTORY: 'lessons-history',
  LESSON_REPORT: 'lesson-report',
  LESSON_ANALYTICS: 'lesson-analytics',
  PAYMENTS: 'payments',
  MATERIALS: 'materials',
  SETTINGS: 'settings'
};

export const MENU_ITEMS = [
  {
    id: ROUTES.DASHBOARD,
    title: 'Главная',
    icon: 'fas fa-tachometer-alt',
    href: 'dashboard.html'
  },
  {
    id: ROUTES.STUDENTS,
    title: 'Ученики',
    icon: 'fas fa-users',
    href: 'students.html'
  },
  {
    id: ROUTES.SCHEDULE,
    title: 'Расписание',
    icon: 'fas fa-calendar-alt',
    href: 'schedule.html'
  },
  {
    id: ROUTES.LESSONS_HISTORY,
    title: 'История уроков',
    icon: 'fas fa-history',
    href: 'lessons-history.html'
  },
  {
    id: ROUTES.LESSON_REPORT,
    title: 'Отчеты',
    icon: 'fas fa-file-alt',
    href: 'lesson-report.html'
  },
  {
    id: ROUTES.LESSON_ANALYTICS,
    title: 'Аналитика',
    icon: 'fas fa-chart-line',
    href: 'lesson-analytics.html'
  },
  {
    id: ROUTES.PAYMENTS,
    title: 'Платежи',
    icon: 'fas fa-credit-card',
    href: '#',
    disabled: true
  },
  {
    id: ROUTES.MATERIALS,
    title: 'Материалы',
    icon: 'fas fa-book',
    href: '#',
    disabled: true
  },
  {
    id: ROUTES.SETTINGS,
    title: 'Настройки',
    icon: 'fas fa-cog',
    href: '#',
    disabled: true
  }
];

export const STATUS_MAP = {
  'active': 'Активный',
  'trial': 'Пробное занятие',
  'inactive': 'Неактивный',
  'completed': 'Завершено',
  'scheduled': 'Запланировано',
  'cancelled': 'Отменено',
  'missed': 'Пропущено'
};

export const TARIFF_MAP = {
  'basic': 'Начальный курс',
  'standard': 'Стандартный курс',
  'advanced': 'Продвинутый курс',
  'oge': 'Подготовка к ОГЭ',
  'ege': 'Подготовка к ЕГЭ',
  'intensive': 'Интенсивный курс'
};

export const TARIFF_PRICES = {
  'basic': 1500,
  'standard': 1800,
  'advanced': 2200,
  'oge': 1800,
  'ege': 2200,
  'intensive': 2200
};

export const LESSON_TYPES = {
  'regular': 'Обычное занятие',
  'trial': 'Пробное занятие',
  'exam_prep': 'Подготовка к экзамену',
  'review': 'Повторение',
  'test': 'Контрольная работа'
};

