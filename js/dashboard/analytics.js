/**
 * Страница аналитики
 */

import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadAnalytics();
});

/**
 * Загрузить аналитику
 */
async function loadAnalytics() {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date().toISOString().split('T')[0];

    const analytics = await window.apiClient.getAnalyticsOverview({ startDate, endDate });

    content.innerHTML = '';

    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Аналитика уроков';
    content.appendChild(title);

    // Карточки статистики
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'dashboard-cards';
    cardsContainer.style.marginTop = '2rem';

    if (analytics.overall) {
      const totalCard = createStatCard(analytics.overall.totalLessons || 0, 'Всего занятий', 'fas fa-book');
      cardsContainer.appendChild(totalCard);

      const completedCard = createStatCard(analytics.overall.completedLessons || 0, 'Завершено', 'fas fa-check-circle', 'success');
      cardsContainer.appendChild(completedCard);

      const completionCard = createStatCard(
        `${analytics.overall.completionRate || 0}%`,
        'Процент завершения',
        'fas fa-chart-line',
        analytics.overall.completionRate > 80 ? 'success' : 'warning'
      );
      cardsContainer.appendChild(completionCard);
    }

    if (analytics.revenue) {
      const revenueCard = createStatCard(
        utils.formatCurrency(analytics.revenue.totalRevenue || 0),
        'Доход',
        'fas fa-ruble-sign',
        'success'
      );
      cardsContainer.appendChild(revenueCard);
    }

    content.appendChild(cardsContainer);

    // Дополнительная информация
    const infoSection = document.createElement('div');
    infoSection.className = 'shadcn-card';
    infoSection.style.marginTop = '2rem';

    const infoContent = document.createElement('div');
    infoContent.className = 'shadcn-card-content';
    infoContent.innerHTML = `
      <h2 style="margin-bottom: 1rem;">Детальная статистика</h2>
      <p>Детальная аналитика и графики будут добавлены в следующих версиях.</p>
    `;
    infoSection.appendChild(infoContent);
    content.appendChild(infoSection);

  } catch (error) {
    console.error('Error loading analytics:', error);
    content.innerHTML = '<p style="color: var(--shadcn-error);">Ошибка загрузки аналитики</p>';
    window.Dashboard.showNotification('Ошибка загрузки аналитики', 'error');
  }
}

/**
 * Создать карточку статистики
 */
function createStatCard(value, label, icon, type = 'primary') {
  const card = document.createElement('div');
  card.className = 'shadcn-card shadcn-stat-card';

  const content = document.createElement('div');
  content.className = 'shadcn-card-content';

  if (icon) {
    const iconEl = document.createElement('div');
    iconEl.className = 'shadcn-stat-icon';
    iconEl.innerHTML = `<i class="${icon}"></i>`;
    content.appendChild(iconEl);
  }

  const valueEl = document.createElement('div');
  valueEl.className = 'shadcn-stat-value';
  valueEl.textContent = value;
  content.appendChild(valueEl);

  const labelEl = document.createElement('div');
  labelEl.className = 'shadcn-stat-label';
  labelEl.textContent = label;
  content.appendChild(labelEl);

  card.appendChild(content);
  return card;
}

