// Глобальные переменные
let lessons = [];
let students = [];
let filteredLessons = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentView = 'table';
let sortField = 'date';
let sortDirection = 'desc';

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLessonsHistory();
});

// Основная функция инициализации
function initLessonsHistory() {
    loadStudents();
    loadLessons();
    generateTestData();
    initEventListeners();
    updateStatistics();
    applyFilters();
    
    // Скрываем состояние загрузки
    setTimeout(() => {
        document.getElementById('loading-state').style.display = 'none';
    }, 1000);
}

// Загрузка учеников из localStorage
function loadStudents() {
    try {
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
            students = JSON.parse(storedStudents);
        }
    } catch (error) {
        console.error('Error loading students:', error);
        students = [];
    }
    updateStudentFilter();
}

// Загрузка уроков из localStorage
function loadLessons() {
    try {
        const storedLessons = localStorage.getItem('lessons');
        if (storedLessons) {
            lessons = JSON.parse(storedLessons);
        }
    } catch (error) {
        console.error('Error loading lessons:', error);
        lessons = [];
    }
}

// Генерация тестовых данных для демонстрации
function generateTestData() {
    // Если уроков нет, создаем тестовые данные
    if (lessons.length === 0) {
        const testLessons = [
            {
                id: 1,
                studentId: 1,
                studentName: 'Александр Петров',
                grade: 9,
                date: new Date(2024, 10, 20, 15, 0).toISOString(),
                duration: 60,
                type: 'regular',
                topic: 'Алгебраические уравнения',
                price: 1800,
                status: 'completed',
                paymentStatus: 'paid',
                results: {
                    rating: 4,
                    progress: 85,
                    notes: 'Хорошо усвоил материал, нужно больше практики'
                }
            },
            {
                id: 2,
                studentId: 2,
                studentName: 'Елена Козлова',
                grade: 8,
                date: new Date(2024, 10, 21, 16, 30).toISOString(),
                duration: 60,
                type: 'regular',
                topic: 'Геометрические фигуры',
                price: 1800,
                status: 'completed',
                paymentStatus: 'paid',
                results: {
                    rating: 5,
                    progress: 90,
                    notes: 'Отличная работа, активное участие'
                }
            },
            {
                id: 3,
                studentId: 3,
                studentName: 'Михаил Новиков',
                grade: 11,
                date: new Date(2024, 10, 22, 18, 0).toISOString(),
                duration: 90,
                type: 'exam',
                topic: 'Подготовка к ЕГЭ: производные',
                price: 3300,
                status: 'completed',
                paymentStatus: 'paid',
                results: {
                    rating: 4,
                    progress: 75,
                    notes: 'Нуждается в дополнительной практике по сложным задачам'
                }
            },
            {
                id: 4,
                studentId: 1,
                studentName: 'Александр Петров',
                grade: 9,
                date: new Date(2024, 10, 23, 15, 0).toISOString(),
                duration: 60,
                type: 'regular',
                topic: 'Системы уравнений',
                price: 1800,
                status: 'cancelled',
                paymentStatus: 'unpaid',
                results: null
            },
            {
                id: 5,
                studentId: 4,
                studentName: 'Мария Иванова',
                grade: 7,
                date: new Date(2024, 10, 24, 14, 0).toISOString(),
                duration: 60,
                type: 'trial',
                topic: 'Пробное занятие: основы алгебры',
                price: 0,
                status: 'completed',
                paymentStatus: 'unpaid',
                results: {
                    rating: 5,
                    progress: 80,
                    notes: 'Отличное начало, рекомендуем продолжить'
                }
            },
            {
                id: 6,
                studentId: 2,
                studentName: 'Елена Козлова',
                grade: 8,
                date: new Date(2024, 10, 25, 16, 30).toISOString(),
                duration: 60,
                type: 'regular',
                topic: 'Тригонометрия: основы',
                price: 1800,
                status: 'scheduled',
                paymentStatus: 'unpaid',
                results: null
            }
        ];
        
        lessons = testLessons;
        localStorage.setItem('lessons', JSON.stringify(lessons));
    }
    
    // Если учеников нет, создаем тестовых учеников
    if (students.length === 0) {
        const testStudents = [
            {
                id: 1,
                name: 'Александр Петров',
                grade: 9,
                phone: '+7 (999) 123-45-67',
                email: 'alexander@example.com',
                status: 'active',
                tariff: 'standard',
                createdDate: new Date(2024, 9, 1).toISOString()
            },
            {
                id: 2,
                name: 'Елена Козлова',
                grade: 8,
                phone: '+7 (999) 234-56-78',
                email: 'elena@example.com',
                status: 'active',
                tariff: 'standard',
                createdDate: new Date(2024, 9, 5).toISOString()
            },
            {
                id: 3,
                name: 'Михаил Новиков',
                grade: 11,
                phone: '+7 (999) 345-67-89',
                email: 'mikhail@example.com',
                status: 'active',
                tariff: 'ege',
                createdDate: new Date(2024, 9, 10).toISOString()
            },
            {
                id: 4,
                name: 'Мария Иванова',
                grade: 7,
                phone: '+7 (999) 456-78-90',
                email: 'maria@example.com',
                status: 'trial',
                tariff: 'basic',
                createdDate: new Date(2024, 10, 20).toISOString()
            }
        ];
        
        students = testStudents;
        localStorage.setItem('students', JSON.stringify(students));
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Поиск
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    // Фильтры
    const dateFrom = document.getElementById('date-from');
    const dateTo = document.getElementById('date-to');
    const studentFilter = document.getElementById('student-filter');
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (dateFrom) dateFrom.addEventListener('change', applyFilters);
    if (dateTo) dateTo.addEventListener('change', applyFilters);
    if (studentFilter) studentFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    
    // Сортировка
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const value = this.value.split('-');
            sortField = value[0];
            sortDirection = value[1];
            applyFilters();
        });
    }
    
    // Переключение вида
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            switchView(currentView);
        });
    });
    
    // Сброс фильтров
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Экспорт
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', showExportModal);
    }
    
    // Добавление урока
    const addLessonBtn = document.getElementById('add-lesson-btn');
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', function() {
            window.location.href = 'lesson-form.html';
        });
    }
    
    // Модальное окно экспорта
    initExportModal();
    
    // Мобильное меню
    initMobileMenu();
    
    // Выход
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Обновление фильтра учеников
function updateStudentFilter() {
    const studentFilter = document.getElementById('student-filter');
    if (!studentFilter) return;
    
    // Сохраняем текущее значение
    const currentValue = studentFilter.value;
    
    // Очищаем и заполняем заново
    studentFilter.innerHTML = '<option value="">Все ученики</option>';
    
    const uniqueStudents = [...new Map(lessons.map(lesson => 
        [lesson.studentId, { id: lesson.studentId, name: lesson.studentName }]
    )).values()];
    
    uniqueStudents.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        studentFilter.appendChild(option);
    });
    
    // Восстанавливаем значение
    studentFilter.value = currentValue;
}

