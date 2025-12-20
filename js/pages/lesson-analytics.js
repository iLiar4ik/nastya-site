/**
 * Страница аналитики уроков
 */

import { initLayout } from '../dashboard/layout.js';
import { createStatCard } from '../dashboard/components/StatCard.js';
import { showNotification, formatCurrency, formatNumber } from '../dashboard/utils.js';

/**
 * Инициализировать страницу аналитики
 */
export async function initLessonAnalytics() {
  await initLayout(null, async (user, content) => {
    try {
      const title = document.createElement('h1');
      title.className = 'dashboard-title';
      title.textContent = 'Аналитика уроков';
      content.appendChild(title);
      
      // Загружаем аналитику
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      
      const analytics = await window.apiClient.getAnalyticsOverview({ startDate, endDate });
      
      if (analytics) {
        // Карточки статистики
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'dashboard-cards';
        cardsContainer.style.marginTop = '2rem';
        
        if (analytics.overall) {
          const totalCard = createStatCard({
            value: analytics.overall.totalLessons || 0,
            label: 'Всего занятий',
            icon: 'fas fa-book'
          });
          cardsContainer.appendChild(totalCard);
          
          const completedCard = createStatCard({
            value: analytics.overall.completedLessons || 0,
            label: 'Завершено',
            icon: 'fas fa-check-circle',
            badgeType: 'success'
          });
          cardsContainer.appendChild(completedCard);
          
          const completionCard = createStatCard({
            value: `${analytics.overall.completionRate || 0}%`,
            label: 'Процент завершения',
            icon: 'fas fa-chart-line',
            badgeType: analytics.overall.completionRate > 80 ? 'success' : 'warning'
          });
          cardsContainer.appendChild(completionCard);
        }
        
        if (analytics.revenue) {
          const revenueCard = createStatCard({
            value: formatCurrency(analytics.revenue.totalRevenue || 0),
            label: 'Доход',
            icon: 'fas fa-ruble-sign',
            badgeType: 'success'
          });
          cardsContainer.appendChild(revenueCard);
        }
        
        content.appendChild(cardsContainer);
        
        // Дополнительная информация
        const infoSection = document.createElement('div');
        infoSection.className = 'shadcn-card';
        infoSection.style.marginTop = '2rem';
        infoSection.innerHTML = `
          <div class="shadcn-card-content">
            <h2 style="margin-bottom: 1rem;">Детальная статистика</h2>
            <p>Детальная аналитика и графики будут добавлены в следующих версиях.</p>
          </div>
        `;
        content.appendChild(infoSection);
      }
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      showNotification('Ошибка загрузки аналитики', 'error');
    }
  });
}

function formatCurrency(amount) {
  return `₽${formatNumber(amount)}`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLessonAnalytics);
} else {
  initLessonAnalytics();
}

