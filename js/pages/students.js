/**
 * Страница управления учениками
 */

import { initLayout } from '../dashboard/layout.js';
import { createStudentCard } from '../dashboard/components/StudentCard.js';
import { createStatCard } from '../dashboard/components/StatCard.js';
import { createModal } from '../dashboard/components/Modal.js';
import { debounce, showNotification, formatDate, getStatusText, getTariffText } from '../dashboard/utils.js';

let students = [];
let filteredStudents = [];
let currentPage = 1;
const studentsPerPage = 9;
let currentFilters = {
  search: '',
  grade: '',
  status: ''
};

/**
 * Инициализировать страницу students
 */
export async function initStudents() {
  await initLayout(null, async (user, content) => {
    try {
      // Создаем структуру страницы
      createStudentsPage(content);
      
      // Загружаем данные
      await loadStudents();
      await updateStatistics();
      renderStudents();
      setupEventListeners();
      
    } catch (error) {
      console.error('Error initializing students page:', error);
      showNotification('Ошибка загрузки данных', 'error');
    }
  });
}

/**
 * Создать структуру страницы
 */
function createStudentsPage(content) {
  // Заголовок и действия
  const titleSection = document.createElement('div');
  titleSection.className = 'students-title';
  
  const title = document.createElement('h1');
  title.textContent = 'Управление учениками';
  titleSection.appendChild(title);
  
  const actions = document.createElement('div');
  actions.className = 'students-actions';
  
  // Поиск
  const searchBox = document.createElement('div');
  searchBox.className = 'search-box';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.className = 'shadcn-input';
  searchInput.placeholder = 'Поиск учеников...';
  searchBox.appendChild(searchInput);
  const searchIcon = document.createElement('i');
  searchIcon.className = 'fas fa-search';
  searchBox.appendChild(searchIcon);
  actions.appendChild(searchBox);
  
  // Кнопка фильтра
  const filterBtn = document.createElement('button');
  filterBtn.className = 'filter-btn shadcn-btn shadcn-btn-outline';
  filterBtn.id = 'filter-btn';
  filterBtn.innerHTML = '<i class="fas fa-filter"></i> Фильтр';
  actions.appendChild(filterBtn);
  
  // Кнопка добавления
  const addBtn = document.createElement('button');
  addBtn.className = 'shadcn-btn shadcn-btn-primary';
  addBtn.id = 'add-student-btn';
  addBtn.innerHTML = '<i class="fas fa-plus"></i> Добавить ученика';
  actions.appendChild(addBtn);
  
  titleSection.appendChild(actions);
  content.appendChild(titleSection);
  
  // Статистика
  const statsContainer = document.createElement('div');
  statsContainer.className = 'students-stats';
  statsContainer.id = 'students-stats';
  content.appendChild(statsContainer);
  
  // Фильтры (скрыты по умолчанию)
  const filtersSection = document.createElement('div');
  filtersSection.className = 'filters-section';
  filtersSection.id = 'filters-section';
  filtersSection.style.display = 'none';
  
  const filtersContent = document.createElement('div');
  filtersContent.className = 'shadcn-card';
  filtersContent.innerHTML = `
    <div class="shadcn-card-content">
      <div class="shadcn-form-group">
        <label class="shadcn-label">Класс</label>
        <select id="grade-filter" class="shadcn-input">
          <option value="">Все классы</option>
          <option value="5">5 класс</option>
          <option value="6">6 класс</option>
          <option value="7">7 класс</option>
          <option value="8">8 класс</option>
          <option value="9">9 класс</option>
          <option value="10">10 класс</option>
          <option value="11">11 класс</option>
        </select>
      </div>
      <div class="shadcn-form-group">
        <label class="shadcn-label">Статус</label>
        <select id="status-filter" class="shadcn-input">
          <option value="">Все статусы</option>
          <option value="active">Активный</option>
          <option value="trial">Пробное занятие</option>
          <option value="inactive">Неактивный</option>
        </select>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 1rem;">
        <button id="apply-filters" class="shadcn-btn shadcn-btn-primary">Применить</button>
        <button id="reset-filters" class="shadcn-btn shadcn-btn-outline">Сбросить</button>
      </div>
    </div>
  `;
  filtersSection.appendChild(filtersContent);
  content.appendChild(filtersSection);
  
  // Сетка учеников
  const grid = document.createElement('div');
  grid.className = 'students-grid';
  grid.id = 'students-grid';
  content.appendChild(grid);
  
  // Пустое состояние
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.id = 'empty-state';
  emptyState.style.display = 'none';
  emptyState.innerHTML = `
    <i class="fas fa-users"></i>
    <h3>Нет учеников</h3>
    <p>Добавьте первого ученика, чтобы начать работу</p>
    <button id="empty-add-student-btn" class="shadcn-btn shadcn-btn-primary" style="margin-top: 1rem;">
      <i class="fas fa-plus"></i> Добавить ученика
    </button>
  `;
  content.appendChild(emptyState);
  
  // Пагинация
  const pagination = document.createElement('div');
  pagination.className = 'pagination';
  pagination.id = 'pagination';
  content.appendChild(pagination);
}

/**
 * Загрузить учеников
 */
async function loadStudents() {
  try {
    const result = await window.apiClient.getStudents({ limit: 1000 });
    students = result.students || [];
    applyFilters();
  } catch (error) {
    console.error('Error loading students:', error);
    showNotification('Ошибка загрузки учеников', 'error');
    students = [];
  }
}

/**
 * Применить фильтры
 */
