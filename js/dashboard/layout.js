import { createHeader } from './components/Header.js';
import { createSidebar } from './components/Sidebar.js';
import { checkAuthStatus } from './auth.js';
import { showNotification } from './utils.js';

/**
 * Инициализировать общий layout панели управления
 */
export async function initLayout(activePage = null, onReady = () => {}) {
  const body = document.body;
  body.innerHTML = ''; // Очищаем body перед загрузкой нового layout

  // Создаем контейнер для всего приложения
  const appContainer = document.createElement('div');
  appContainer.className = 'dashboard-page';
  body.appendChild(appContainer);

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
    body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
      });
    }
  }

  try {
    const currentUser = await checkAuthStatus();
    if (!currentUser) {
      return;
    }

    // Создаем Header
    const header = createHeader(currentUser);
    appContainer.appendChild(header);

    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'dashboard-container';
    appContainer.appendChild(dashboardContainer);

    // Создаем Sidebar
    const sidebar = createSidebar(currentUser.role, activePage);
    dashboardContainer.appendChild(sidebar);

    // Создаем основной контент
    const mainContent = document.createElement('main');
    mainContent.className = 'dashboard-content';
    mainContent.id = 'dashboard-content';
    dashboardContainer.appendChild(mainContent);

    // Вызываем callback после инициализации layout
    onReady(currentUser, mainContent);
    
  } catch (error) {
    console.error('Error initializing layout:', error);
    window.location.href = 'login.html';
  }
}
