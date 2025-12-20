import { createCard } from '../../dashboard/components/Card.js';
import { formatDate, formatTime } from '../../dashboard/utils.js';

export default async function renderSchedule(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const schedule = await window.apiClient.getSchedule(startDate, endDate);
    const lessons = schedule.lessons || [];
    
    const card = createCard({
      title: 'Мое расписание',
      content: `
        <div class="schedule-list">
          ${lessons.length > 0 ? lessons.map(lesson => `
            <div class="schedule-item">
              <div class="schedule-item-date">
                <strong>${formatDate(lesson.date)}</strong>
                <span>${formatTime(lesson.time)}</span>
              </div>
              <div class="schedule-item-info">
                <h4>${lesson.topic || 'Занятие'}</h4>
                <p>${lesson.notes || ''}</p>
                <span class="badge badge-${lesson.status}">${lesson.status}</span>
              </div>
            </div>
          `).join('') : '<p>Нет запланированных занятий</p>'}
        </div>
      `
    });
    
    container.innerHTML = '';
    container.appendChild(card);
  } catch (error) {
    console.error('Error loading schedule:', error);
    container.innerHTML = '<div class="error">Ошибка загрузки расписания</div>';
  }
}

