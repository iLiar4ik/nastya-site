// Глобальные переменные для расписания
let currentView = 'month';
let currentDate = new Date();
let selectedDate = new Date();
let lessons = [];
let students = [];
let filters = {
    student: '',
    status: '',
    type: ''
};

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initSchedule();
});

// Основная функция инициализации
async function initSchedule() {
    loadUserData();
    await loadStudents();
    await loadLessons();
    initCalendar();
    initFilters();
    initEventListeners();
    initThemeToggle();
    updateStats();
    renderLessons();
}

// Загрузка учеников из API
async function loadStudents() {
    try {
        const result = await window.apiClient.getStudents({ limit: 100 });
        students = result.students || [];
        populateStudentFilter();
    } catch (error) {
        console.error('Error loading students:', error);
        students = [];
    }
}

// Загрузка занятий из API
async function loadLessons() {
    try {
        // Загружаем занятия на текущий месяц
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const result = await window.apiClient.getSchedule(startDate, endDate);
        lessons = result.lessons || [];
    } catch (error) {
        console.error('Error loading lessons:', error);
        lessons = [];
    }
}

// Генерация тестовых учеников
function generateTestStudents() {
    return [
        {
            id: 1,
            name: 'Александр Петров',
            grade: '9',
            phone: '+7 (999) 123-45-67',
            email: 'alex.petrov@example.com',
            tariff: 'Подготовка к ОГЭ',
            tariffPrice: 1500,
            status: 'active'
        },
        {
            id: 2,
            name: 'Мария Иванова',
            grade: '7',
            phone: '+7 (999) 234-56-78',
            email: 'maria.ivanova@example.com',
            tariff: 'Стандартный курс',
            tariffPrice: 1200,
            status: 'active'
        },
        {
            id: 3,
            name: 'Дмитрий Сидоров',
            grade: '11',
            phone: '+7 (999) 345-67-89',
            email: 'dmitry.sidorov@example.com',
            tariff: 'Подготовка к ЕГЭ',
            tariffPrice: 1800,
            status: 'active'
        },
        {
            id: 4,
            name: 'Елена Козлова',
            grade: '8',
            phone: '+7 (999) 456-78-90',
            email: 'elena.kozlova@example.com',
            tariff: 'Стандартный курс',
            tariffPrice: 1200,
            status: 'trial'
        },
        {
            id: 5,
            name: 'Михаил Новиков',
            grade: '10',
            phone: '+7 (999) 567-89-01',
            email: 'mikhail.novikov@example.com',
            tariff: 'Подготовка к ЕГЭ',
            tariffPrice: 1800,
            status: 'active'
        }
    ];
}

// Генерация тестовых занятий
function generateTestLessons() {
    const today = new Date();
    const lessons = [];
    
    // Создаем занятия на текущий месяц
    for (let i = 0; i < 20; i++) {
        const lessonDate = new Date(today);
        lessonDate.setDate(today.getDate() + (i - 10));
        
        // Пропускаем выходные
        if (lessonDate.getDay() === 0 || lessonDate.getDay() === 6) {
            continue;
        }
        
        // Случайный ученик
        const student = students[Math.floor(Math.random() * students.length)];
        
        // Случайное время
        const hour = 15 + Math.floor(Math.random() * 4);
        const minute = Math.random() > 0.5 ? 0 : 30;
        lessonDate.setHours(hour, minute, 0, 0);
        
        // Случайный статус
        const statuses = ['scheduled', 'completed', 'cancelled'];
        const status = lessonDate < today ? 
            statuses[Math.floor(Math.random() * 2)] : // Для прошедших дат только completed или cancelled
            'scheduled'; // Для будущих дат только scheduled
        
        lessons.push({
            id: i + 1,
            studentId: student.id,
            studentName: student.name,
            studentGrade: student.grade,
            date: lessonDate.toISOString(),
            duration: 60,
            type: Math.random() > 0.3 ? 'online' : 'offline',
            status: status,
            topic: generateRandomTopic(student.grade),
            price: student.tariffPrice,
            paymentStatus: status === 'completed' ? 
                (Math.random() > 0.2 ? 'paid' : 'unpaid') : 'unpaid',
            homework: status === 'completed' ? generateRandomHomework() : '',
            teacherNotes: status === 'completed' ? generateRandomNotes() : ''
        });
    }
    
    return lessons;
}

