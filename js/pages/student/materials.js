import { createCard } from '../../dashboard/components/Card.js';
import { createButton } from '../../dashboard/components/Button.js';
import { formatDate } from '../../dashboard/utils.js';

export default async function renderMaterials(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const materials = await window.apiClient.getMaterialsByStudent(user.studentId || user.student_id);
    
    const card = createCard({
      title: 'Материалы',
      content: `
        <div class="materials-list">
          ${materials.length > 0 ? materials.map(material => `
            <div class="material-item">
              <div class="material-item-info">
                <h4>${material.title}</h4>
                <p>${material.description || ''}</p>
                <span class="material-meta">${formatDate(material.created_at)}</span>
              </div>
              <div class="material-item-actions">
                ${createButton('Скачать', {
                  onClick: () => window.apiClient.downloadMaterial(material.id),
                  icon: 'fas fa-download',
                  variant: 'outline'
                }).outerHTML}
              </div>
            </div>
          `).join('') : '<p>Нет доступных материалов</p>'}
        </div>
      `
    });
    
    container.innerHTML = '';
    container.appendChild(card);
  } catch (error) {
    console.error('Error loading materials:', error);
    container.innerHTML = '<div class="error">Ошибка загрузки материалов</div>';
  }
}

