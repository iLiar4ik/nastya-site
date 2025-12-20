import { NAVIGATION_ITEMS } from '../constants.js';
import { getCurrentPageName } from '../utils.js';

/**
 * Создает компонент Sidebar с навигацией в зависимости от роли
 */
export function createSidebar(role, activePage = null) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'dashboard-sidebar';
  
  const navItems = NAVIGATION_ITEMS[role] || [];
  const currentPage = activePage || getCurrentPageName();
  
  const navHTML = navItems.map(item => {
    const isActive = item.id === currentPage ? 'active' : '';
    return `
      <a href="${item.href}" class="dashboard-nav-item ${isActive}" data-page="${item.id}">
        <i class="${item.icon}"></i>
        <span>${item.label}</span>
      </a>
    `;
  }).join('');
  
  sidebar.innerHTML = `
    <nav class="dashboard-nav">
      ${navHTML}
    </nav>
  `;
  
  // Обработчики навигации
  const navItemsElements = sidebar.querySelectorAll('.dashboard-nav-item');
  navItemsElements.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      window.location.hash = page;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });
  
  return sidebar;
}