// Применение фильтров
function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const dateFrom = document.getElementById('date-from')?.value;
    const dateTo = document.getElementById('date-to')?.value;
    const studentId = document.getElementById('student-filter')?.value;
    const status = document.getElementById('status-filter')?.value;
    const type = document.getElementById('type-filter')?.value;
    
    // Фильтруем уроки
    filteredLessons = lessons.filter(lesson => {
        // Поиск
        if (searchTerm && !lesson.studentName.toLowerCase().includes(searchTerm) && 
            !lesson.topic.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Дата начала
        if (dateFrom && new Date(lesson.date) < new Date(dateFrom + 'T00:00:00')) {
            return false;
        }
        
        // Дата окончания
        if (dateTo && new Date(lesson.date) > new Date(dateTo + 'T23:59:59')) {
            return false;
        }
        
        // Ученик
        if (studentId && lesson.studentId != studentId) {
            return false;
        }
        
        // Статус
        if (status && lesson.status !== status) {
            return false;
        }
        
        // Тип
        if (type && lesson.type !== type) {
            return false;
        }
        
        return true;
    });
    
    // Сортировка
    sortLessons();
    
    // Отображение
    currentPage = 1;
    displayLessons();
    updatePagination();
}

// Сортировка уроков
function sortLessons() {
    filteredLessons.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortField) {
            case 'date':
                aValue = new Date(a.date);
                bValue = new Date(b.date);
                break;
            case 'student':
                aValue = a.studentName.toLowerCase();
                bValue = b.studentName.toLowerCase();
                break;
            case 'price':
                aValue = a.price || 0;
                bValue = b.price || 0;
                break;
            case 'rating':
                aValue = a.results?.rating || 0;
                bValue = b.results?.rating || 0;
                break;
            default:
                return 0;
        }
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

