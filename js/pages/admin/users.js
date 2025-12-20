import { createCard } from '../../dashboard/components/Card.js';
import { createButton } from '../../dashboard/components/Button.js';
import { createTable } from '../../dashboard/components/Table.js';
import { createModal } from '../../dashboard/components/Modal.js';
import { getRoleLabel, showNotification } from '../../dashboard/utils.js';

export default async function renderUsers(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const users = await window.apiClient.getAllUsers();
    
    const table = createTable({
      headers: ['Имя', 'Email', 'Роль', 'Действия'],
      data: users.map(u => [
        u.name,
        u.email,
        getRoleLabel(u.role),
        createButton('Изменить роль', {
          onClick: () => showChangeRoleModal(u, container),
          variant: 'outline',
          size: 'sm'
        }).outerHTML
      ])
    });
    
    const card = createCard({
      title: 'Пользователи',
      content: table.outerHTML
    });
    
    container.innerHTML = '';
    container.appendChild(card);
  } catch (error) {
    console.error('Error loading users:', error);
    container.innerHTML = '<div class="error">Ошибка загрузки пользователей</div>';
  }
}

function showChangeRoleModal(user, container) {
  const form = document.createElement('form');
  form.className = 'shadcn-form';
  form.innerHTML = `
    <div class="form-group">
      <label>Роль</label>
      <select id="role-select" class="shadcn-input">
        <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Учитель</option>
        <option value="student" ${user.role === 'student' ? 'selected' : ''}>Ученик</option>
        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Администратор</option>
      </select>
    </div>
    <button type="submit" class="shadcn-button">Сохранить</button>
  `;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newRole = form.querySelector('#role-select').value;
    try {
      await window.apiClient.updateUserRole(user.id, newRole);
      showNotification('Роль обновлена', 'success');
      renderUsers(user, container);
    } catch (error) {
      showNotification('Ошибка при обновлении роли', 'error');
    }
  });
  
  const modal = createModal({
    title: `Изменить роль пользователя ${user.name}`,
    content: form.outerHTML
  });
  
  document.body.appendChild(modal);
}