// Генерация случайной темы занятия
function generateRandomTopic(grade) {
    const topics = {
        '5': ['Сложение и вычитание дробей', 'Умножение и деление дробей', 'Десятичные дроби'],
        '6': ['Пропорции', 'Проценты', 'Отрицательные числа', 'Координаты на плоскости'],
        '7': ['Линейные уравнения', 'Степени', 'Многочлены', 'Формулы сокращенного умножения'],
        '8': ['Квадратные уравнения', 'Системы уравнений', 'Неравенства', 'Квадратичная функция'],
        '9': ['Подготовка к ОГЭ', 'Теория вероятностей', 'Статистика', 'Арифметическая прогрессия'],
        '10': ['Тригонометрия', 'Логарифмы', 'Производные', 'Интегралы'],
        '11': ['Подготовка к ЕГЭ', 'Сложные уравнения', 'Стереометрия', 'Экономические задачи']
    };
    
    const gradeTopics = topics[grade] || topics['7'];
    return gradeTopics[Math.floor(Math.random() * gradeTopics.length)];
}

// Генерация случайного домашнего задания
function generateRandomHomework() {
    const homeworks = [
        'Решить задачи №15-20 из учебника',
        'Повторить формулы сокращенного умножения',
        'Выполнить упражнения из рабочей тетради',
        'Подготовиться к контрольной работе',
        'Решить онлайн-тест на платформе'
    ];
    
    return homeworks[Math.floor(Math.random() * homeworks.length)];
}

// Генерация случайных заметок
function generateRandomNotes() {
    const notes = [
        'Ученик хорошо справляется с материалом',
        'Нуждаются в дополнительной практике',
        'Проявляет интерес к предмету',
        'Требуется больше внимания к деталям',
        'Отличный прогресс за последнее время'
    ];
    
    return notes[Math.floor(Math.random() * notes.length)];
}

// Инициализация календаря
function initCalendar() {
    updateCalendarHeader();
    renderCalendar();
}

// Обновление заголовка календаря
function updateCalendarHeader() {
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    const title = document.getElementById('calendar-title');
    if (title) {
        title.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
}

// Отрисовка календаря
function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    // Очищаем календарь
    calendarGrid.innerHTML = '';
    
    // Добавляем названия дней недели
    const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    weekdays.forEach(day => {
        const weekdayElement = document.createElement('div');
        weekdayElement.className = 'calendar-weekday';
        weekdayElement.textContent = day;
        calendarGrid.appendChild(weekdayElement);
    });
    
    // Получаем первый день месяца
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Определяем день недели для первого числа (0 - воскресенье, 1 - понедельник)
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Воскенье = 7 для нашего формата
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 1; i < firstDayOfWeek; i++) {
        const dayElement = createDayElement(
            new Date(firstDay.getFullYear(), firstDay.getMonth(), -firstDayOfWeek + i + 1),
            true
        );
        calendarGrid.appendChild(dayElement);
    }
    
    // Добавляем дни текущего месяца
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = createDayElement(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
            false
        );
        calendarGrid.appendChild(dayElement);
    }
    
    // Добавляем дни следующего месяца для заполнения сетки
    const totalCells = calendarGrid.children.length - 7; // Вычитаем дни недели
    const remainingCells = totalCells % 7;
    if (remainingCells > 0) {
        for (let i = 1; i <= 7 - remainingCells; i++) {
            const dayElement = createDayElement(
                new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
                true
            );
            calendarGrid.appendChild(dayElement);
        }
    }
}

