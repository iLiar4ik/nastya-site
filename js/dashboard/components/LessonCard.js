/**
 * Компонент LessonCard для карточек занятий
 */

import { formatDate, formatTime, getStatusText } from '../utils.js';

/**
 * Создать карточку занятия
 * @param {Object} lesson - Данные занятия
 * @param {Function} onClick - Callback при клике
 * @returns {HTMLElement} - Элемент карточки
 */
export function createLessonCard(lesson, onClick) {
  const card = document.createElement('div');
  card.className = 'shadcn-card lesson-card';
  
  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => onClick(lesson));
  }
  
  const content = document.createElement('div');
  content.className = 'shadcn-card-content';
  
  // Время и дата
  const timeSection = document.createElement('div');
  timeSection.className = 'lesson-card-time';
  
  if (lesson.date) {
    const date = document.createElement('div');
    date.className = 'lesson-card-date';
    date.textContent = formatDate(lesson.date);
    timeSection.appendChild(date);
  }
  
  if (lesson.time || lesson.date) {
    const time = document.createElement('div');
    time.className = 'lesson-card-time-value';
    time.textContent = lesson.time || formatTime(lesson.date);
    timeSection.appendChild(time);
  }
  
  content.appendChild(timeSection);
  
  // Информация о занятии
  const info = document.createElement('div');
  info.className = 'lesson-card-info';
  
  if (lesson.student) {
    const student = document.createElement('div');
    student.className = 'lesson-card-student';
    student.textContent = typeof lesson.student === 'string' 
      ? lesson.student 
      : `${lesson.student.first_name || ''} ${lesson.student.last_name || ''}`.trim();
    info.appendChild(student);
  }
  
  if (lesson.topic) {
    const topic = document.createElement('div');
    topic.className = 'lesson-card-topic';
    topic.textContent = lesson.topic;
    info.appendChild(topic);
  }
  
  if (lesson.type) {
    const type = document.createElement('div');
    type.className = 'lesson-card-type';
    type.textContent = lesson.type;
    info.appendChild(type);
  }
  
  if (lesson.duration) {
    const duration = document.createElement('div');
    duration.className = 'lesson-card-duration';
    duration.innerHTML = `<i class="fas fa-clock"></i> ${lesson.duration} мин`;
    info.appendChild(duration);
  }
  
  content.appendChild(info);
  
  // Статус
  if (lesson.status) {
    const status = document.createElement('div');
    status.className = 'lesson-card-status';
    const badge = document.createElement('span');
    badge.className = `shadcn-badge lesson-status ${lesson.status}`;
    badge.textContent = getStatusText(lesson.status);
    status.appendChild(badge);
    content.appendChild(status);
  }
  
  card.appendChild(content);
  return card;
}

