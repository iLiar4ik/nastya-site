import { createCard } from '../../dashboard/components/Card.js';
import { createButton } from '../../dashboard/components/Button.js';
import { createModal, closeModal } from '../../dashboard/components/Modal.js';
import { createForm } from '../../dashboard/components/Form.js';
import { formatDate, formatTime, showNotification } from '../../dashboard/utils.js';

export default async function renderSchedule(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const schedule = await window.apiClient.getSchedule(startDate, endDate);
    const lessons = schedule.lessons || [];
    
    const card = createCard({
      title: 'Расписание занятий',
      content: `
        <div class="schedule-controls">
          ${createButton('Добавить занятие', {
            onClick: () => showAddLessonModal(user, container),
            icon: 'fas fa-plus'
          }).outerHTML}
        </div>
        <div class="schedule-list">
          ${lessons.length > 0 ? lessons.map(lesson => `
            <div class="schedule-item">
              <div class="schedule-item-date">
                <strong>${formatDate(lesson.date)}</strong>
                <span>${formatTime(lesson.time)}</span>
              </div>
              <div class="schedule-item-info">
                <h4>${lesson.student ? `${lesson.student.first_name} ${lesson.student.last_name}` : 'Ученик'}</h4>
                <p>${lesson.topic || 'Без темы'}</p>
                <span class="badge badge-${lesson.status}">${lesson.status}</span>
              </div>
              <div class="schedule-item-actions">
                ${createButton('', {
                  onClick: () => showEditLessonModal(lesson, user, container),
                  icon: 'fas fa-edit',
                  variant: 'outline',
                  size: 'sm'
                }).outerHTML}
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

function showAddLessonModal(user, container) {
  const form = createForm({
    fields: [
      { label: 'Ученик', name: 'student_id', type: 'select', required: true, selectOptions: [] },
      { label: 'Дата', name: 'date', type: 'date', required: true },
      { label: 'Время', name: 'time', type: 'time', required: true },
      { label: 'Длительность (мин)', name: 'duration', type: 'number', value: '60', required: true },
      { label: 'Тема', name: 'topic', type: 'text' },
      { label: 'Примечания', name: 'notes', type: 'textarea' }
    ],
    onSubmit: async (data) => {
      try {
        await window.apiClient.createLesson(data);
        showNotification('Занятие добавлено', 'success');
        closeModal(modal);
        renderSchedule(user, container);
      } catch (error) {
        showNotification('Ошибка при добавлении занятия', 'error');
      }
    }
  });
  
  // Загружаем список учеников
  window.apiClient.getStudents().then(result => {
    const studentSelect = form.querySelector('#student_id');
    if (studentSelect && result.students) {
      result.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.first_name} ${student.last_name}`;
        studentSelect.appendChild(option);
      });
    }
  });
  
  const modal = createModal({
    title: 'Добавить занятие',
    content: form.outerHTML,
    onClose: () => closeModal(modal)
  });
  
  document.body.appendChild(modal);
}

function showEditLessonModal(lesson, user, container) {
  // Аналогично showAddLessonModal, но с предзаполненными данными
  showNotification('Редактирование в разработке', 'info');
}