// Создание элемента дня календаря
function createDayElement(date, isOtherMonth) {
const dayElement = document.createElement('div');
dayElement.className = 'calendar-day';

if (isOtherMonth) {
    dayElement.classList.add('other-month');
}

// Проверяем, является ли день сегодня
const today = new Date();
if (date.toDateString() === today.toDateString()) {
    dayElement.classList.add('today');
}

// Проверяем, является ли день выбранным
if (date.toDateString() === selectedDate.toDateString()) {
    dayElement.classList.add('selected');
}

// Проверяем, есть ли занятия в этот день
const dayLessons = getLessonsForDate(date);
if (dayLessons.length > 0) {
    dayElement.classList.add('has-lessons');
}

// Добавляем номер дня
const dayNumber = document.createElement('div');
dayNumber.className = 'calendar-day-number';
dayNumber.textContent = date.getDate();
dayElement.appendChild(dayNumber);

// Добавляем информацию о занятиях
if (dayLessons.length > 0) {
    const lessonsInfo = document.createElement('div');
    lessonsInfo.className = 'calendar-day-lessons';
    lessonsInfo.textContent = `${dayLessons.length} занят.`;
    dayElement.appendChild(lessonsInfo);
}

// Добавляем обработчик клика с анимацией
dayElement.addEventListener('click', function() {
    // Добавляем анимацию при клике
    dayElement.style.transform = 'scale(0.95)';
    setTimeout(() => {
        selectDate(date);
        dayElement.style.transform = '';
    }, 100);
});

// Добавляем hover эффект с анимацией
dayElement.addEventListener('mouseenter', function() {
    if (!dayElement.classList.contains('other-month')) {
        dayElement.style.transform = 'scale(1.05)';
    }
});

dayElement.addEventListener('mouseleave', function() {
    if (!dayElement.classList.contains('selected')) {
        dayElement.style.transform = '';
    }
});

return dayElement;
}

// Выбор даты
function selectDate(date) {
    selectedDate = new Date(date);
    renderCalendar();
    renderLessons();
    updateLessonsTitle();
}

// Получение занятий для указанной даты
function getLessonsForDate(date) {
    return lessons.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        return lessonDate.toDateString() === date.toDateString();
    });
}

// Инициализация фильтров
function initFilters() {
    populateStudentFilter();
}

// Заполнение фильтра учеников
function populateStudentFilter() {
    const studentFilter = document.getElementById('student-filter');
    if (!studentFilter) return;
    
    // Очищаем фильтр
    studentFilter.innerHTML = '<option value="">Все ученики</option>';
    
    // Добавляем учеников
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        studentFilter.appendChild(option);
    });
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Переключение видов
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });
    
    // Навигация по календарю
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayBtn = document.getElementById('today-btn');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            navigateMonth(-1);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            navigateMonth(1);
        });
    }
    
    if (todayBtn) {
        todayBtn.addEventListener('click', function() {
            navigateToToday();
        });
    }
    
    // Фильтры
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // Кнопки добавления занятия
    const addLessonBtn = document.getElementById('add-lesson-btn');
    const emptyAddLessonBtn = document.getElementById('empty-add-lesson-btn');
    
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', function() {
            openLessonForm();
        });
    }
    
    if (emptyAddLessonBtn) {
        emptyAddLessonBtn.addEventListener('click', function() {
            openLessonForm();
        });
    }
    
    // Кнопка экспорта
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportSchedule();
        });
    }
    
    // Кнопка выхода
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
}

// Переключение вида (месяц/неделя/день)
function switchView(view) {
    currentView = view;
    
    // Обновляем активную кнопку с анимацией
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.view === view) {
            // Добавляем анимацию
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.classList.add('active');
                button.style.transform = 'scale(1)';
            }, 150);
        }
    });
    
    // Обновляем отображение с анимацией
    const calendarContainer = document.querySelector('.calendar-container');
    const lessonsList = document.querySelector('.lessons-list');
    
    if (calendarContainer && lessonsList) {
        // Анимация перехода
        calendarContainer.style.opacity = '0.5';
        lessonsList.style.opacity = '0.5';
        
        setTimeout(() => {
            if (view === 'month') {
                calendarContainer.style.display = 'block';
                lessonsList.style.display = 'block';
                renderCalendar();
            } else if (view === 'week') {
                calendarContainer.style.display = 'block';
                lessonsList.style.display = 'block';
                renderWeekView();
            } else if (view === 'day') {
                calendarContainer.style.display = 'none';
                lessonsList.style.display = 'block';
                renderDayView();
            }
            
            calendarContainer.style.opacity = '1';
            lessonsList.style.opacity = '1';
        }, 200);
    }
    
    renderLessons();
    updateLessonsTitle();
}

// Навигация по месяцам
function navigateMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    updateCalendarHeader();
    renderCalendar();
}

