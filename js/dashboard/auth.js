import { showNotification } from './utils.js';

/**
 * Проверяет статус авторизации пользователя.
 * Если пользователь не авторизован или токен невалиден, перенаправляет на страницу входа.
 */
export async function checkAuthStatus() {
  const accessToken = localStorage.getItem('accessToken');
  
  if (!accessToken) {
    window.location.href = 'login.html';
    return null;
  }
  
  try {
    const result = await window.apiClient.getCurrentUser();
    if (result.user) {
      const sessionData = {
        userId: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        studentId: result.user.student_id,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('currentUser', JSON.stringify(sessionData));
      return sessionData;
    }
  } catch (error) {
    window.apiClient.clearTokens();
    localStorage.removeItem('currentUser');
    showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return null;
  }
  
  return null;
}

/**
 * Получает текущего пользователя из localStorage.
 */
export function getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

/**
 * Выполняет выход пользователя из системы.
 */
export async function logout() {
  try {
    await window.apiClient.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
  localStorage.removeItem('currentUser');
  showNotification('Вы вышли из системы', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
}
