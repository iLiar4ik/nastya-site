/**
 * Страница истории уроков
 */

import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadLessons();
});

/**
 * Загрузить уроки
 */
async function loadLessons() {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  try {
    const result = await window.apiClient.getLessons({ status: 'completed', limit: 100 });
    const lessons = result.lessons || [];

    content.innerHTML = '';

    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'История уроков';
    content.appendChild(title);

    if (lessons.length === 0) {
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '3rem';
      empty.innerHTML = `
        <i class="fas fa-history" style="font-size: 4rem; color: hsl(var(--shadcn-muted-foreground)); margin-bottom: 1rem;"></i>
        <h3>Нет завершенных уроков</h3>
      `;
      content.appendChild(empty);
      return;
    }

    // Группируем по датам
    const grouped = {};
    lessons.forEach(lesson => {
      const date = new Date(lesson.date).toLocaleDateString('ru-RU');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(lesson);
    });

    // Отображаем
    Object.keys(grouped).sort().reverse().forEach(date => {
      const section = document.createElement('div');
      section.className = 'shadcn-card';
      section.style.marginBottom = '1.5rem';

      const header = document.createElement('div');
      header.className = 'shadcn-card-header';
      const title = document.createElement('h2');
      title.textContent = date;
      title.style.margin = 0;
      header.appendChild(title);
      section.appendChild(header);

      const body = document.createElement('div');
      body.className = 'shadcn-card-content';

      grouped[date].forEach(lesson => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '1rem';
        item.style.borderBottom = '1px solid hsl(var(--shadcn-border))';
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
          window.location.href = `lesson-details.html?id=${lesson.id}`;
        });

        const time = utils.formatTime(lesson.date);
        const studentName = lesson.student 
          ? `${lesson.student.first_name} ${lesson.student.last_name}`.trim()
          : 'Ученик';

        item.innerHTML = `
          <div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${time} - ${studentName}</div>
            <div style="color: hsl(var(--shadcn-muted-foreground));">${lesson.topic || 'Обычное занятие'}</div>
            ${lesson.rating ? `<div style="color: hsl(var(--shadcn-muted-foreground)); font-size: 0.875rem;">Оценка: ${lesson.rating}</div>` : ''}
          </div>
        `;

        body.appendChild(item);
      });

      section.appendChild(body);
      content.appendChild(section);
    });

  } catch (error) {
    console.error('Error loading lessons:', error);
    content.innerHTML = '<p style="color: var(--shadcn-error);">Ошибка загрузки уроков</p>';
    window.Dashboard.showNotification('Ошибка загрузки уроков', 'error');
  }
}