// Переход к сегодняшнему дню
function navigateToToday() {
    // Добавляем анимацию при переходе к сегодняшнему дню
    const calendarGrid = document.getElementById('calendar-grid');
    if (calendarGrid) {
        calendarGrid.style.opacity = '0.5';
        calendarGrid.style.transform = 'scale(0.95)';
    }
    
    setTimeout(() => {
        currentDate = new Date();
        selectedDate = new Date();
        updateCalendarHeader();
        renderCalendar();
        renderLessons();
        updateLessonsTitle();
        
        if (calendarGrid) {
            calendarGrid.style.opacity = '1';
            calendarGrid.style.transform = 'scale(1)';
        }
    }, 300);
}

// Применение фильтров
function applyFilters() {
    const studentFilter = document.getElementById('student-filter');
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    
    filters.student = studentFilter ? studentFilter.value : '';
    filters.status = statusFilter ? statusFilter.value : '';
    filters.type = typeFilter ? typeFilter.value : '';
    
    renderLessons();
    updateLessonsTitle();
}

// Сброс фильтров
function resetFilters() {
    filters = {
        student: '',
        status: '',
        type: ''
    };
    
    const studentFilter = document.getElementById('student-filter');
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (studentFilter) studentFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (typeFilter) typeFilter.value = '';
    
    renderLessons();
    updateLessonsTitle();
}

// Отрисовка занятий
function renderLessons() {
    const container = document.getElementById('lessons-container');
    const emptyState = document.getElementById('empty-state');
    
    if (!container) return;
    
    // Получаем отфильтрованные занятия
    let filteredLessons = getFilteredLessons();
    
    // Сортируем занятия по дате и времени
    filteredLessons.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    if (filteredLessons.length === 0) {
        container.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    
    // Добавляем карточки занятий
    filteredLessons.forEach(lesson => {
        const lessonCard = createLessonCard(lesson);
        container.appendChild(lessonCard);
    });
}

// Получение отфильтрованных занятий
function getFilteredLessons() {
    let filtered = [...lessons];
    
    // Фильтр по дате (в зависимости от вида)
    if (currentView === 'day') {
        filtered = filtered.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            return lessonDate.toDateString() === selectedDate.toDateString();
        });
    } else if (currentView === 'week') {
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        filtered = filtered.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            return lessonDate >= weekStart && lessonDate <= weekEnd;
        });
    } else if (currentView === 'month') {
        filtered = filtered.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            return lessonDate.getMonth() === currentDate.getMonth() &&
                   lessonDate.getFullYear() === currentDate.getFullYear();
        });
    }
    
    // Фильтр по ученику
    if (filters.student) {
        filtered = filtered.filter(lesson => lesson.studentId == filters.student);
    }
    
    // Фильтр по статусу
    if (filters.status) {
        filtered = filtered.filter(lesson => lesson.status === filters.status);
    }
    
    // Фильтр по типу
    if (filters.type) {
        filtered = filtered.filter(lesson => lesson.type === filters.type);
    }
    
    return filtered;
}

