/**
 * Главная страница панели
 */

import { utils } from './utils.js';

// Инициализация страницы
document.addEventListener('DOMContentLoaded', async () => {
  await loadDashboard();
});

/**
 * Загрузить данные главной страницы
 */
async function loadDashboard() {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  try {
    // Загружаем статистику
    const [stats, students, schedule] = await Promise.all([
      window.apiClient.getStudentStatistics().catch(() => ({ total: 0, active: 0, trial: 0, new: 0 })),
      window.apiClient.getStudents({ page: 1, limit: 5 }).catch(() => ({ students: [] })),
      loadTodaySchedule()
    ]);

    // Очищаем контент
    content.innerHTML = '';

    // Заголовок
    const title = document.createElement('h1');
    title.className = 'dashboard-title';
    title.textContent = 'Добро пожаловать в личный кабинет!';
    content.appendChild(title);

    // Карточки статистики
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'dashboard-cards';

    // Всего учеников
    const totalCard = createStatCard({
      value: stats.total || 0,
      label: 'Всего учеников',
      icon: 'fas fa-users',
      badge: stats.new ? `+${stats.new} за месяц` : ''
    });
    cardsContainer.appendChild(totalCard);

    // Активные ученики
    const activeCard = createStatCard({
      value: stats.active || 0,
      label: 'Активные',
      icon: 'fas fa-check-circle',
      badgeType: 'success'
    });
    cardsContainer.appendChild(activeCard);

    // Занятий сегодня
    const todayCard = createStatCard({
      value: schedule.length,
      label: 'Занятий сегодня',
      icon: 'fas fa-calendar-day',
      badge: schedule.length > 0 ? 'Есть занятия' : 'Нет занятий',
      badgeType: schedule.length > 0 ? 'primary' : 'muted'
    });
    cardsContainer.appendChild(todayCard);

    // Пробные занятия
    const trialCard = createStatCard({
      value: stats.trial || 0,
      label: 'Пробные',
      icon: 'fas fa-hourglass-half',
      badgeType: 'warning'
    });
    cardsContainer.appendChild(trialCard);

    content.appendChild(cardsContainer);

    // Новые ученики
    if (students.students && students.students.length > 0) {
      const studentsSection = createSection('Новые ученики', 'students.html', 'Все ученики');
      const table = createStudentsTable(students.students);
      studentsSection.appendChild(table);
      content.appendChild(studentsSection);
    }

    // Расписание на сегодня
    if (schedule.length > 0) {
      const scheduleSection = createSection('Расписание на сегодня', 'schedule.html', 'Все расписание');
      const scheduleList = createScheduleList(schedule);
      scheduleSection.appendChild(scheduleList);
      content.appendChild(scheduleSection);
    }

  } catch (error) {
    console.error('Error loading dashboard:', error);
    content.innerHTML = '<p style="color: var(--shadcn-error);">Ошибка загрузки данных</p>';
    window.Dashboard.showNotification('Ошибка загрузки данных', 'error');
  }
}

/**
 * Загрузить расписание на сегодня
 */
async function loadTodaySchedule() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await window.apiClient.getSchedule(today, today);
    return result.lessons || [];
  } catch (error) {
    console.error('Error loading schedule:', error);
    return [];
  }
}

/**
 * Создать карточку статистики
 */
function createStatCard({ value, label, icon, badge, badgeType = 'success' }) {
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

  if (badge) {
    const badgeEl = document.createElement('div');
    badgeEl.className = `shadcn-badge shadcn-badge-${badgeType}`;
    badgeEl.innerHTML = badge;
    content.appendChild(badgeEl);
  }

  card.appendChild(content);
  return card;
}

/**
 * Создать секцию
 */
function createSection(title, link, linkText) {
  const section = document.createElement('div');
  section.className = 'shadcn-card dashboard-section';

  const header = document.createElement('div');
  header.className = 'shadcn-card-header';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'dashboard-section-title';
  titleDiv.innerHTML = `
    <span>${title}</span>
    <a href="${link}" class="shadcn-btn shadcn-btn-outline shadcn-btn-sm">${linkText}</a>
  `;
  header.appendChild(titleDiv);
  section.appendChild(header);

  const content = document.createElement('div');
  content.className = 'shadcn-card-content';
  section.appendChild(content);

  return content;
}

/**
 * Создать таблицу учеников
 */
function createStudentsTable(students) {
  const table = document.createElement('table');
  table.className = 'students-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Имя</th>
      <th>Класс</th>
      <th>Тариф</th>
      <th>Статус</th>
      <th>Начало занятий</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  students.forEach(student => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => {
      window.location.href = `student-details.html?id=${student.id}`;
    });

    tr.innerHTML = `
      <td>${student.first_name || ''} ${student.last_name || ''}</td>
      <td>${student.grade} класс</td>
      <td>${utils.getTariffText(student.tariff)}</td>
      <td><span class="shadcn-badge student-status ${student.status}">${utils.getStatusText(student.status)}</span></td>
      <td>${utils.formatDate(student.created_at)}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

/**
 * Создать список расписания
 */
function createScheduleList(lessons) {
  const list = document.createElement('ul');
  list.className = 'schedule-list';

  lessons.forEach(lesson => {
    const item = document.createElement('li');
    item.className = 'schedule-item shadcn-lesson-card';
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      window.location.href = `lesson-details.html?id=${lesson.id}`;
    });

    const time = utils.formatTime(lesson.date);
    const studentName = lesson.student 
      ? `${lesson.student.first_name} ${lesson.student.last_name}`.trim()
      : 'Ученик';

    item.innerHTML = `
      <div class="schedule-time">${time}</div>
      <div class="schedule-info">
        <div class="schedule-student">${studentName}</div>
        <div class="schedule-type">${lesson.topic || 'Обычное занятие'}</div>
      </div>
      <div class="schedule-actions">
        <button class="shadcn-btn shadcn-btn-primary shadcn-btn-sm shadcn-btn-icon" title="Просмотр">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    `;
    list.appendChild(item);
  });

  return list;
}

