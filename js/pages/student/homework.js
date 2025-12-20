import { createCard } from '../../dashboard/components/Card.js';
import { createBadge } from '../../dashboard/components/Badge.js';
import { formatDate, getHomeworkStatusText } from '../../dashboard/utils.js';

export default async function renderHomework(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const homework = await window.apiClient.getHomeworkByStudent(user.studentId || user.student_id);
    
    const card = createCard({
      title: 'Домашние задания',
      content: `
        <div class="homework-list">
          ${homework.length > 0 ? homework.map(hw => `
            <div class="homework-item">
              <div class="homework-item-header">
                <h4>${hw.title}</h4>
                ${createBadge(getHomeworkStatusText(hw.status), hw.status === 'done' ? 'success' : 'default').outerHTML}
              </div>
              <p>${hw.description || ''}</p>
              <div class="homework-item-footer">
                <span>Срок: ${formatDate(hw.due_date)}</span>
              </div>
            </div>
          `).join('') : '<p>Нет домашних заданий</p>'}
        </div>
      `
    });
    
    container.innerHTML = '';
    container.appendChild(card);
  } catch (error) {
    console.error('Error loading homework:', error);
    container.innerHTML = '<div class="error">Ошибка загрузки домашних заданий</div>';
  }
}

