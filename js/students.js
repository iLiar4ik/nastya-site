// JavaScript для управления учениками
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных
    let students = [];
    let filteredStudents = [];
    let currentPage = 1;
    const studentsPerPage = 9;
    let currentFilters = {
        search: '',
        grade: '',
        status: ''
    };

    // Элементы DOM
    const studentsGrid = document.getElementById('students-grid');
    const emptyState = document.getElementById('empty-state');
    const pagination = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const filterBtn = document.getElementById('filter-btn');
    const filtersSection = document.getElementById('filters-section');
    const gradeFilter = document.getElementById('grade-filter');
    const statusFilter = document.getElementById('status-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const addStudentBtn = document.getElementById('add-student-btn');
    const emptyAddStudentBtn = document.getElementById('empty-add-student-btn');

    // Элементы статистики
    const totalStudentsEl = document.getElementById('total-students');
    const activeStudentsEl = document.getElementById('active-students');
    const trialStudentsEl = document.getElementById('trial-students');
    const newStudentsEl = document.getElementById('new-students');

    // Инициализация при загрузке страницы
    init();

    async function init() {
        loadUserData();
        await loadStudents();
        setupEventListeners();
        renderStudents();
        await updateStatistics();
    }

    // Загрузка данных пользователя
    function loadUserData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            
            if (userAvatar) {
                userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
            }
            
            if (userName) {
                userName.textContent = currentUser.name;
            }
        } else {
            // Если пользователь не авторизован, перенаправляем на страницу входа
            window.location.href = 'login.html';
        }
    }

    // Загрузка учеников из API
    async function loadStudents() {
        try {
            const filters = {
                page: currentPage,
                limit: studentsPerPage,
                search: currentFilters.search,
                grade: currentFilters.grade,
                status: currentFilters.status
            };
            
            const result = await window.apiClient.getStudents(filters);
            students = result.students || [];
            
            // Инициализируем отфильтрованный список
            filteredStudents = [...students];
            
            // Обновляем пагинацию если нужно
            if (result.pagination) {
                updatePagination(result.pagination);
            }
        } catch (error) {
            console.error('Error loading students:', error);
            students = [];
            filteredStudents = [];
            showNotification('Ошибка загрузки учеников', 'error');
        }
    }

    // Генерация тестовых данных
    function generateTestStudents() {
        const firstNames = ['Александр', 'Мария', 'Дмитрий', 'Елена', 'Михаил', 'Анна', 'Иван', 'Ольга', 'Сергей', 'Татьяна'];
        const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Козлов', 'Новиков', 'Морозов', 'Волков', 'Зайцев', 'Федоров', 'Егоров'];
        const statuses = ['active', 'trial', 'inactive'];
        const grades = ['5', '6', '7', '8', '9', '10', '11'];
        const tariffs = ['standard', 'oge', 'ege', 'intensive'];
        
        const testStudents = [];
        
        for (let i = 0; i < 15; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const grade = grades[Math.floor(Math.random() * grades.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const tariff = tariffs[Math.floor(Math.random() * tariffs.length)];
            
            const birthYear = new Date().getFullYear() - (12 + parseInt(grade));
            const birthMonth = Math.floor(Math.random() * 12) + 1;
            const birthDay = Math.floor(Math.random() * 28) + 1;
            const birthDate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
            
            const createdDate = new Date();
            createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));
            
            testStudents.push({
                id: Date.now() + i,
                firstName,
                lastName,
                grade,
                birthDate,
                phone: `+7 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                address: `ул. ${['Ленина', 'Советская', 'Мира', 'Пушкина', 'Гагарина'][Math.floor(Math.random() * 5)]}, д. ${Math.floor(Math.random() * 50) + 1}, кв. ${Math.floor(Math.random() * 100) + 1}`,
                parentName: `${['Иван', 'Петр', 'Сергей', 'Алексей'][Math.floor(Math.random() * 4)]} ${lastName}`,
                parentPhone: `+7 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 90) + 10}`,
                parentEmail: `parent.${lastName.toLowerCase()}@example.com`,
                status,
                tariff,
                notes: `Ученик ${grade} класса, изучает математику. ${status === 'trial' ? 'Пробное занятие.' : 'Регулярные занятия.'}`,
                createdDate: createdDate.toISOString(),
                lessons: generateTestLessons(5 + Math.floor(Math.random() * 10)),
                finance: {
                    paidLessons: Math.floor(Math.random() * 20),
                    balance: Math.floor(Math.random() * 5000) - 1000,
                    totalIncome: Math.floor(Math.random() * 20000)
                }
            });
        }
        
        return testStudents;
    }

    // Генерация тестовых занятий
    function generateTestLessons(count) {
        const lessons = [];
        const topics = [
            'Дроби и действия с ними',
            'Уравнения с одной переменной',
            'Геометрические фигуры',
            'Системы уравнений',
            'Квадратные уравнения',
            'Тригонометрия',
            'Производные',
            'Интегралы',
            'Логарифмы',
            'Степени и корни'
        ];
        
        for (let i = 0; i < count; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i * 7);
            
            lessons.push({
                id: Date.now() + i,
                date: date.toISOString(),
                topic: topics[Math.floor(Math.random() * topics.length)],
                duration: [60, 90, 120][Math.floor(Math.random() * 3)],
                status: ['completed', 'missed', 'cancelled'][Math.floor(Math.random() * 3)],
                homework: Math.random() > 0.5,
                rating: Math.floor(Math.random() * 5) + 1
            });
        }
        
        return lessons;
    }

    // Сохранение ученика через API
    async function saveStudent(studentData) {
        try {
            if (studentData.id) {
                // Обновление существующего ученика
                await window.apiClient.updateStudent(studentData.id, studentData);
            } else {
                // Создание нового ученика
                await window.apiClient.createStudent(studentData);
            }
            // Перезагружаем список
            await loadStudents();
        } catch (error) {
            console.error('Error saving student:', error);
            throw error;
        }
    }
    
    // Удаление ученика через API
    async function deleteStudent(id) {
        try {
            await window.apiClient.deleteStudent(id);
            // Перезагружаем список
            await loadStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
            throw error;
        }
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Поиск
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }

        // Фильтры
        if (filterBtn) {
            filterBtn.addEventListener('click', toggleFilters);
        }

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyFilters);
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', resetFilters);
        }

        // Добавление ученика
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => {
                window.location.href = 'student-form.html';
            });
        }

        if (emptyAddStudentBtn) {
            emptyAddStudentBtn.addEventListener('click', () => {
                window.location.href = 'student-form.html';
            });
        }

        // Выход из системы
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }

        // Мобильное меню
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        }
    }

    // Обработка поиска
    function handleSearch() {
        currentFilters.search = searchInput.value.toLowerCase();
        applyFilters();
    }

    // Переключение фильтров
    function toggleFilters() {
        if (filtersSection.style.display === 'none') {
            filtersSection.style.display = 'block';
            filterBtn.classList.add('active');
        } else {
            filtersSection.style.display = 'none';
            filterBtn.classList.remove('active');
        }
    }

    // Применение фильтров
    function applyFilters() {
        currentFilters.grade = gradeFilter.value;
        currentFilters.status = statusFilter.value;

        filteredStudents = students.filter(student => {
            const matchesSearch = !currentFilters.search || 
                student.firstName.toLowerCase().includes(currentFilters.search) ||
                student.lastName.toLowerCase().includes(currentFilters.search) ||
                student.phone.includes(currentFilters.search) ||
                (student.email && student.email.toLowerCase().includes(currentFilters.search));

            const matchesGrade = !currentFilters.grade || student.grade === currentFilters.grade;
            const matchesStatus = !currentFilters.status || student.status === currentFilters.status;

            return matchesSearch && matchesGrade && matchesStatus;
        });

        currentPage = 1;
        renderStudents();
        updateStatistics();
    }

    // Сброс фильтров
    function resetFilters() {
        currentFilters = {
            search: '',
            grade: '',
            status: ''
        };

        searchInput.value = '';
        gradeFilter.value = '';
        statusFilter.value = '';

        filteredStudents = [...students];
        currentPage = 1;
        renderStudents();
        updateStatistics();
    }

    // Отрисовка учеников
    function renderStudents() {
        if (filteredStudents.length === 0) {
            studentsGrid.style.display = 'none';
            emptyState.style.display = 'block';
            pagination.style.display = 'none';
            return;
        }

        studentsGrid.style.display = 'grid';
        emptyState.style.display = 'none';

        const startIndex = (currentPage - 1) * studentsPerPage;
        const endIndex = startIndex + studentsPerPage;
        const pageStudents = filteredStudents.slice(startIndex, endIndex);

        studentsGrid.innerHTML = pageStudents.map(student => createStudentCard(student)).join('');
        renderPagination();

        // Добавляем обработчики событий для карточек
        setupStudentCardEvents();
    }

    // Создание карточки ученика
    function createStudentCard(student) {
        const initials = `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase();
        const statusClass = student.status;
        const statusText = getStatusText(student.status);
        const tariffText = getTariffText(student.tariff);
        const age = calculateAge(student.birthDate);

        return `
            <div class="student-card" data-id="${student.id}">
                <div class="student-card-header">
                    <div class="student-avatar">${initials}</div>
                    <div class="student-status ${statusClass}">${statusText}</div>
                </div>
                <div class="student-name">${student.firstName} ${student.lastName}</div>
                <div class="student-grade">${student.grade} класс</div>
                <div class="student-contact">
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${student.phone}</span>
                    </div>
                    ${student.email ? `
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${student.email}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="student-actions">
                    <button class="btn-view" data-action="view" data-id="${student.id}">
                        <i class="fas fa-eye"></i> Просмотр
                    </button>
                    <button class="btn-edit" data-action="edit" data-id="${student.id}">
                        <i class="fas fa-edit"></i> Изменить
                    </button>
                    <button class="btn-delete" data-action="delete" data-id="${student.id}">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        `;
    }

    // Настройка событий для карточек учеников
    function setupStudentCardEvents() {
        const actionButtons = document.querySelectorAll('.student-actions button');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.getAttribute('data-action');
                const studentId = parseInt(this.getAttribute('data-id'));
                
                switch (action) {
                    case 'view':
                        viewStudent(studentId);
                        break;
                    case 'edit':
                        editStudent(studentId);
                        break;
                    case 'delete':
                        deleteStudentHandler(studentId);
                        break;
                }
            });
        });

        // Обработчик для всей карточки (переход к деталям)
        const studentCards = document.querySelectorAll('.student-card');
        studentCards.forEach(card => {
            card.addEventListener('click', function() {
                const studentId = parseInt(this.getAttribute('data-id'));
                viewStudent(studentId);
            });
        });
    }

    // Просмотр ученика
    function viewStudent(id) {
        window.location.href = `student-details.html?id=${id}`;
    }

    // Редактирование ученика
    function editStudent(id) {
        window.location.href = `student-form.html?id=${id}`;
    }

    // Удаление ученика (старая функция удалена, используется async версия выше)

    // Отрисовка пагинации
    function renderPagination() {
        const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        
        let paginationHTML = '';
        
        // Кнопка "Предыдущая"
        paginationHTML += `
            <button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                paginationHTML += `
                    <button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
                `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                paginationHTML += `<span>...</span>`;
            }
        }
        
        // Кнопка "Следующая"
        paginationHTML += `
            <button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        pagination.innerHTML = paginationHTML;
        
        // Добавляем обработчики для пагинации
        const paginationButtons = pagination.querySelectorAll('button[data-page]');
        paginationButtons.forEach(button => {
            button.addEventListener('click', function() {
                currentPage = parseInt(this.getAttribute('data-page'));
                renderStudents();
            });
        });
    }

    // Обновление статистики через API
    async function updateStatistics() {
        try {
            const statistics = await window.apiClient.getStudentStatistics();
            
            if (totalStudentsEl) totalStudentsEl.textContent = statistics.total || 0;
            if (activeStudentsEl) activeStudentsEl.textContent = statistics.active || 0;
            if (trialStudentsEl) trialStudentsEl.textContent = statistics.trial || 0;
            
            // Подсчет новых учеников за последний месяц
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const newStudents = filteredStudents.filter(s => {
                const createdDate = new Date(s.created_at || s.createdDate);
                return createdDate > oneMonthAgo;
            }).length;
            
            if (newStudentsEl) newStudentsEl.textContent = newStudents;
        } catch (error) {
            console.error('Error loading statistics:', error);
            // Fallback на локальную статистику
            const totalStudents = filteredStudents.length;
            const activeStudents = filteredStudents.filter(s => s.status === 'active').length;
            const trialStudents = filteredStudents.filter(s => s.status === 'trial').length;
            
            if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
            if (activeStudentsEl) activeStudentsEl.textContent = activeStudents;
            if (trialStudentsEl) trialStudentsEl.textContent = trialStudents;
        }
    }

    // Вспомогательные функции
    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }

    function getStatusText(status) {
        const statusMap = {
            'active': 'Активный',
            'trial': 'Пробное занятие',
            'inactive': 'Неактивный'
        };
        return statusMap[status] || status;
    }

    function getTariffText(tariff) {
        const tariffMap = {
            'standard': 'Стандартный курс',
            'oge': 'Подготовка к ОГЭ',
            'ege': 'Подготовка к ЕГЭ',
            'intensive': 'Интенсивный курс'
        };
        return tariffMap[tariff] || tariff;
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = notification.querySelector('.notification-message');
        
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.style.backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }
    }

    function logout() {
        if (confirm('Вы уверены, что хотите выйти из системы?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }

    function toggleMobileMenu() {
        const sidebar = document.querySelector('.students-sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn i');
        
        if (sidebar.style.display === 'none') {
            sidebar.style.display = 'block';
            menuBtn.classList.remove('fa-bars');
            menuBtn.classList.add('fa-times');
        } else {
            sidebar.style.display = 'none';
            menuBtn.classList.remove('fa-times');
            menuBtn.classList.add('fa-bars');
        }
    }

    // Функция для debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});