// Отображение уроков
function displayLessons() {
    if (currentView === 'table') {
        displayTable();
    } else {
        displayCards();
    }
    
    // Показываем/скрываем пустое состояние
    const emptyState = document.getElementById('empty-state');
    const tableView = document.getElementById('table-view');
    const cardsView = document.getElementById('cards-view');
    
    if (filteredLessons.length === 0) {
        emptyState.style.display = 'flex';
        tableView.style.display = 'none';
        cardsView.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        tableView.style.display = currentView === 'table' ? 'block' : 'none';
        cardsView.style.display = currentView === 'cards' ? 'grid' : 'none';
    }
}

// Отображение таблицы
function displayTable() {
    const tbody = document.getElementById('lessons-table-body');
    if (!tbody) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageLessons = filteredLessons.slice(start, end);
    
    tbody.innerHTML = pageLessons.map(lesson => {
        const date = new Date(lesson.date);
        const student = students.find(s => s.id == lesson.studentId);
        
        return `
            <tr>
                <td>${formatDate(date)}</td>
                <td>${formatTime(date)}</td>
                <td>
                    <a href="student-details.html?id=${lesson.studentId}" class="student-link">
                        ${lesson.studentName}
                    </a>
                </td>
                <td>${lesson.grade} класс</td>
                <td>${getTypeText(lesson.type)}</td>
                <td>${lesson.topic || 'Без темы'}</td>
                <td>${lesson.duration} мин</td>
                <td>${lesson.price || 0} ₽</td>
                <td>${lesson.results ? getRatingStars(lesson.results.rating) : '-'}</td>
                <td><span class="status-badge ${lesson.status}">${getStatusText(lesson.status)}</span></td>
                <td>
                    <div class="lesson-actions">
                        <button class="btn btn-sm btn-outline" onclick="viewLesson(${lesson.id})" title="Просмотр">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline" onclick="editLesson(${lesson.id})" title="Редактировать">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Отображение карточек
function displayCards() {
    const grid = document.getElementById('lessons-cards-grid');
    if (!grid) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageLessons = filteredLessons.slice(start, end);
    
    grid.innerHTML = pageLessons.map(lesson => {
        const date = new Date(lesson.date);
        
        return `
            <div class="lesson-card">
                <div class="lesson-card-header">
                    <div class="lesson-date">${formatDate(date)}</div>
                    <div class="lesson-time">${formatTime(date)}</div>
                </div>
                <div class="lesson-card-body">
                    <h4 class="lesson-student">${lesson.studentName}</h4>
                    <p class="lesson-grade">${lesson.grade} класс</p>
                    <p class="lesson-topic">${lesson.topic || 'Без темы'}</p>
                    <div class="lesson-details">
                        <span class="lesson-detail">${getTypeText(lesson.type)}</span>
                        <span class="lesson-detail">${lesson.duration} мин</span>
                    </div>
                </div>
                <div class="lesson-card-footer">
                    <div class="lesson-price">${lesson.price || 0} ₽</div>
                    <div class="rating-stars">
                        ${lesson.results ? getRatingStars(lesson.results.rating) : '<i class="fas fa-star"></i>'.repeat(5)}
                    </div>
                </div>
                <div class="lesson-card-actions">
                    <button class="btn btn-sm btn-outline" onclick="viewLesson(${lesson.id})">
                        <i class="fas fa-eye"></i> Просмотр
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editLesson(${lesson.id})">
                        <i class="fas fa-edit"></i> Изменить
                    </button>
                </div>
                <div style="padding: 0 16px 16px;">
                    <span class="status-badge ${lesson.status}">${getStatusText(lesson.status)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Обновление пагинации
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Кнопка "Назад"
    html += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Номера страниц
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    // Кнопка "Вперед"
    html += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = html;
}

// Изменение страницы
function changePage(page) {
    currentPage = page;
    displayLessons();
    updatePagination();
    
    // Прокрутка к началу таблицы
    const container = document.querySelector('.dashboard-content');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Переключение вида
function switchView(view) {
    const tableView = document.getElementById('table-view');
    const cardsView = document.getElementById('cards-view');
    
    if (view === 'table') {
        tableView.style.display = 'block';
        cardsView.style.display = 'none';
    } else {
        tableView.style.display = 'none';
        cardsView.style.display = 'grid';
    }
    
    displayLessons();
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('date-from').value = '';
    document.getElementById('date-to').value = '';
    document.getElementById('student-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('type-filter').value = '';
    document.getElementById('sort-select').value = 'date-desc';
    
    sortField = 'date';
    sortDirection = 'desc';
    
    applyFilters();
}

// Обновление статистики
function updateStatistics() {
    const completedLessons = lessons.filter(l => l.status === 'completed');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    // Всего уроков
    document.getElementById('total-lessons').textContent = completedLessons.length;
    
    // Уроки за месяц
    const thisMonthLessons = completedLessons.filter(l => {
        const date = new Date(l.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const lastMonthLessons = completedLessons.filter(l => {
        const date = new Date(l.date);
        return date.getMonth() === lastMonth && date.getFullYear() === lastYear;
    });
    
    const lessonsChange = thisMonthLessons.length - lastMonthLessons.length;
    const lessonsChangeElement = document.getElementById('lessons-change');
    lessonsChangeElement.innerHTML = `
        <i class="fas fa-arrow-${lessonsChange >= 0 ? 'up' : 'down'}"></i> 
        <span>${lessonsChange >= 0 ? '+' : ''}${lessonsChange}</span> за месяц
    `;
    lessonsChangeElement.className = `stat-change ${lessonsChange >= 0 ? 'positive' : 'negative'}`;
    
    // Общий доход
    const totalIncome = completedLessons.reduce((sum, l) => sum + (l.price || 0), 0);
    document.getElementById('total-income').textContent = `${totalIncome.toLocaleString()} ₽`;
    
    // Доход за месяц
    const thisMonthIncome = thisMonthLessons.reduce((sum, l) => sum + (l.price || 0), 0);
    const lastMonthIncome = lastMonthLessons.reduce((sum, l) => sum + (l.price || 0), 0);
    
    const incomeChangePercent = lastMonthIncome > 0 ? 
        Math.round((thisMonthIncome - lastMonthIncome) / lastMonthIncome * 100) : 0;
    const incomeChangeElement = document.getElementById('income-change');
    incomeChangeElement.innerHTML = `
        <i class="fas fa-arrow-${incomeChangePercent >= 0 ? 'up' : 'down'}"></i> 
        <span>${incomeChangePercent >= 0 ? '+' : ''}${incomeChangePercent}%</span> к прошлому месяцу
    `;
    incomeChangeElement.className = `stat-change ${incomeChangePercent >= 0 ? 'positive' : 'negative'}`;
    
    // Средняя оценка
    const ratedLessons = completedLessons.filter(l => l.results?.rating);
    const avgRating = ratedLessons.length > 0 ? 
        (ratedLessons.reduce((sum, l) => sum + l.results.rating, 0) / ratedLessons.length).toFixed(1) : '0.0';
    document.getElementById('avg-rating').textContent = avgRating;
    document.getElementById('rating-change').innerHTML = `
        <i class="fas fa-star"></i> 
        <span>${ratedLessons.length}</span> оценок
    `;
    
    // Активные ученики
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeStudents = new Set(
        completedLessons
            .filter(l => new Date(l.date) >= thirtyDaysAgo)
            .map(l => l.studentId)
    ).size;
    
    document.getElementById('active-students').textContent = activeStudents;
}

// Модальное окно экспорта
function initExportModal() {
    const exportModal = document.getElementById('export-modal');
    const closeBtn = document.getElementById('export-modal-close');
    const cancelBtn = document.getElementById('cancel-export-btn');
    const exportOptions = exportModal?.querySelectorAll('.export-option');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideExportModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideExportModal);
    }
    
    if (exportOptions) {
        exportOptions.forEach(option => {
            option.addEventListener('click', function() {
                const format = this.dataset.format;
                exportLessons(format);
                hideExportModal();
            });
        });
    }
    
    // Закрытие по клику вне модального окна
    exportModal?.addEventListener('click', function(e) {
        if (e.target === exportModal) {
            hideExportModal();
        }
    });
}

function showExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideExportModal() {
    const modal = document.getElementById('export-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Экспорт уроков
function exportLessons(format) {
    const data = filteredLessons.map(lesson => ({
        'Дата': formatDate(new Date(lesson.date)),
        'Время': formatTime(new Date(lesson.date)),
        'Ученик': lesson.studentName,
        'Класс': lesson.grade,
        'Тип урока': getTypeText(lesson.type),
        'Тема': lesson.topic || '',
        'Длительность': lesson.duration + ' мин',
        'Стоимость': lesson.price || 0,
        'Оценка': lesson.results?.rating || '',
        'Прогресс': lesson.results?.progress + '%' || '',
        'Статус': getStatusText(lesson.status)
    }));
    
    switch (format) {
        case 'csv':
            exportToCSV(data);
            break;
        case 'pdf':
            exportToPDF(data);
            break;
        case 'json':
            exportToJSON(data);
            break;
    }
}

// Экспорт в CSV
function exportToCSV(data) {
    if (data.length === 0) {
        showToast('Нет данных для экспорта', 'error');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'lessons-history.csv', 'text/csv');
    showToast('Данные экспортированы в CSV', 'success');
}

// Экспорт в PDF (упрощенная версия)
function exportToPDF(data) {
    if (data.length === 0) {
        showToast('Нет данных для экспорта', 'error');
        return;
    }
    
    // В реальном приложении здесь будет использована библиотека для генерации PDF
    // Сейчас просто создаем текстовое представление
    let pdfContent = 'История уроков\n\n';
    pdfContent += 'Дата: ' + new Date().toLocaleDateString('ru-RU') + '\n\n';
    
    data.forEach((lesson, index) => {
        pdfContent += `${index + 1}. ${lesson['Дата']} ${lesson['Время']} - ${lesson['Ученик']}\n`;
        pdfContent += `   Класс: ${lesson['Класс']}, Тип: ${lesson['Тип урока']}\n`;
        pdfContent += `   Тема: ${lesson['Тема']}\n`;
        pdfContent += `   Длительность: ${lesson['Длительность']}, Стоимость: ${lesson['Стоимость']} ₽\n`;
        pdfContent += `   Оценка: ${lesson['Оценка']}, Прогресс: ${lesson['Прогресс']}\n`;
        pdfContent += `   Статус: ${lesson['Статус']}\n\n`;
    });
    
    downloadFile(pdfContent, 'lessons-history.txt', 'text/plain');
    showToast('Данные экспортированы в текстовый формат', 'success');
}

// Экспорт в JSON
function exportToJSON(data) {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'lessons-history.json', 'application/json');
    showToast('Данные экспортированы в JSON', 'success');
}

// Скачивание файла
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Действия с уроками
function viewLesson(lessonId) {
    window.location.href = `lesson-details.html?id=${lessonId}`;
}

function editLesson(lessonId) {
    window.location.href = `lesson-form.html?id=${lessonId}`;
}

// Вспомогательные функции
function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function getTypeText(type) {
    const types = {
        'regular': 'Обычный урок',
        'trial': 'Пробное занятие',
        'exam': 'Подготовка к экзамену'
    };
    return types[type] || type;
}

function getStatusText(status) {
    const statuses = {
        'completed': 'Проведено',
        'cancelled': 'Отменено',
        'scheduled': 'Запланировано'
    };
    return statuses[status] || status;
}

function getRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'active' : ''}"></i>`;
    }
    return stars;
}

// Debounce функция
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

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            if (sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                removeOverlay();
            } else {
                sidebar.classList.add('mobile-open');
                createOverlay();
            }
        });
    }
    
    // Закрытие мобильного меню при клике на пункт меню
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                removeOverlay();
            }
        });
    });
}

function createOverlay() {
    // Проверяем, существует ли уже оверлей
    if (document.querySelector('.mobile-menu-overlay')) {
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: block;
    `;
    
    // Добавляем обработчик клика для закрытия меню
    overlay.addEventListener('click', () => {
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            removeOverlay();
        }
    });
    
    document.body.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Выход из системы
function logout() {
    if (confirm('Вы уверены что хотите выйти из системы?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Проверка авторизации
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Обновляем информацию о пользователе
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    
    if (userName) userName.textContent = currentUser.name;
    if (userAvatar) {
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        userAvatar.textContent = initials;
    }
    
    return true;
}

// Инициализация проверки авторизации
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
});