// Создание карточки занятия
function createLessonCard(lesson) {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    
    // Добавляем классы в зависимости от статуса и типа
    if (lesson.type === 'online') {
        card.classList.add('online');
    }
    
    if (lesson.status === 'cancelled') {
        card.classList.add('cancelled');
    } else if (lesson.status === 'completed') {
        card.classList.add('completed');
    }
    
    const lessonDate = new Date(lesson.date);
    const timeString = formatTime(lessonDate);
    const durationString = formatDuration(lesson.duration);
    
    card.innerHTML = `
        <div class="lesson-header">
            <div>
                <div class="lesson-time">${timeString}</div>
                <div class="lesson-duration">${durationString}</div>
            </div>
            <div class="lesson-status ${lesson.status}">
                <i class="fas fa-${getStatusIcon(lesson.status)}"></i>
                ${getStatusText(lesson.status)}
            </div>
        </div>
        <div class="lesson-info">
            <div class="lesson-student">${lesson.studentName}</div>
            <div class="lesson-topic">${lesson.topic || 'Без темы'}</div>
            <div class="lesson-type">
                <i class="fas fa-${lesson.type === 'online' ? 'laptop' : 'map-marker-alt'}"></i>
                ${lesson.type === 'online' ? 'Онлайн' : 'Офлайн'}
            </div>
        </div>
        <div class="lesson-actions">
            <button class="btn-edit" onclick="openLessonDetails(${lesson.id})">
                <i class="fas fa-eye"></i> Детали
            </button>
            ${lesson.status === 'scheduled' ? `
                <button class="btn-complete" onclick="completeLesson(${lesson.id})">
                    <i class="fas fa-check"></i> Провести
                </button>
                <button class="btn-cancel" onclick="cancelLesson(${lesson.id})">
                    <i class="fas fa-times"></i> Отменить
                </button>
            ` : ''}
            ${lesson.status === 'completed' ? `
                <button class="btn-edit" onclick="editLesson(${lesson.id})">
                    <i class="fas fa-edit"></i> Изменить
                </button>
            ` : ''}
        </div>
    `;
    
    // Добавляем обработчик клика на карточку с анимацией
    card.addEventListener('click', function(e) {
        // Если клик не по кнопкам действий, открываем детали
        if (!e.target.closest('.lesson-actions')) {
            // Добавляем анимацию
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px -5px rgb(0 0 0 / 0.15)';
            
            setTimeout(() => {
                openLessonDetails(lesson.id);
                card.style.transform = '';
                card.style.boxShadow = '';
            }, 150);
        }
    });
    
    // Добавляем hover эффекты
    card.addEventListener('mouseenter', function() {
        if (!card.classList.contains('cancelled')) {
            this.style.transform = 'translateY(-3px)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    return card;
}

// Получение иконки для статуса
function getStatusIcon(status) {
    const icons = {
        'scheduled': 'clock',
        'completed': 'check-circle',
        'cancelled': 'times-circle'
    };
    return icons[status] || 'clock';
}

// Форматирование времени
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Форматирование длительности
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} мин.`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? 
            `${hours} ч. ${remainingMinutes} мин.` : 
            `${hours} ч.`;
    }
}

// Получение текста статуса
function getStatusText(status) {
    const statusTexts = {
        'scheduled': 'Запланировано',
        'completed': 'Проведено',
        'cancelled': 'Отменено'
    };
    
    return statusTexts[status] || status;
}

// Обновление заголовка списка занятий
function updateLessonsTitle() {
    const title = document.getElementById('lessons-title');
    if (!title) return;
    
    let titleText = '';
    
    if (currentView === 'day') {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        titleText = `Занятия на ${selectedDate.toLocaleDateString('ru-RU', options)}`;
    } else if (currentView === 'week') {
        titleText = 'Занятия на неделе';
    } else if (currentView === 'month') {
        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        titleText = `Занятия за ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    title.textContent = titleText;
}

// Обновление статистики
function updateStats() {
    const today = new Date();
    const todayLessons = getLessonsForDate(today);
    
    // Занятия сегодня
    const todayLessonsElement = document.getElementById('today-lessons');
    if (todayLessonsElement) {
        todayLessonsElement.textContent = todayLessons.length;
    }
    
    // Занятия на неделе
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        return lessonDate >= weekStart && lessonDate <= weekEnd;
    });
    
    const weekLessonsElement = document.getElementById('week-lessons');
    if (weekLessonsElement) {
        weekLessonsElement.textContent = weekLessons.length;
    }
    
    // Занятия в месяце
    const monthLessons = lessons.filter(lesson => {
        const lessonDate = new Date(lesson.date);
        return lessonDate.getMonth() === today.getMonth() &&
               lessonDate.getFullYear() === today.getFullYear();
    });
    
    const monthLessonsElement = document.getElementById('month-lessons');
    if (monthLessonsElement) {
        monthLessonsElement.textContent = monthLessons.length;
    }
    
    // Доход за месяц
    const monthIncome = monthLessons
        .filter(lesson => lesson.status === 'completed' && lesson.paymentStatus === 'paid')
        .reduce((total, lesson) => total + (lesson.price || 0), 0);
    
    const monthIncomeElement = document.getElementById('month-income');
    if (monthIncomeElement) {
        monthIncomeElement.textContent = `${monthIncome.toLocaleString('ru-RU')} ₽`;
    }
}

// Открытие формы занятия
function openLessonForm(lessonId = null) {
    const url = lessonId ? 
        `lesson-form.html?id=${lessonId}` : 
        `lesson-form.html?date=${selectedDate.toISOString()}`;
    
    window.location.href = url;
}

// Открытие деталей занятия
function openLessonDetails(lessonId) {
    window.location.href = `lesson-details.html?id=${lessonId}`;
}

// Редактирование занятия
function editLesson(lessonId) {
    window.location.href = `lesson-form.html?id=${lessonId}`;
}

