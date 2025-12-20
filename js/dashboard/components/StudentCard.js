/**
 * Компонент StudentCard для карточек учеников
 */

import { getStatusText, getTariffText, formatDate } from '../utils.js';

/**
 * Создать карточку ученика
 * @param {Object} student - Данные ученика
 * @param {Function} onClick - Callback при клике
 * @returns {HTMLElement} - Элемент карточки
 */
export function createStudentCard(student, onClick) {
  const card = document.createElement('div');
  card.className = 'shadcn-card student-card';
  
  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => onClick(student));
  }
  
  const content = document.createElement('div');
  content.className = 'shadcn-card-content';
  
  // Заголовок с именем
  const header = document.createElement('div');
  header.className = 'student-card-header';
  
  const name = document.createElement('h3');
  name.className = 'student-card-name';
  name.textContent = `${student.first_name || ''} ${student.last_name || ''}`.trim();
  header.appendChild(name);
  
  const status = document.createElement('span');
  status.className = `shadcn-badge student-status ${student.status || 'active'}`;
  status.textContent = getStatusText(student.status || 'active');
  header.appendChild(status);
  
  content.appendChild(header);
  
  // Информация
  const info = document.createElement('div');
  info.className = 'student-card-info';
  
  if (student.grade) {
    const grade = document.createElement('div');
    grade.className = 'student-card-item';
    grade.innerHTML = `<i class="fas fa-graduation-cap"></i> <span>${student.grade} класс</span>`;
    info.appendChild(grade);
  }
  
  if (student.tariff) {
    const tariff = document.createElement('div');
    tariff.className = 'student-card-item';
    tariff.innerHTML = `<i class="fas fa-tag"></i> <span>${getTariffText(student.tariff)}</span>`;
    info.appendChild(tariff);
  }
  
  if (student.phone) {
    const phone = document.createElement('div');
    phone.className = 'student-card-item';
    phone.innerHTML = `<i class="fas fa-phone"></i> <span>${student.phone}</span>`;
    info.appendChild(phone);
  }
  
  if (student.email) {
    const email = document.createElement('div');
    email.className = 'student-card-item';
    email.innerHTML = `<i class="fas fa-envelope"></i> <span>${student.email}</span>`;
    info.appendChild(email);
  }
  
  if (student.created_at) {
    const created = document.createElement('div');
    created.className = 'student-card-item';
    created.innerHTML = `<i class="fas fa-calendar"></i> <span>${formatDate(student.created_at)}</span>`;
    info.appendChild(created);
  }
  
  content.appendChild(info);
  
  card.appendChild(content);
  return card;
}

