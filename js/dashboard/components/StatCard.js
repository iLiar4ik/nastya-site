/**
 * Компонент StatCard для отображения статистики
 */

/**
 * Создать карточку статистики
 * @param {Object} options - Параметры карточки
 * @param {string|number} options.value - Значение
 * @param {string} options.label - Подпись
 * @param {string} options.icon - Иконка (Font Awesome класс)
 * @param {string} options.badge - Бейдж (опционально)
 * @param {string} options.badgeType - Тип бейджа (success, primary, warning, error)
 * @param {string} options.className - Дополнительные классы
 * @returns {HTMLElement} - Элемент карточки
 */
export function createStatCard({ value, label, icon, badge, badgeType = 'success', className = '' }) {
  const card = document.createElement('div');
  card.className = `shadcn-card shadcn-stat-card ${className}`.trim();
  
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
  
  if (badge) {
    const badgeEl = document.createElement('div');
    badgeEl.className = `shadcn-badge shadcn-badge-${badgeType}`;
    badgeEl.innerHTML = badge;
    content.appendChild(badgeEl);
  }
  
  card.appendChild(content);
  return card;
}

