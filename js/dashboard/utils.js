import { STATUS_MAP, PAYMENT_STATUS_MAP, HOMEWORK_STATUS_MAP, ROLE_LABELS } from './constants.js';

/**
 * Получить инициалы пользователя из имени
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
        month: 'long'
      });
    }
  }
}

/**
 * Форматировать дату и время
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
 */
export function getStatusText(status) {
  return STATUS_MAP[status] || status;
}

/**
 * Получить текст статуса платежа
 */
export function getPaymentStatusText(status) {
  return PAYMENT_STATUS_MAP[status] || status;
}

/**
 * Получить текст статуса ДЗ
 */
export function getHomeworkStatusText(status) {
  return HOMEWORK_STATUS_MAP[status] || status;
}

/**
 * Получить текст роли
 */
export function getRoleLabel(role) {
  return ROLE_LABELS[role] || role;
}

/**
 * Дебаунс функция
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
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('ru-RU').format(num);
}

/**
 * Форматировать валюту
 */
export function formatCurrency(amount) {
  return `₽${formatNumber(amount)}`;
}

/**
 * Получить имя текущей страницы из URL
 */
export function getCurrentPageName() {
  const hash = window.location.hash.replace('#', '');
  return hash || 'schedule';
}

/**
 * Показать уведомление
 */
export function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  const notificationMessage = notification.querySelector('.notification-message');
  if (!notificationMessage) return;
  
  notificationMessage.textContent = message;
  
  const colors = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3'
  };
  
  notification.style.backgroundColor = colors[type] || colors.success;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

/**
 * Создать элемент с классом
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
