/**
 * Компонент Sidebar для панели репетитора
 */

import { MENU_ITEMS } from '../constants.js';

/**
 * Создать компонент Sidebar
 * @param {string} activePage - Активная страница
 * @returns {HTMLElement} - Элемент sidebar
 */
export function createSidebar(activePage = null) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'dashboard-sidebar';
  
  const nav = document.createElement('ul');
  nav.className = 'shadcn-nav';
  
  // Определяем активную страницу, если не указана
  if (!activePage) {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'dashboard.html';
    activePage = filename.replace('.html', '');
  }
  
  MENU_ITEMS.forEach(item => {
    const li = document.createElement('li');
    
    const link = document.createElement('a');
    link.className = 'shadcn-nav-item';
    link.href = item.href;
    link.innerHTML = `
      <i class="${item.icon}"></i>
      <span>${item.title}</span>
    `;
    
    // Устанавливаем активное состояние
    if (item.id === activePage || item.href.includes(activePage)) {
      link.classList.add('active');
    }
    
    // Обработка отключенных пунктов меню
    if (item.disabled) {
      link.href = '#';
      link.style.opacity = '0.5';
      link.style.cursor = 'not-allowed';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Можно показать уведомление о том, что функция в разработке
      });
    }
    
    li.appendChild(link);
    nav.appendChild(li);
  });
  
  sidebar.appendChild(nav);
  
  // Обработка закрытия мобильного меню при клике вне его
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open')) {
      if (!sidebar.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
        sidebar.classList.remove('mobile-open');
      }
    }
  });
  
  return sidebar;
}

/**
 * Обновить активный пункт меню в sidebar
 * @param {string} pageName - Имя страницы
 */
export function setActiveMenuItem(pageName) {
  const navItems = document.querySelectorAll('.shadcn-nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href && (href.includes(pageName) || item.closest('li').querySelector(`[data-page="${pageName}"]`))) {
      item.classList.add('active');
    }
  });
}

