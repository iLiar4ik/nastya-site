/**
 * Утилиты для панели репетитора
 */

import { STATUS_MAP, TARIFF_MAP } from './constants.js';

/**
 * Получить инициалы пользователя из имени
 * @param {string} name - Имя пользователя
 * @returns {string} - Инициалы
 */
export function getUserInitials(name) {
  if (!name) return 'П';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return 'П';
}

/**
 * Форматировать дату в читаемый формат
 * @param {string|Date} dateString - Дата
 * @returns {string} - Отформатированная дата
 */
export function formatDate(dateString) {
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
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }
}

/**
 * Форматировать дату и время
 * @param {string|Date} dateString - Дата
 * @returns {string} - Отформатированная дата и время
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Форматировать время
 * @param {string|Date} dateString - Дата
 * @returns {string} - Отформатированное время
 */
export function formatTime(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Получить текст статуса
 * @param {string} status - Статус
 * @returns {string} - Текст статуса
 */
export function getStatusText(status) {
  return STATUS_MAP[status] || status;
}

/**
 * Получить текст тарифа
 * @param {string} tariff - Тариф
 * @returns {string} - Текст тарифа
 */
export function getTariffText(tariff) {
  return TARIFF_MAP[tariff] || tariff;
}

/**
 * Дебаунс функция
 * @param {Function} func - Функция для дебаунса
 * @param {number} wait - Время ожидания в мс
 * @returns {Function} - Дебаунсированная функция
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Форматировать число с разделителями тысяч
 * @param {number} num - Число
 * @returns {string} - Отформатированное число
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('ru-RU').format(num);
}

/**
 * Форматировать валюту
 * @param {number} amount - Сумма
 * @returns {string} - Отформатированная валюта
 */
export function formatCurrency(amount) {
  return `₽${formatNumber(amount)}`;
}

/**
 * Получить имя текущей страницы из URL
 * @returns {string} - Имя страницы
 */
export function getCurrentPageName() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'dashboard.html';
  return filename.replace('.html', '');
}

/**
 * Проверить, является ли элемент видимым в viewport
 * @param {HTMLElement} element - Элемент
 * @returns {boolean} - Видим ли элемент
 */
export function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Показать уведомление
 * @param {string} message - Сообщение
 * @param {string} type - Тип (success, error, warning, info)
 */
export function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  const notificationMessage = notification.querySelector('.notification-message');
  if (!notificationMessage) return;
  
  notificationMessage.textContent = message;
  
  // Устанавливаем цвет в зависимости от типа
  const colors = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3'
  };
  
  notification.style.backgroundColor = colors[type] || colors.success;
  notification.classList.add('show');
  
  // Автоматически скрываем уведомление через 5 секунд
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

/**
 * Создать элемент с классом
 * @param {string} tag - Тег элемента
 * @param {string|string[]} className - Класс(ы)
 * @param {string} content - Содержимое
 * @returns {HTMLElement} - Созданный элемент
 */
export function createElement(tag, className = '', content = '') {
  const element = document.createElement(tag);
  if (className) {
    if (Array.isArray(className)) {
      element.classList.add(...className);
    } else {
      element.className = className;
    }
  }
  if (content) {
    element.innerHTML = content;
  }
  return element;
}