function applyFilters() {
  filteredStudents = students.filter(student => {
    // Поиск
    if (currentFilters.search) {
      const search = currentFilters.search.toLowerCase();
      const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
      const email = (student.email || '').toLowerCase();
      const phone = (student.phone || '').toLowerCase();
      
      if (!fullName.includes(search) && !email.includes(search) && !phone.includes(search)) {
        return false;
      }
    }
    
    // Фильтр по классу
    if (currentFilters.grade && student.grade !== parseInt(currentFilters.grade)) {
      return false;
    }
    
    // Фильтр по статусу
    if (currentFilters.status && student.status !== currentFilters.status) {
      return false;
    }
    
    return true;
  });
  
  currentPage = 1;
  renderStudents();
}

/**
 * Обновить статистику
 */
async function updateStatistics() {
  try {
    const stats = await window.apiClient.getStudentStatistics();
    const statsContainer = document.getElementById('students-stats');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = '';
    
    const totalCard = createStatCard({
      value: stats.total || 0,
      label: 'Всего учеников',
      icon: 'fas fa-users'
    });
    statsContainer.appendChild(totalCard);
    
    const activeCard = createStatCard({
      value: stats.active || 0,
      label: 'Активные',
      icon: 'fas fa-check-circle',
      badgeType: 'success'
    });
    statsContainer.appendChild(activeCard);
    
    const trialCard = createStatCard({
      value: stats.trial || 0,
      label: 'Пробные',
      icon: 'fas fa-hourglass-half',
      badgeType: 'warning'
    });
    statsContainer.appendChild(trialCard);
    
    const newCard = createStatCard({
      value: stats.new || 0,
      label: 'Новые',
      icon: 'fas fa-user-plus',
      badgeType: 'primary'
    });
    statsContainer.appendChild(newCard);
    
  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

/**
 * Отобразить учеников
 */
function renderStudents() {
  const grid = document.getElementById('students-grid');
  const emptyState = document.getElementById('empty-state');
  const pagination = document.getElementById('pagination');
  
  if (!grid) return;
  
  grid.innerHTML = '';
  
  if (filteredStudents.length === 0) {
    grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    if (pagination) pagination.innerHTML = '';
    return;
  }
  
  grid.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';
  
  // Пагинация
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const pageStudents = filteredStudents.slice(startIndex, endIndex);
  
  // Отображаем учеников
  pageStudents.forEach(student => {
    const card = createStudentCard(student, (student) => {
      window.location.href = `student-details.html?id=${student.id}`;
    });
    grid.appendChild(card);
  });
  
  // Пагинация
  if (pagination && totalPages > 1) {
    pagination.innerHTML = '';
    
    // Кнопка "Назад"
    const prevBtn = document.createElement('button');
    prevBtn.className = 'shadcn-btn shadcn-btn-outline';
    prevBtn.textContent = 'Назад';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderStudents();
      }
    });
    pagination.appendChild(prevBtn);
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `shadcn-btn ${i === currentPage ? 'shadcn-btn-primary' : 'shadcn-btn-outline'}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          currentPage = i;
          renderStudents();
        });
        pagination.appendChild(pageBtn);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        ellipsis.style.padding = '0 0.5rem';
        pagination.appendChild(ellipsis);
      }
    }
    
    // Кнопка "Вперед"
    const nextBtn = document.createElement('button');
    nextBtn.className = 'shadcn-btn shadcn-btn-outline';
    nextBtn.textContent = 'Вперед';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderStudents();
      }
    });
    pagination.appendChild(nextBtn);
  } else if (pagination) {
    pagination.innerHTML = '';
  }
}

/**
 * Настроить обработчики событий
 */
function setupEventListeners() {
  // Поиск
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const debouncedSearch = debounce((value) => {
      currentFilters.search = value;
      applyFilters();
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
  }
  
  // Фильтры
  const filterBtn = document.getElementById('filter-btn');
  const filtersSection = document.getElementById('filters-section');
  if (filterBtn && filtersSection) {
    filterBtn.addEventListener('click', () => {
      filtersSection.style.display = filtersSection.style.display === 'none' ? 'block' : 'none';
    });
  }
  
  // Применить фильтры
  const applyFiltersBtn = document.getElementById('apply-filters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const gradeFilter = document.getElementById('grade-filter');
      const statusFilter = document.getElementById('status-filter');
      
      currentFilters.grade = gradeFilter?.value || '';
      currentFilters.status = statusFilter?.value || '';
      applyFilters();
      
      if (filtersSection) {
        filtersSection.style.display = 'none';
      }
    });
  }
  
  // Сбросить фильтры
  const resetFiltersBtn = document.getElementById('reset-filters');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      const gradeFilter = document.getElementById('grade-filter');
      const statusFilter = document.getElementById('status-filter');
      
      if (gradeFilter) gradeFilter.value = '';
      if (statusFilter) statusFilter.value = '';
      
      currentFilters.grade = '';
      currentFilters.status = '';
      applyFilters();
    });
  }
  
  // Добавить ученика
  const addStudentBtn = document.getElementById('add-student-btn');
  const emptyAddStudentBtn = document.getElementById('empty-add-student-btn');
  
  const handleAddStudent = () => {
    window.location.href = 'student-form.html';
  };
  
  if (addStudentBtn) {
    addStudentBtn.addEventListener('click', handleAddStudent);
  }
  if (emptyAddStudentBtn) {
    emptyAddStudentBtn.addEventListener('click', handleAddStudent);
  }
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStudents);
} else {
  initStudents();
}

