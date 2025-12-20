/**
 * Страница расписания
 */

import { utils } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadSchedule();
});

/**
 * Загрузить расписание
 */
async function loadSchedule() {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    const result = await window.apiClient.getSchedule(startDate, endDate);
    const lessons = result.lessons || [];

    content.innerHTML = '';

    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Расписание занятий';
    content.appendChild(title);

    if (lessons.length === 0) {
      const empty = document.createElement('div');
      empty.style.textAlign = 'center';
      empty.style.padding = '3rem';
      empty.innerHTML = `
        <i class="fas fa-calendar-times" style="font-size: 4rem; color: hsl(var(--shadcn-muted-foreground)); margin-bottom: 1rem;"></i>
        <h3>Нет запланированных занятий</h3>
        <p style="color: hsl(var(--shadcn-muted-foreground));">Добавьте занятие в расписание</p>
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

    // Отображаем по датам
    Object.keys(grouped).sort().forEach(date => {
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
        item.className = 'schedule-item';
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
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${time}</div>
            <div style="color: hsl(var(--shadcn-muted-foreground));">${studentName}</div>
            <div style="color: hsl(var(--shadcn-muted-foreground)); font-size: 0.875rem;">${lesson.topic || 'Обычное занятие'}</div>
          </div>
          <div>
            <span class="shadcn-badge lesson-status ${lesson.status}">${utils.getStatusText(lesson.status)}</span>
          </div>
        `;

        body.appendChild(item);
      });

      section.appendChild(body);
      content.appendChild(section);
    });

  } catch (error) {
    console.error('Error loading schedule:', error);
    content.innerHTML = '<p style="color: var(--shadcn-error);">Ошибка загрузки расписания</p>';
    window.Dashboard.showNotification('Ошибка загрузки расписания', 'error');
  }
}

