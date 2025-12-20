// Глобальные переменные для формы занятия
let currentLesson = null;
let students = [];
let lessons = [];
let isEditMode = false;
let autosaveTimeout = null;
let formDataChanges = {};

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLessonForm();
});

// Основная функция инициализации
function initLessonForm() {
    loadStudents();
    loadLessons();
    loadUserData();
    initFormElements();
    initEventListeners();
    
    // Проверяем, режим редактирования или создания
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');
    const dateParam = urlParams.get('date');
    
    if (lessonId) {
        isEditMode = true;
        loadLessonForEdit(lessonId);
        updateFormTitle('Редактирование занятия');
    } else {
        // Устанавливаем дату из параметра или текущую
        if (dateParam) {
            document.getElementById('lesson-date').value = dateParam.split('T')[0];
        } else {
            document.getElementById('lesson-date').value = new Date().toISOString().split('T')[0];
        }
        updateFormTitle('Добавление занятия');
    }
    
    // Добавляем анимации при загрузке
    animateFormElements();
}

// Инициализация темы
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Переключение темы
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Загрузка данных пользователя
function loadUserData() {
    try {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            const userNameElement = document.getElementById('user-name');
            const userAvatarElement = document.getElementById('user-avatar');
            
            if (userNameElement) {
                userNameElement.textContent = user.name || 'Преподаватель';
            }
            
            if (userAvatarElement) {
                userAvatarElement.textContent = user.name ? user.name.charAt(0).toUpperCase() : 'П';
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Загрузка учеников из localStorage
function loadStudents() {
    try {
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
            students = JSON.parse(storedStudents);
        } else {
            // Если нет сохраненных учеников, создаем тестовых
            students = generateTestStudents();
            localStorage.setItem('students', JSON.stringify(students));
        }
        populateStudentSelect();
    } catch (error) {
        console.error('Error loading students:', error);
        students = [];
    }
}

// Загрузка занятий из localStorage
function loadLessons() {
    try {
        const storedLessons = localStorage.getItem('lessons');
        if (storedLessons) {
            lessons = JSON.parse(storedLessons);
        } else {
            lessons = [];
        }
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

// Заполнение списка учеников
function populateStudentSelect() {
    const studentSelect = document.getElementById('student-select');
    if (!studentSelect) return;
    
    // Очищаем список
    studentSelect.innerHTML = '<option value="" disabled selected>Выберите ученика</option>';
    
    // Добавляем учеников
    students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.grade} класс)`;
        studentSelect.appendChild(option);
    });
}

// Инициализация элементов формы
function initFormElements() {
    // Устанавливаем минимальную дату - сегодня
    const dateInput = document.getElementById('lesson-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Устанавливаем время по умолчанию
    const timeInput = document.getElementById('lesson-time');
    if (timeInput && !timeInput.value) {
        timeInput.value = '15:00';
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Форма
    const form = document.getElementById('lesson-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Добавляем отслеживание изменений для автосохранения
        const formInputs = form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', handleFormInputChange);
        });
    }
    
    // Выбор ученика
    const studentSelect = document.getElementById('student-select');
    if (studentSelect) {
        studentSelect.addEventListener('change', handleStudentChange);
    }
    
    // Дата и время занятия
    const dateInput = document.getElementById('lesson-date');
    const timeInput = document.getElementById('lesson-time');
    if (dateInput) {
        dateInput.addEventListener('change', checkScheduleConflicts);
    }
    if (timeInput) {
        timeInput.addEventListener('change', checkScheduleConflicts);
    }
    
    // Длительность занятия
    const durationSelect = document.getElementById('lesson-duration');
    if (durationSelect) {
        durationSelect.addEventListener('change', updatePriceCalculator);
    }
    
    // Стоимость занятия
    const priceInput = document.getElementById('lesson-price');
    if (priceInput) {
        priceInput.addEventListener('input', updatePriceCalculator);
    }
    
    // Повторяющиеся занятия
    const repeatCheckbox = document.getElementById('repeat-lesson');
    if (repeatCheckbox) {
        repeatCheckbox.addEventListener('change', toggleRepeatOptions);
    }
    
    // Окончание повторений
    const repeatEndSelect = document.getElementById('repeat-end');
    if (repeatEndSelect) {
        repeatEndSelect.addEventListener('change', handleRepeatEndChange);
    }
    
    // Кнопки действий
    const cancelBtn = document.getElementById('cancel-btn');
    const copyBtn = document.getElementById('copy-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const ignoreConflictBtn = document.getElementById('ignore-conflict-btn');
    const rescheduleBtn = document.getElementById('reschedule-btn');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (hasUnsavedChanges()) {
                if (confirm('У вас есть несохраненные изменения. Вы уверены, что хотите выйти?')) {
                    window.location.href = 'schedule.html';
                }
            } else {
                window.location.href = 'schedule.html';
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyLesson);
    }
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', saveDraft);
    }
    
    if (ignoreConflictBtn) {
        ignoreConflictBtn.addEventListener('click', function() {
            hideConflictWarning();
            submitForm();
        });
    }
    
    if (rescheduleBtn) {
        rescheduleBtn.addEventListener('click', function() {
            hideConflictWarning();
            focusTimeField();
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

// Обработка изменений в форме для автосохранения
function handleFormInputChange(e) {
    const field = e.target;
    const fieldName = field.name || field.id;
    const fieldValue = field.type === 'checkbox' ? field.checked : field.value;
    
    // Сохраняем изменения
    formDataChanges[fieldName] = fieldValue;
    
    // Запускаем автосохранение
    startAutosave();
}

// Запуск автосохранения
function startAutosave() {
    // Очищаем предыдущий таймер
    if (autosaveTimeout) {
        clearTimeout(autosaveTimeout);
    }
    
    // Показываем прогресс-бар
    showAutosaveProgress();
    
    // Устанавливаем новый таймер
    autosaveTimeout = setTimeout(() => {
        autosave();
    }, 2000); // Автосохранение через 2 секунды после последнего изменения
}

// Показ прогресс-бара автосохранения
function showAutosaveProgress() {
    const progressBar = document.getElementById('autosave-progress');
    const progressBarInner = document.getElementById('autosave-progress-bar');
    
    if (progressBar && progressBarInner) {
        progressBar.classList.add('show');
        progressBarInner.style.width = '0%';
        
        // Анимация прогресса
        setTimeout(() => {
            progressBarInner.style.width = '100%';
        }, 100);
    }
}

// Скрытие прогресс-бара автосохранения
function hideAutosaveProgress() {
    const progressBar = document.getElementById('autosave-progress');
    if (progressBar) {
        setTimeout(() => {
            progressBar.classList.remove('show');
        }, 500);
    }
}

// Автосохранение
function autosave() {
    try {
        const formData = collectFormData();
        
        // Сохраняем в localStorage как черновик
        localStorage.setItem('lessonAutosave', JSON.stringify({
            ...formData,
            isAutosave: true,
            autosaveDate: new Date().toISOString()
        }));
        
        // Показываем уведомление
        showAutosaveNotification();
        
        // Скрываем прогресс-бар
        hideAutosaveProgress();
        
        // Очищаем изменения
        formDataChanges = {};
    } catch (error) {
        console.error('Autosave error:', error);
    }
}

// Показ уведомления об автосохранении
function showAutosaveNotification() {
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.className = 'autosave-notification';
    notification.innerHTML = '<i class="fas fa-check"></i> Автосохранено';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 10px 15px;
        border-radius: var(--radius);
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем уведомление через 2 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Проверка наличия несохраненных изменений
function hasUnsavedChanges() {
    return Object.keys(formDataChanges).length > 0;
}

// Загрузка занятия для редактирования
function loadLessonForEdit(lessonId) {
    const lesson = lessons.find(l => l.id == lessonId);
    if (!lesson) {
        showNotification('Занятие не найдено', 'error');
        window.location.href = 'schedule.html';
        return;
    }
    
    currentLesson = lesson;
    
    // Заполняем форму данными
    const form = document.getElementById('lesson-form');
    if (form) {
        // Основная информация
        document.getElementById('student-select').value = lesson.studentId;
        document.getElementById('lesson-status').value = lesson.status;
        
        const lessonDate = new Date(lesson.date);
        document.getElementById('lesson-date').value = lessonDate.toISOString().split('T')[0];
        document.getElementById('lesson-time').value = formatTime(lessonDate);
        document.getElementById('lesson-duration').value = lesson.duration;
        document.getElementById('lesson-type').value = lesson.type;
        document.getElementById('lesson-topic').value = lesson.topic || '';
        
        // Финансовая информация
        document.getElementById('lesson-price').value = lesson.price || '';
        document.getElementById('payment-status').value = lesson.paymentStatus || 'unpaid';
        
        // Дополнительная информация
        document.getElementById('homework').value = lesson.homework || '';
        document.getElementById('teacher-notes').value = lesson.teacherNotes || '';
        document.getElementById('lesson-materials').value = lesson.materials || '';
        
        // Обновляем информацию об ученике
        handleStudentChange();
    }
}

// Обработка изменения ученика
function handleStudentChange() {
    const studentSelect = document.getElementById('student-select');
    const selectedStudentId = studentSelect.value;
    
    if (!selectedStudentId) {
        hideStudentInfo();
        return;
    }
    
    const student = students.find(s => s.id == selectedStudentId);
    if (!student) return;
    
    showStudentInfo(student);
    
    // Обновляем калькулятор цены
    updatePriceCalculator();
    
    // Проверяем конфликты в расписании
    checkScheduleConflicts();
    
    // Добавляем анимацию
    animateStudentInfo();
}

// Показ информации об ученике
function showStudentInfo(student) {
    const infoCard = document.getElementById('student-info-card');
    if (!infoCard) return;
    
    // Заполняем информацию
    document.getElementById('student-avatar').textContent = student.name.charAt(0).toUpperCase();
    document.getElementById('student-name').textContent = student.name;
    document.getElementById('student-grade').textContent = `${student.grade} класс`;
    document.getElementById('student-tariff').textContent = `${student.tariff} (${student.tariffPrice} руб./час)`;
    document.getElementById('student-phone').textContent = student.phone;
    document.getElementById('student-email').textContent = student.email;
    
    // Показываем карточку
    infoCard.classList.add('show');
}

// Скрытие информации об ученике
function hideStudentInfo() {
    const infoCard = document.getElementById('student-info-card');
    if (infoCard) {
        infoCard.classList.remove('show');
    }
}

// Анимация информации об ученике
function animateStudentInfo() {
    const infoCard = document.getElementById('student-info-card');
    if (infoCard && infoCard.classList.contains('show')) {
        infoCard.style.animation = 'slideDown 0.3s ease-out';
    }
}

// Обновление калькулятора цены
function updatePriceCalculator() {
    const studentSelect = document.getElementById('student-select');
    const durationSelect = document.getElementById('lesson-duration');
    const priceInput = document.getElementById('lesson-price');
    
    if (!studentSelect.value) return;
    
    const student = students.find(s => s.id == studentSelect.value);
    if (!student) return;
    
    const duration = parseInt(durationSelect.value);
    const customPrice = parseFloat(priceInput.value) || 0;
    
    // Базовая цена (цена за 60 минут)
    const basePrice = customPrice > 0 ? customPrice : student.tariffPrice;
    
    // Расчет цены в зависимости от длительности
    let calculatedPrice = basePrice;
    if (duration !== 60) {
        calculatedPrice = (basePrice / 60) * duration;
    }
    
    // Округляем до целого
    calculatedPrice = Math.round(calculatedPrice);
    
    // Обновляем отображение
    document.getElementById('base-price').textContent = `${basePrice} руб.`;
    document.getElementById('duration-price').textContent = `${calculatedPrice} руб.`;
    document.getElementById('discount-price').textContent = '0 руб.';
    document.getElementById('total-price').textContent = `${calculatedPrice} руб.`;
    
    // Если пользователь не вводил свою цену, обновляем поле
    if (customPrice === 0) {
        priceInput.value = calculatedPrice;
    }
}

// Переключение опций повторения
function toggleRepeatOptions() {
    const repeatCheckbox = document.getElementById('repeat-lesson');
    const repeatOptions = document.getElementById('repeat-options');
    
    if (repeatCheckbox.checked) {
        repeatOptions.classList.add('show');
        repeatOptions.style.animation = 'slideDown 0.3s ease-out';
    } else {
        repeatOptions.classList.remove('show');
    }
}

// Обработка изменения окончания повторений
function handleRepeatEndChange() {
    const repeatEndSelect = document.getElementById('repeat-end');
    const repeatCountInput = document.getElementById('repeat-count');
    const repeatDateInput = document.getElementById('repeat-date');
    
    // Скрываем все поля
    if (repeatCountInput) repeatCountInput.style.display = 'none';
    if (repeatDateInput) repeatDateInput.style.display = 'none';
    
    // Показываем нужное поле
    if (repeatEndSelect.value === 'after' && repeatCountInput) {
        repeatCountInput.style.display = 'block';
    } else if (repeatEndSelect.value === 'date' && repeatDateInput) {
        repeatDateInput.style.display = 'block';
    }
}

// Проверка конфликтов в расписании
function checkScheduleConflicts() {
    const studentSelect = document.getElementById('student-select');
    const dateInput = document.getElementById('lesson-date');
    const timeInput = document.getElementById('lesson-time');
    const durationSelect = document.getElementById('lesson-duration');
    const conflictIndicator = document.getElementById('schedule-conflict-indicator');
    
    if (!studentSelect.value || !dateInput.value || !timeInput.value) {
        if (conflictIndicator) {
            conflictIndicator.style.display = 'none';
        }
        return;
    }
    
    const studentId = parseInt(studentSelect.value);
    const lessonDate = new Date(`${dateInput.value}T${timeInput.value}`);
    const duration = parseInt(durationSelect.value);
    
    // Вычисляем время окончания занятия
    const endTime = new Date(lessonDate.getTime() + duration * 60000);
    
    // Ищем конфликты
    const conflicts = lessons.filter(lesson => {
        if (lesson.studentId !== studentId) return false;
        if (lesson.id === currentLesson?.id) return false; // Пропускаем текущее занятие при редактировании
        if (lesson.status === 'cancelled') return false;
        
        const existingLessonDate = new Date(lesson.date);
        const existingEndTime = new Date(existingLessonDate.getTime() + lesson.duration * 60000);
        
        // Проверяем пересечение временных интервалов
        return (lessonDate < existingEndTime && endTime > existingLessonDate) &&
               lessonDate.toDateString() === existingLessonDate.toDateString();
    });
    
    if (conflicts.length > 0) {
        showConflictWarning(conflicts[0]);
        if (conflictIndicator) {
            conflictIndicator.style.display = 'flex';
            conflictIndicator.classList.remove('resolved');
        }
    } else {
        hideConflictWarning();
        if (conflictIndicator) {
            conflictIndicator.style.display = 'none';
        }
    }
}

// Показ предупреждения о конфликте
function showConflictWarning(conflictLesson) {
    const conflictWarning = document.getElementById('conflict-warning');
    const conflictInfo = document.getElementById('conflict-info');
    
    if (!conflictWarning || !conflictInfo) return;
    
    const conflictDate = new Date(conflictLesson.date);
    const timeString = formatTime(conflictDate);
    const endTime = new Date(conflictDate.getTime() + conflictLesson.duration * 60000);
    const endTimeString = formatTime(endTime);
    
    conflictInfo.innerHTML = `
        <div><strong>Ученик:</strong> ${conflictLesson.studentName}</div>
        <div><strong>Время:</strong> ${timeString} - ${endTimeString}</div>
        <div><strong>Тема:</strong> ${conflictLesson.topic || 'Без темы'}</div>
    `;
    
    conflictWarning.classList.add('show');
    conflictWarning.style.animation = 'slideDown 0.3s ease-out';
}

// Скрытие предупреждения о конфликте
function hideConflictWarning() {
    const conflictWarning = document.getElementById('conflict-warning');
    if (conflictWarning) {
        conflictWarning.classList.remove('show');
    }
}

// Фокус на поле времени
function focusTimeField() {
    const timeInput = document.getElementById('lesson-time');
    if (timeInput) {
        timeInput.focus();
        timeInput.select();
    }
}

// Обработка отправки формы
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Проверяем конфликты
    const conflictWarning = document.getElementById('conflict-warning');
    if (conflictWarning && conflictWarning.classList.contains('show')) {
        return; // Не отправляем форму, если есть конфликт
    }
    
    submitForm();
}

// Отправка формы
function submitForm() {
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        return;
    }
    
    if (isEditMode) {
        updateLesson(formData);
    } else {
        createLesson(formData);
    }
}

// Сбор данных формы
function collectFormData() {
    const studentSelect = document.getElementById('student-select');
    const student = students.find(s => s.id == studentSelect.value);
    
    const dateInput = document.getElementById('lesson-date').value;
    const timeInput = document.getElementById('lesson-time').value;
    const durationSelect = document.getElementById('lesson-duration').value;
    const priceInput = document.getElementById('lesson-price').value;
    
    // Создаем дату занятия
    const lessonDate = new Date(`${dateInput}T${timeInput}`);
    
    return {
        studentId: parseInt(studentSelect.value),
        studentName: student.name,
        studentGrade: student.grade,
        date: lessonDate.toISOString(),
        duration: parseInt(durationSelect),
        type: document.getElementById('lesson-type').value,
        status: document.getElementById('lesson-status').value,
        topic: document.getElementById('lesson-topic').value,
        price: parseFloat(priceInput) || 0,
        paymentStatus: document.getElementById('payment-status').value,
        homework: document.getElementById('homework').value,
        teacherNotes: document.getElementById('teacher-notes').value,
        materials: document.getElementById('lesson-materials').value,
        isRepeating: document.getElementById('repeat-lesson').checked,
        repeatFrequency: document.getElementById('repeat-frequency').value,
        repeatEnd: document.getElementById('repeat-end').value,
        repeatCount: parseInt(document.getElementById('repeat-count').value) || 0,
        repeatDate: document.getElementById('repeat-date').value
    };
}

// Валидация данных формы
function validateFormData(data) {
    // Проверка обязательных полей
    if (!data.studentId) {
        showNotification('Пожалуйста, выберите ученика', 'error');
        return false;
    }
    
    if (!data.date) {
        showNotification('Пожалуйста, укажите дату занятия', 'error');
        return false;
    }
    
    if (!data.duration) {
        showNotification('Пожалуйста, укажите длительность занятия', 'error');
        return false;
    }
    
    // Проверка, что дата не в прошлом (для новых занятий)
    if (!isEditMode) {
        const lessonDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (lessonDate < today) {
            showNotification('Дата занятия не может быть в прошлом', 'error');
            return false;
        }
    }
    
    // Проверка повторяющихся занятий
    if (data.isRepeating) {
        if (data.repeatEnd === 'after' && data.repeatCount <= 0) {
            showNotification('Пожалуйста, укажите количество повторений', 'error');
            return false;
        }
        
        if (data.repeatEnd === 'date' && !data.repeatDate) {
            showNotification('Пожалуйста, укажите дату окончания повторений', 'error');
            return false;
        }
    }
    
    return true;
}

// Создание занятия
function createLesson(formData) {
    const newLesson = {
        id: Date.now(), // Временный ID
        ...formData
    };
    
    // Добавляем занятие
    lessons.push(newLesson);
    
    // Если это повторяющееся занятие, создаем повторения
    if (formData.isRepeating) {
        createRepeatingLessons(newLesson);
    }
    
    // Сохраняем изменения
    localStorage.setItem('lessons', JSON.stringify(lessons));
    
    // Очищаем автосохранение
    localStorage.removeItem('lessonAutosave');
    
    showNotification('Занятие успешно добавлено', 'success');
    
    // Перенаправляем на расписание
    setTimeout(() => {
        window.location.href = 'schedule.html';
    }, 1500);
}

// Создание повторяющихся занятий
function createRepeatingLessons(baseLesson) {
    const lessonDate = new Date(baseLesson.date);
    let currentDate = new Date(lessonDate);
    let lessonCount = 0;
    
    // Определяем шаг повторения
    let stepInDays = 1; // daily
    if (baseLesson.repeatFrequency === 'weekly') stepInDays = 7;
    else if (baseLesson.repeatFrequency === 'biweekly') stepInDays = 14;
    else if (baseLesson.repeatFrequency === 'monthly') stepInDays = 30;
    
    // Создаем повторения
    while (true) {
        // Увеличиваем дату
        currentDate.setDate(currentDate.getDate() + stepInDays);
        
        // Проверяем условия окончания
        lessonCount++;
        
        if (baseLesson.repeatEnd === 'after' && lessonCount >= baseLesson.repeatCount) {
            break;
        }
        
        if (baseLesson.repeatEnd === 'date') {
            const endDate = new Date(baseLesson.repeatDate);
            if (currentDate > endDate) {
                break;
            }
        }
        
        // Создаем новое занятие
        const repeatedLesson = {
            ...baseLesson,
            id: Date.now() + lessonCount,
            date: new Date(currentDate).toISOString(),
            isRepeating: false // Повторения не являются повторяющимися
        };
        
        lessons.push(repeatedLesson);
    }
}

// Обновление занятия
function updateLesson(formData) {
    const lessonIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (lessonIndex === -1) {
        showNotification('Занятие не найдено', 'error');
        return;
    }
    
    // Обновляем занятие
    lessons[lessonIndex] = {
        ...currentLesson,
        ...formData
    };
    
    // Сохраняем изменения
    localStorage.setItem('lessons', JSON.stringify(lessons));
    
    // Очищаем автосохранение
    localStorage.removeItem('lessonAutosave');
    
    showNotification('Занятие успешно обновлено', 'success');
    
    // Перенаправляем на детали занятия
    setTimeout(() => {
        window.location.href = `lesson-details.html?id=${currentLesson.id}`;
    }, 1500);
}

// Копирование занятия
function copyLesson() {
    const formData = collectFormData();
    
    if (!validateFormData(formData)) {
        return;
    }
    
    // Сбрасываем ID для создания нового занятия
    delete formData.id;
    
    // Сбрасываем статус
    formData.status = 'scheduled';
    
    // Создаем новое занятие
    createLesson(formData);
}

// Сохранение черновика
function saveDraft() {
    const formData = collectFormData();
    
    // Добавляем метку черновика
    formData.isDraft = true;
    formData.draftDate = new Date().toISOString();
    
    // Сохраняем в отдельное хранилище черновиков
    let drafts = [];
    try {
        const storedDrafts = localStorage.getItem('lessonDrafts');
        if (storedDrafts) {
            drafts = JSON.parse(storedDrafts);
        }
    } catch (error) {
        console.error('Error loading drafts:', error);
    }
    
    // Добавляем или обновляем черновик
    if (isEditMode && currentLesson) {
        const draftIndex = drafts.findIndex(d => d.lessonId === currentLesson.id);
        if (draftIndex !== -1) {
            drafts[draftIndex] = { ...formData, lessonId: currentLesson.id };
        } else {
            drafts.push({ ...formData, lessonId: currentLesson.id });
        }
    } else {
        drafts.push(formData);
    }
    
    // Ограничиваем количество черновиков
    if (drafts.length > 10) {
        drafts = drafts.slice(-10);
    }
    
    localStorage.setItem('lessonDrafts', JSON.stringify(drafts));
    
    showNotification('Черновик сохранен', 'success');
}

// Обновление заголовка формы
function updateFormTitle(title) {
    const formTitle = document.getElementById('form-title');
    if (formTitle) {
        formTitle.textContent = title;
    }
    
    // Обновляем заголовок страницы
    document.title = `${title} | Репетитор по математике Настя`;
}

// Форматирование времени
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
    const sidebar = document.querySelector('.lesson-form-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
        
        // Создаем или удаляем оверлей
        if (sidebar.classList.contains('mobile-open')) {
            createOverlay();
        } else {
            removeOverlay();
        }
    }
}

// Создание оверлея
function createOverlay() {
    // Проверяем, существует ли уже оверлей
    if (document.querySelector('.mobile-overlay')) {
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
        display: none;
    `;
    
    // Добавляем обработчик клика для закрытия меню
    overlay.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    document.body.appendChild(overlay);
    
    // Показываем оверлей с анимацией
    setTimeout(() => {
        overlay.style.display = 'block';
    }, 10);
}

// Удаление оверлея
function removeOverlay() {
    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// Анимация элементов формы при загрузке
function animateFormElements() {
    const sections = document.querySelectorAll('.lesson-form-section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Показ уведомления
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = notification.querySelector('.notification-message');
    
    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        
        // Устанавливаем цвет в зависимости от типа
        if (type === 'error') {
            notification.style.backgroundColor = 'hsl(var(--destructive))';
        } else {
            notification.style.backgroundColor = 'hsl(var(--primary))';
        }
        
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

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);