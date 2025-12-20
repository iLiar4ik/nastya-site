/**
 * Ядро панели репетитора
 * Централизованная инициализация и управление состоянием
 */

class DashboardCore {
  constructor() {
    this.user = null;
    this.currentPage = null;
    this.apiClient = window.apiClient;
  }

  /**
   * Инициализировать панель
   */
  async init() {
    // Проверяем авторизацию
    await this.checkAuth();
    
    // Инициализируем layout
    this.initLayout();
    
    // Загружаем данные пользователя
    await this.loadUser();
  }

  /**
   * Проверить авторизацию
   */
  async checkAuth() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const result = await this.apiClient.getCurrentUser();
      if (!result.user) {
        throw new Error('User not found');
      }
      this.user = result.user;
    } catch (error) {
      console.error('Auth error:', error);
      this.apiClient.clearTokens();
      window.location.href = 'login.html';
    }
  }

  /**
   * Загрузить данные пользователя
   */
  async loadUser() {
    if (this.user) {
      this.updateUserUI(this.user);
    }
  }

  /**
   * Обновить UI пользователя
   */
  updateUserUI(user) {
    const avatar = document.getElementById('user-avatar');
    const name = document.getElementById('user-name');
    
    if (avatar) {
      avatar.textContent = this.getInitials(user.name);
    }
    if (name) {
      name.textContent = user.name;
    }
  }

  /**
   * Получить инициалы
   */
  getInitials(name) {
    if (!name) return 'П';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  /**
   * Инициализировать layout
   */
  initLayout() {
    // Layout будет создан через HTML шаблон
    this.setupEventListeners();
  }

  /**
   * Настроить обработчики событий
   */
  setupEventListeners() {
    // Выход
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }

    // Мобильное меню
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
    }

    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
          sidebar.classList.remove('mobile-open');
        }
      }
    });

    // Переключатель темы
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      themeToggle.checked = savedTheme === 'dark';

      themeToggle.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
      });
    }
  }

  /**
   * Выйти из системы
   */
  async logout() {
    try {
      await this.apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    this.apiClient.clearTokens();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }

  /**
   * Показать уведомление
   */
  showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    const messageEl = notification.querySelector('.notification-message');
    if (messageEl) {
      messageEl.textContent = message;
    }

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
}

// Создаем глобальный экземпляр
window.Dashboard = new DashboardCore();

