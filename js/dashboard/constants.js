export const ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  teacher: 'Учитель',
  student: 'Ученик',
  admin: 'Администратор'
};

export const STATUS_MAP = {
  'active': 'Активный',
  'trial': 'Пробное занятие',
  'inactive': 'Неактивный',
  'completed': 'Завершено',
  'scheduled': 'Запланировано',
  'cancelled': 'Отменено',
  'missed': 'Пропущено',
  'pending': 'Ожидает',
  'in_progress': 'В процессе',
  'done': 'Выполнено'
};

export const PAYMENT_STATUS_MAP = {
  'pending': 'Ожидает оплаты',
  'completed': 'Оплачено',
  'cancelled': 'Отменено'
};

export const HOMEWORK_STATUS_MAP = {
  'pending': 'Не выполнено',
  'in_progress': 'В процессе',
  'done': 'Выполнено',
  'overdue': 'Просрочено'
};

export const NAVIGATION_ITEMS = {
  teacher: [
    { id: 'schedule', href: '#schedule', icon: 'fas fa-calendar-alt', label: 'Расписание' },
    { id: 'payments', href: '#payments', icon: 'fas fa-credit-card', label: 'Оплата' },
    { id: 'analytics', href: '#analytics', icon: 'fas fa-chart-line', label: 'Статистика' },
    { id: 'students', href: '#students', icon: 'fas fa-users', label: 'Ученики' }
  ],
  student: [
    { id: 'schedule', href: '#schedule', icon: 'fas fa-calendar-alt', label: 'Расписание' },
    { id: 'homework', href: '#homework', icon: 'fas fa-book', label: 'ДЗ' },
    { id: 'materials', href: '#materials', icon: 'fas fa-file-alt', label: 'Материалы' }
  ],
  admin: [
    { id: 'users', href: '#users', icon: 'fas fa-users-cog', label: 'Пользователи' }
  ]
};
