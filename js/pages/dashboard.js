/**
 * Страница главной панели (Dashboard)
 */

import { initLayout } from '../dashboard/layout.js';
import { createStatCard } from '../dashboard/components/StatCard.js';
import { createTable } from '../dashboard/components/Table.js';
import { formatDate, getStatusText, getTariffText, showNotification } from '../dashboard/utils.js';

/**
 * Инициализировать страницу dashboard
 */
export async function initDashboard() {
  await initLayout(null, async (user, content) => {
    try {
      // Загружаем статистику
      const dateRange = { startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] };
      const [statistics, studentsResult, analytics] = await Promise.all([
        window.apiClient.getStudentStatistics().catch(() => ({ total: 0, active: 0, trial: 0, new: 0 })),
        window.apiClient.getStudents({ page: 1, limit: 3 }).catch(() => ({ students: [] })),
        window.apiClient.getAnalyticsOverview(dateRange).catch(() => null)
      ]);
      
      // Создаем заголовок
      const title = document.createElement('h1');
      title.className = 'dashboard-title';
      title.textContent = 'Добро пожаловать в личный кабинет!';
      content.appendChild(title);
      
      // Создаем карточки статистики
      const cardsContainer = document.createElement('div');
      cardsContainer.className = 'dashboard-cards';
      
      // Всего учеников
      const totalStudentsCard = createStatCard({
        value: statistics.total || 0,
        label: 'Всего учеников',
        icon: 'fas fa-users',
        badge: statistics.new ? `+${statistics.new} за месяц` : '',
        badgeType: 'success'
      });
      cardsContainer.appendChild(totalStudentsCard);
      
      // Занятий сегодня - загружаем отдельно
      const today = new Date().toISOString().split('T')[0];
      let todayLessons = 0;
      try {
        const todaySchedule = await window.apiClient.getSchedule(today, today);
        todayLessons = todaySchedule.lessons?.length || 0;
      } catch (e) {
        console.error('Error loading today schedule:', e);
      }
      
      const todayCard = createStatCard({
        value: todayLessons,
        label: 'Занятий сегодня',
        icon: 'fas fa-calendar-day',
        badge: todayLessons > 0 ? 'Следующее скоро' : 'Нет занятий',
        badgeType: todayLessons > 0 ? 'primary' : 'muted'
      });
      cardsContainer.appendChild(todayCard);
      
      // Доход за месяц
      const revenue = analytics?.revenue?.totalRevenue || 0;
      const revenueCard = createStatCard({
        value: `₽${formatNumber(revenue)}`,
        label: 'Доход за месяц',
        icon: 'fas fa-ruble-sign',
        badge: analytics?.revenue?.growth ? `+${analytics.revenue.growth}% к прошлому месяцу` : '',
        badgeType: 'success'
      });
      cardsContainer.appendChild(revenueCard);
      
      // Успеваемость
      const completionRate = analytics?.overall?.completionRate || 0;
      const completionCard = createStatCard({
        value: `${completionRate}%`,
        label: 'Успеваемость',
        icon: 'fas fa-chart-line',
        badge: completionRate > 80 ? 'Отлично' : completionRate > 60 ? 'Хорошо' : 'Требует внимания',
        badgeType: completionRate > 80 ? 'success' : completionRate > 60 ? 'primary' : 'warning'
      });
      cardsContainer.appendChild(completionCard);
      
      content.appendChild(cardsContainer);
      
      // Раздел с новыми учениками
      if (studentsResult.students && studentsResult.students.length > 0) {
        const studentsSection = document.createElement('div');
        studentsSection.className = 'shadcn-card dashboard-section';
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'shadcn-card-header';
        
        const sectionTitle = document.createElement('div');
        sectionTitle.className = 'dashboard-section-title';
        sectionTitle.innerHTML = `
          <span>Новые ученики</span>
          <a href="students.html" class="shadcn-btn shadcn-btn-outline shadcn-btn-sm">Все ученики</a>
        `;
        sectionHeader.appendChild(sectionTitle);
        studentsSection.appendChild(sectionHeader);
        
        const sectionContent = document.createElement('div');
        sectionContent.className = 'shadcn-card-content';
        
        // Создаем таблицу
        const table = createTable({
          columns: [
            { key: 'name', label: 'Имя' },
            { key: 'grade', label: 'Класс' },
            { key: 'tariff', label: 'Тариф' },
            { key: 'status', label: 'Статус' },
            { key: 'created_at', label: 'Начало занятий' }
          ],
          data: studentsResult.students.map(student => ({
            name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
            grade: `${student.grade} класс`,
            tariff: getTariffText(student.tariff),
            status: getStatusText(student.status),
            created_at: formatDate(student.created_at)
          })),
          onRowClick: (row) => {
            window.location.href = `student-details.html?id=${studentsResult.students.find(s => 
              `${s.first_name} ${s.last_name}`.trim() === row.name
            )?.id}`;
          }
        });
        
        sectionContent.appendChild(table);
        studentsSection.appendChild(sectionContent);
        content.appendChild(studentsSection);
      }
      
      // Раздел с расписанием на сегодня
      try {
        const today = new Date().toISOString().split('T')[0];
        const schedule = await window.apiClient.getSchedule(today, today);
        
        if (schedule.lessons && schedule.lessons.length > 0) {
          const scheduleSection = document.createElement('div');
          scheduleSection.className = 'shadcn-card dashboard-section';
          
          const sectionHeader = document.createElement('div');
          sectionHeader.className = 'shadcn-card-header';
          
          const sectionTitle = document.createElement('div');
          sectionTitle.className = 'dashboard-section-title';
          sectionTitle.innerHTML = `
            <span>Расписание на сегодня</span>
            <a href="schedule.html" class="shadcn-btn shadcn-btn-outline shadcn-btn-sm">Все расписание</a>
          `;
          sectionHeader.appendChild(sectionTitle);
          scheduleSection.appendChild(sectionHeader);
          
          const sectionContent = document.createElement('div');
          sectionContent.className = 'shadcn-card-content';
          
          const scheduleList = document.createElement('ul');
          scheduleList.className = 'schedule-list';
          
          schedule.lessons.forEach(lesson => {
            const item = document.createElement('li');
            item.className = 'schedule-item shadcn-lesson-card';
            
            const time = document.createElement('div');
            time.className = 'schedule-time';
            time.textContent = lesson.time || formatTime(lesson.date);
            item.appendChild(time);
            
            const info = document.createElement('div');
            info.className = 'schedule-info';
            
            const student = document.createElement('div');
            student.className = 'schedule-student';
            student.textContent = lesson.student 
              ? `${lesson.student.first_name} ${lesson.student.last_name}`.trim()
              : 'Ученик';
            info.appendChild(student);
            
            const type = document.createElement('div');
            type.className = 'schedule-type';
            type.textContent = lesson.topic || lesson.type || 'Обычное занятие';
            info.appendChild(type);
            
            item.appendChild(info);
            
            const actions = document.createElement('div');
            actions.className = 'schedule-actions';
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'shadcn-btn shadcn-btn-primary shadcn-btn-sm shadcn-btn-icon';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.setAttribute('title', 'Просмотр');
            viewBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              window.location.href = `lesson-details.html?id=${lesson.id}`;
            });
            actions.appendChild(viewBtn);
            
            item.appendChild(actions);
            scheduleList.appendChild(item);
          });
          
          sectionContent.appendChild(scheduleList);
          scheduleSection.appendChild(sectionContent);
          content.appendChild(scheduleSection);
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
      
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      showNotification('Ошибка загрузки данных', 'error');
    }
  });
}

// Форматирование числа
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('ru-RU').format(num);
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}

