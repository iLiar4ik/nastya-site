import { createCard } from '../../dashboard/components/Card.js';
import { createButton } from '../../dashboard/components/Button.js';
import { createTable } from '../../dashboard/components/Table.js';
import { showNotification } from '../../dashboard/utils.js';

export default async function renderStudents(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const result = await window.apiClient.getStudents({ page: 1, limit: 100 });
    const students = result.students || [];
    
    const table = createTable({
      headers: ['Имя', 'Класс', 'Статус', 'Тариф', 'Действия'],
      data: students.map(student => [
        `${student.first_name} ${student.last_name}`,
        student.grade,
        student.status,
        student.tariff,
        createButton('Изменить', { variant: 'outline', size: 'sm' }).outerHTML
      ])
    });
    
    const card = createCard({
      title: 'Ученики',
      content: `
        ${createButton('Добавить ученика', {
          onClick: () => showNotification('Добавление ученика в разработке', 'info'),
          icon: 'fas fa-plus'
        }).outerHTML}
        ${table.outerHTML}
      `
    });
    
    container.innerHTML = '';
    container.appendChild(card);
  } catch (error) {
    console.error('Error loading students:', error);
    container.innerHTML = '<div class="error">Ошибка загрузки учеников</div>';
  }
}

