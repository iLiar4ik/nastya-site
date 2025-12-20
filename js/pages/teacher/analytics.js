import { createCard } from '../../dashboard/components/Card.js';
import { formatNumber, showNotification } from '../../dashboard/utils.js';

export default async function renderAnalytics(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];
    
    const [overview, students] = await Promise.all([
      window.apiClient.getAnalyticsOverview({ startDate, endDate }),
      window.apiClient.getStudentStatistics()
    ]);
    
    const overviewCard = createCard({
      title: 'Общая статистика',
      content: `
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${overview.totalLessons || 0}</div>
            <div class="stat-label">Всего занятий</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${overview.completedLessons || 0}</div>
            <div class="stat-label">Завершено</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${overview.totalStudents || 0}</div>
            <div class="stat-label">Учеников</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${overview.averageRating || 0}</div>
            <div class="stat-label">Средняя оценка</div>
          </div>
        </div>
      `
    });
    
    container.innerHTML = '';
    container.appendChild(overviewCard);
  } catch (error) {
    console.error('Error loading analytics:', error);
    container.innerHTML = '<div class="error">Ошибка загрузки статистики</div>';
  }
}

