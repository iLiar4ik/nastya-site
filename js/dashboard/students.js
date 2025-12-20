/**
 * Страница управления учениками
 */

import { utils } from './utils.js';

let students = [];
let filteredStudents = [];
let currentPage = 1;
const perPage = 12;

document.addEventListener('DOMContentLoaded', async () => {
  await loadStudents();
  renderPage();
});

/**
 * Загрузить учеников
 */
async function loadStudents() {
  try {
    const result = await window.apiClient.getStudents({ limit: 1000 });
    students = result.students || [];
    filteredStudents = students;
  } catch (error) {
    console.error('Error loading students:', error);
    window.Dashboard.showNotification('Ошибка загрузки учеников', 'error');
    students = [];
    filteredStudents = [];
  }
}

/**
 * Отобразить страницу
 */
function renderPage() {
  const content = document.getElementById('dashboard-content');
  if (!content) return;

  content.innerHTML = '';

  // Заголовок и действия
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '2rem';
  header.style.flexWrap = 'wrap';
  header.style.gap = '1rem';

  const title = document.createElement('h1');
  title.className = 'dashboard-title';
  title.style.margin = 0;
  title.textContent = 'Управление учениками';
  header.appendChild(title);

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '1rem';
  actions.style.alignItems = 'center';

  // Поиск
  const searchBox = document.createElement('div');
  searchBox.style.position = 'relative';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'shadcn-input';
  searchInput.placeholder = 'Поиск...';
  searchInput.style.paddingRight = '2.5rem';
  searchInput.addEventListener('input', utils.debounce((e) => {
    filterStudents(e.target.value);
  }, 300));
  searchBox.appendChild(searchInput);
  const searchIcon = document.createElement('i');
  searchIcon.className = 'fas fa-search';
  searchIcon.style.position = 'absolute';
  searchIcon.style.right = '0.75rem';
  searchIcon.style.top = '50%';
  searchIcon.style.transform = 'translateY(-50%)';
  searchIcon.style.color = 'hsl(var(--shadcn-muted-foreground))';
  searchBox.appendChild(searchIcon);
  actions.appendChild(searchBox);

  // Кнопка добавления
  const addBtn = document.createElement('button');
  addBtn.className = 'shadcn-btn shadcn-btn-primary';
  addBtn.innerHTML = '<i class="fas fa-plus"></i> Добавить ученика';
  addBtn.addEventListener('click', () => {
    window.location.href = 'student-form.html';
  });
  actions.appendChild(addBtn);

  header.appendChild(actions);
  content.appendChild(header);

  // Статистика
  renderStats(content);

  // Сетка учеников
  const grid = document.createElement('div');
  grid.className = 'students-grid';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
  grid.style.gap = '1.5rem';
  grid.style.marginTop = '2rem';

  if (filteredStudents.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
        <i class="fas fa-users" style="font-size: 4rem; color: hsl(var(--shadcn-muted-foreground)); margin-bottom: 1rem;"></i>
        <h3>Нет учеников</h3>
        <p style="color: hsl(var(--shadcn-muted-foreground));">Добавьте первого ученика</p>
      </div>
    `;
  } else {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageStudents = filteredStudents.slice(start, end);

    pageStudents.forEach(student => {
      const card = createStudentCard(student);
      grid.appendChild(card);
    });
  }

  content.appendChild(grid);

  // Пагинация
  if (filteredStudents.length > perPage) {
    renderPagination(content);
  }
}

/**
 * Отобразить статистику
 */
function renderStats(container) {
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    trial: students.filter(s => s.status === 'trial').length,
    inactive: students.filter(s => s.status === 'inactive').length
  };

  const statsContainer = document.createElement('div');
  statsContainer.className = 'dashboard-cards';
  statsContainer.style.marginBottom = '2rem';

  const totalCard = createStatCard(stats.total, 'Всего', 'fas fa-users');
  statsContainer.appendChild(totalCard);

  const activeCard = createStatCard(stats.active, 'Активные', 'fas fa-check-circle', 'success');
  statsContainer.appendChild(activeCard);

  const trialCard = createStatCard(stats.trial, 'Пробные', 'fas fa-hourglass-half', 'warning');
  statsContainer.appendChild(trialCard);

  const inactiveCard = createStatCard(stats.inactive, 'Неактивные', 'fas fa-times-circle', 'error');
  statsContainer.appendChild(inactiveCard);

  container.appendChild(statsContainer);
}

/**
 * Создать карточку статистики
 */
function createStatCard(value, label, icon, type = 'primary') {
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

  card.appendChild(content);
  return card;
}

/**
 * Создать карточку ученика
 */
function createStudentCard(student) {
  const card = document.createElement('div');
  card.className = 'shadcn-card';
  card.style.cursor = 'pointer';
  card.style.transition = 'transform 0.2s, box-shadow 0.2s';
  card.addEventListener('click', () => {
    window.location.href = `student-details.html?id=${student.id}`;
  });
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    card.style.boxShadow = '';
  });

  const content = document.createElement('div');
  content.className = 'shadcn-card-content';

  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '1rem';

  const name = document.createElement('h3');
  name.style.margin = 0;
  name.textContent = `${student.first_name || ''} ${student.last_name || ''}`.trim();
  header.appendChild(name);

  const status = document.createElement('span');
  status.className = `shadcn-badge student-status ${student.status}`;
  status.textContent = utils.getStatusText(student.status);
  header.appendChild(status);

  content.appendChild(header);

  const info = document.createElement('div');
  info.style.display = 'flex';
  info.style.flexDirection = 'column';
  info.style.gap = '0.5rem';

  if (student.grade) {
    const grade = document.createElement('div');
    grade.style.display = 'flex';
    grade.style.alignItems = 'center';
    grade.style.gap = '0.5rem';
    grade.style.color = 'hsl(var(--shadcn-muted-foreground))';
    grade.innerHTML = `<i class="fas fa-graduation-cap"></i> <span>${student.grade} класс</span>`;
    info.appendChild(grade);
  }

  if (student.tariff) {
    const tariff = document.createElement('div');
    tariff.style.display = 'flex';
    tariff.style.alignItems = 'center';
    tariff.style.gap = '0.5rem';
    tariff.style.color = 'hsl(var(--shadcn-muted-foreground))';
    tariff.innerHTML = `<i class="fas fa-tag"></i> <span>${utils.getTariffText(student.tariff)}</span>`;
    info.appendChild(tariff);
  }

  if (student.phone) {
    const phone = document.createElement('div');
    phone.style.display = 'flex';
    phone.style.alignItems = 'center';
    phone.style.gap = '0.5rem';
    phone.style.color = 'hsl(var(--shadcn-muted-foreground))';
    phone.innerHTML = `<i class="fas fa-phone"></i> <span>${student.phone}</span>`;
    info.appendChild(phone);
  }

  content.appendChild(info);
  card.appendChild(content);
  return card;
}

/**
 * Фильтровать учеников
 */
function filterStudents(search) {
  if (!search.trim()) {
    filteredStudents = students;
  } else {
    const query = search.toLowerCase();
    filteredStudents = students.filter(s => {
      const name = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
      const email = (s.email || '').toLowerCase();
      const phone = (s.phone || '').toLowerCase();
      return name.includes(query) || email.includes(query) || phone.includes(query);
    });
  }
  currentPage = 1;
  renderPage();
}

/**
 * Отобразить пагинацию
 */
function renderPagination(container) {
  const totalPages = Math.ceil(filteredStudents.length / perPage);
  const pagination = document.createElement('div');
  pagination.style.display = 'flex';
  pagination.style.justifyContent = 'center';
  pagination.style.gap = '0.5rem';
  pagination.style.marginTop = '2rem';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'shadcn-btn shadcn-btn-outline';
  prevBtn.textContent = 'Назад';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
    }
  });
  pagination.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `shadcn-btn ${i === currentPage ? 'shadcn-btn-primary' : 'shadcn-btn-outline'}`;
      pageBtn.textContent = i;
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderPage();
      });
      pagination.appendChild(pageBtn);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      ellipsis.style.padding = '0 0.5rem';
      pagination.appendChild(ellipsis);
    }
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'shadcn-btn shadcn-btn-outline';
  nextBtn.textContent = 'Вперед';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPage();
    }
  });
  pagination.appendChild(nextBtn);

  container.appendChild(pagination);
}

