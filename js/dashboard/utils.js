/**
 * Утилиты для панели
 */

export const utils = {
  /**
   * Форматировать дату
   */
  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      if (daysDiff < 7 && daysDiff > 0) {
        return `${daysDiff} ${daysDiff === 1 ? 'день' : daysDiff < 5 ? 'дня' : 'дней'} назад`;
      }
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  },

  /**
   * Форматировать время
   */
  formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Форматировать число
   */
  formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('ru-RU').format(num);
  },

  /**
   * Форматировать валюту
   */
  formatCurrency(amount) {
    return `₽${this.formatNumber(amount)}`;
  },

  /**
   * Дебаунс
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Получить текст статуса
   */
  getStatusText(status) {
    const map = {
      'active': 'Активный',
      'trial': 'Пробное занятие',
      'inactive': 'Неактивный',
      'completed': 'Завершено',
      'scheduled': 'Запланировано',
      'cancelled': 'Отменено',
      'missed': 'Пропущено'
    };
    return map[status] || status;
  },

  /**
   * Получить текст тарифа
   */
  getTariffText(tariff) {
    const map = {
      'basic': 'Начальный курс',
      'standard': 'Стандартный курс',
      'advanced': 'Продвинутый курс',
      'oge': 'Подготовка к ОГЭ',
      'ege': 'Подготовка к ЕГЭ',
      'intensive': 'Интенсивный курс'
    };
    return map[tariff] || tariff;
  }
};
