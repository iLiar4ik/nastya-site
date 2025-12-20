/**
 * Модуль проверки авторизации для панели репетитора
 */

/**
 * Проверить статус авторизации пользователя
 * @returns {Promise<Object|null>} - Данные пользователя или null
 */
export async function checkAuthStatus() {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    // Если токен отсутствует, перенаправляем на страницу входа
    window.location.href = 'login.html';
    return null;
  }
  
  try {
    // Проверяем токен через API
    if (!window.apiClient) {
      console.error('API client not available');
      window.location.href = 'login.html';
      return null;
    }
    
    const result = await window.apiClient.getCurrentUser();
    if (result.user) {
      // Сохраняем пользователя в localStorage для совместимости
      const sessionData = {
        userId: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentUser', JSON.stringify(sessionData));
      return sessionData;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    // Токен невалиден, очищаем его и перенаправляем на вход
    if (window.apiClient) {
      window.apiClient.clearTokens();
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    // Показываем уведомление только если есть элемент для него
    const notification = document.getElementById('notification');
    if (notification) {
      const notificationMessage = notification.querySelector('.notification-message');
      if (notificationMessage) {
        notificationMessage.textContent = 'Сессия истекла. Пожалуйста, войдите снова.';
        notification.style.backgroundColor = '#F44336';
        notification.classList.add('show');
      }
    }
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return null;
  }
  
  return null;
}

/**
 * Выйти из системы
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    if (window.apiClient) {
      await window.apiClient.logout();
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
  
  // Показываем уведомление
  const notification = document.getElementById('notification');
  if (notification) {
    const notificationMessage = notification.querySelector('.notification-message');
    if (notificationMessage) {
      notificationMessage.textContent = 'Вы вышли из системы';
      notification.style.backgroundColor = '#4CAF50';
      notification.classList.add('show');
    }
  }
  
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
}

/**
 * Получить текущего пользователя из localStorage
 * @returns {Object|null} - Данные пользователя или null
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

