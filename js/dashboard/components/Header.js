/**
 * Компонент Header для панели репетитора
 */

import { getUserInitials } from '../utils.js';
import { logout } from '../auth.js';

/**
 * Создать компонент Header
 * @param {Object} user - Данные пользователя
 * @returns {HTMLElement} - Элемент header
 */
export function createHeader(user) {
  const header = document.createElement('header');
  header.className = 'dashboard-header';
  
  const container = document.createElement('div');
  container.className = 'container';
  
  const headerContent = document.createElement('div');
  headerContent.className = 'dashboard-header-content';
  
  // Логотип и кнопка мобильного меню
  const logo = document.createElement('div');
  logo.className = 'dashboard-logo';
  
  const mobileMenuBtn = document.createElement('button');
  mobileMenuBtn.className = 'mobile-menu-toggle shadcn-btn shadcn-btn-ghost shadcn-btn-icon';
  mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
  mobileMenuBtn.setAttribute('aria-label', 'Открыть меню');
  mobileMenuBtn.addEventListener('click', () => {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open');
    }
  });
  
  const logoText = document.createElement('div');
  logoText.innerHTML = `
    <h1>Настя</h1>
    <p>Репетитор по математике</p>
  `;
  
  logo.appendChild(mobileMenuBtn);
  logo.appendChild(logoText);
  
  // Меню пользователя
  const userMenu = document.createElement('div');
  userMenu.className = 'user-menu';
  
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  
  const userAvatar = document.createElement('div');
  userAvatar.className = 'user-avatar';
  userAvatar.id = 'user-avatar';
  userAvatar.textContent = getUserInitials(user?.name || 'Пользователь');
  
  const userName = document.createElement('div');
  userName.className = 'user-name';
  userName.id = 'user-name';
  userName.textContent = user?.name || 'Загрузка...';
  
  userInfo.appendChild(userAvatar);
  userInfo.appendChild(userName);
  
  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'logout-btn shadcn-btn shadcn-btn-ghost shadcn-btn-icon';
  logoutBtn.id = 'logout-btn';
  logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
  logoutBtn.setAttribute('title', 'Выйти');
  logoutBtn.setAttribute('aria-label', 'Выйти из системы');
  logoutBtn.addEventListener('click', logout);
  
  userMenu.appendChild(userInfo);
  userMenu.appendChild(logoutBtn);
  
  headerContent.appendChild(logo);
  headerContent.appendChild(userMenu);
  container.appendChild(headerContent);
  header.appendChild(container);
  
  return header;
}

/**
 * Обновить информацию о пользователе в header
 * @param {Object} user - Данные пользователя
 */
export function updateHeaderUser(user) {
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  
  if (userAvatar && user) {
    userAvatar.textContent = getUserInitials(user.name);
  }
  
  if (userName && user) {
    userName.textContent = user.name;
  }
}

