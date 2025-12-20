/**
 * Единый layout для панели репетитора
 */

import { createHeader, updateHeaderUser } from './components/Header.js';
import { createSidebar, setActiveMenuItem } from './components/Sidebar.js';
import { checkAuthStatus } from './auth.js';
import { getCurrentPageName } from './utils.js';

let currentUser = null;

/**
 * Инициализировать layout
 * @param {HTMLElement} container - Контейнер для layout
 * @param {Function} onReady - Callback при готовности
 */
export async function initLayout(container, onReady) {
  try {
    // Проверяем авторизацию
    currentUser = await checkAuthStatus();
    
    if (!currentUser) {
      // Если авторизация не прошла, checkAuthStatus уже перенаправит на login
      return;
    }
    
    // Создаем структуру layout
    const layout = document.createElement('div');
    layout.className = 'dashboard-page';
    
    // Добавляем переключатель темы
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle-container';
    themeToggle.innerHTML = `
      <label class="shadcn-switch" for="theme-toggle">
        <input type="checkbox" id="theme-toggle">
        <span class="shadcn-switch-slider"></span>
      </label>
    `;
    layout.appendChild(themeToggle);
    
    // Создаем header
    const header = createHeader(currentUser);
    layout.appendChild(header);
    
    // Создаем контейнер для sidebar и content
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'dashboard-container';
    
    // Создаем sidebar
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'dashboard.html';
    const currentPage = filename.replace('.html', '');
    const sidebar = createSidebar(currentPage);
    dashboardContainer.appendChild(sidebar);
    
    // Создаем область контента
    const content = document.createElement('main');
    content.className = 'dashboard-content';
    content.id = 'dashboard-content';
    dashboardContainer.appendChild(content);
    
    layout.appendChild(dashboardContainer);
    
    // Добавляем уведомления, если их нет
    if (!document.getElementById('notification')) {
      const notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'notification';
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-message"></span>
          <span class="notification-close">&times;</span>
        </div>
      `;
      
      const closeBtn = notification.querySelector('.notification-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          notification.classList.remove('show');
        });
      }
      
      document.body.appendChild(notification);
    }
    
    // Очищаем контейнер и добавляем layout
    if (container) {
      container.innerHTML = '';
      container.appendChild(layout);
    } else {
      // Если контейнер не указан, заменяем body
      document.body.innerHTML = '';
      document.body.appendChild(layout);
    }
    
    // Инициализируем переключатель темы
    initThemeToggle();
    
    // Вызываем callback при готовности
    if (onReady && typeof onReady === 'function') {
      onReady(currentUser, content);
    }
    
  } catch (error) {
    console.error('Error initializing layout:', error);
    window.location.href = 'login.html';
  }
}

/**
 * Инициализировать переключатель темы
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  // Загружаем сохраненную тему
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.checked = savedTheme === 'dark';
  
  // Обработчик переключения темы
  themeToggle.addEventListener('change', (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
}

/**
 * Обновить информацию о пользователе в layout
 * @param {Object} user - Данные пользователя
 */
export function updateUserInfo(user) {
  if (user) {
    currentUser = user;
    updateHeaderUser(user);
  }
}

/**
 * Получить текущего пользователя
 * @returns {Object|null} - Данные пользователя
 */
export function getLayoutUser() {
  return currentUser;
}

/**
 * Обновить активный пункт меню
 * @param {string} pageName - Имя страницы
 */
export function updateActiveMenuItem(pageName) {
  setActiveMenuItem(pageName);
}

