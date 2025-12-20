/**
 * Страница расписания
 */

import { initLayout } from '../dashboard/layout.js';
import { createLessonCard } from '../dashboard/components/LessonCard.js';
import { formatDate, formatTime, showNotification } from '../dashboard/utils.js';

/**
 * Инициализировать страницу schedule
 */
export async function initSchedule() {
  await initLayout(null, async (user, content) => {
    try {
      const title = document.createElement('h1');
      title.className = 'dashboard-title';
      title.textContent = 'Расписание занятий';
      content.appendChild(title);
      
      // Загружаем расписание на текущий месяц
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const schedule = await window.apiClient.getSchedule(startDate, endDate);
      
      if (schedule.lessons && schedule.lessons.length > 0) {
        const lessonsContainer = document.createElement('div');
        lessonsContainer.className = 'schedule-container';
        lessonsContainer.style.display = 'grid';
        lessonsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        lessonsContainer.style.gap = '1.5rem';
        lessonsContainer.style.marginTop = '2rem';
        
        schedule.lessons.forEach(lesson => {
          const card = createLessonCard(lesson, (lesson) => {
            window.location.href = `lesson-details.html?id=${lesson.id}`;
          });
          lessonsContainer.appendChild(card);
        });
        
        content.appendChild(lessonsContainer);
      } else {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.style.textAlign = 'center';
        emptyState.style.padding = '3rem';
        emptyState.innerHTML = `
          <i class="fas fa-calendar-times" style="font-size: 4rem; color: hsl(var(--shadcn-muted-foreground)); margin-bottom: 1rem;"></i>
          <h3>Нет запланированных занятий</h3>
          <p style="color: hsl(var(--shadcn-muted-foreground));">Добавьте занятие в расписание</p>
        `;
        content.appendChild(emptyState);
      }
      
    } catch (error) {
      console.error('Error loading schedule:', error);
      showNotification('Ошибка загрузки расписания', 'error');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSchedule);
} else {
  initSchedule();
}