// Проведение занятия
function completeLesson(lessonId) {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    // Обновляем статус через API
    window.apiClient.updateLesson(lessonId, { status: 'completed' })
        .then(() => {
            // Перезагружаем уроки
            loadLessons().then(() => {
                renderLessons();
                updateStats();
                showNotification('Занятие отмечено как проведенное', 'success');
            });
        })
        .catch(error => {
            console.error('Error updating lesson:', error);
            showNotification('Ошибка обновления занятия', 'error');
        });
}

// Отмена занятия
function cancelLesson(lessonId) {
    if (!confirm('Вы уверены, что хотите отменить это занятие?')) {
        return;
    }
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    
    // Обновляем статус через API
    window.apiClient.updateLesson(lessonId, { status: 'cancelled' })
        .then(() => {
            // Перезагружаем уроки
            loadLessons().then(() => {
                renderLessons();
                updateStats();
                showNotification('Занятие отменено', 'success');
            });
        })
        .catch(error => {
            console.error('Error cancelling lesson:', error);
            showNotification('Ошибка отмены занятия', 'error');
        });
}

// Экспорт расписания
function exportSchedule() {
    const filteredLessons = getFilteredLessons();
    
    if (filteredLessons.length === 0) {
        showNotification('Нет занятий для экспорта', 'error');
        return;
    }
    
    // Создаем CSV
    let csv = 'Дата,Время,Ученик,Класс,Тема,Длительность,Тип,Статус,Стоимость\n';
    
    filteredLessons.forEach(lesson => {
        const date = new Date(lesson.date);
        const dateString = date.toLocaleDateString('ru-RU');
        const timeString = formatTime(date);
        
        csv += `${dateString},${timeString},${lesson.studentName},${lesson.studentGrade},"${lesson.topic || ''}",${lesson.duration},${lesson.type},${getStatusText(lesson.status)},${lesson.price || 0}\n`;
    });
    
    // Создаем blob и скачиваем
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `schedule_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Расписание успешно экспортировано', 'success');
}

// Выход из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти из системы?')) {
        // В реальном приложении здесь будет выход из системы
        window.location.href = 'login.html';
    }
}

// Переключение мобильного меню
function toggleMobileMenu() {
    const sidebar = document.querySelector('.schedule-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
        
        // Добавляем оверлей при открытом меню
        if (sidebar.classList.contains('mobile-open')) {
            createOverlay();
        } else {
            removeOverlay();
        }
    }
}

// Функция создания оверлея
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: none;
    `;
    
    document.body.appendChild(overlay);
    
    // Показываем оверлей с анимацией
    setTimeout(() => {
        overlay.style.display = 'block';
    }, 10);
    
    // Закрытие меню при клике на оверлей
    overlay.addEventListener('click', function() {
        const sidebar = document.querySelector('.schedule-sidebar');
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
            removeOverlay();
        }
    });
}

// Функция удаления оверлея
function removeOverlay() {
    const overlay = document.querySelector('.mobile-menu-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Закрытие меню при клике на пункт меню
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 767) {
                const sidebar = document.querySelector('.schedule-sidebar');
                if (sidebar) {
                    sidebar.classList.remove('mobile-open');
                    removeOverlay();
                }
            }
        });
    });
});

// Показ уведомления
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = notification.querySelector('.notification-message');
    
    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        
        // Устанавливаем цвет в зависимости от типа
        notification.style.backgroundColor = type === 'error' ? '#F44336' : '#4CAF50';
        
        notification.classList.add('show');
        
        // Автоматически скрываем уведомление через 5 секунд
        setTimeout(() => {
            hideNotification();
        }, 5000);
    }
}

// Скрытие уведомления
function hideNotification() {
    const notification = document.getElementById('notification');
    
    if (notification) {
        notification.classList.remove('show');
    }
}

// Закрытие уведомления по клику
document.addEventListener('DOMContentLoaded', function() {
    const notificationClose = document.querySelector('.notification-close');
    
    if (notificationClose) {
        notificationClose.addEventListener('click', function() {
            hideNotification();
        });
    }
});

// Функции для отображения недели и дня (заглушки, можно реализовать позже)
function renderWeekView() {
    // Заглушка для отображения недели
    console.log('Week view not implemented yet');
}

function renderDayView() {
    // Заглушка для отображения дня
    console.log('Day view not implemented yet');
}