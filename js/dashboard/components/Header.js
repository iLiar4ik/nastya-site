import { getUserInitials } from '../utils.js';
import { logout } from '../auth.js';

/**
 * Создает компонент Header
 */
export function createHeader(user) {
  const header = document.createElement('header');
  header.className = 'dashboard-header';
  
  header.innerHTML = `
    <div class="dashboard-header-content">
      <div class="dashboard-header-left">
        <h1 class="dashboard-logo">Панель управления</h1>
      </div>
      <div class="dashboard-header-right">
        <div class="dashboard-user-info">
          <div class="dashboard-user-avatar">
            ${getUserInitials(user.name)}
          </div>
          <div class="dashboard-user-details">
            <span class="dashboard-user-name">${user.name}</span>
            <span class="dashboard-user-role">${user.role === 'teacher' ? 'Учитель' : user.role === 'student' ? 'Ученик' : 'Администратор'}</span>
          </div>
        </div>
        <button class="shadcn-button shadcn-button-variant-outline" id="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Выход
        </button>
      </div>
    </div>
  `;
  
  // Обработчик выхода
  const logoutBtn = header.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  return header;
}
