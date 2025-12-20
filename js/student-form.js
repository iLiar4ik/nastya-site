// JavaScript для работы с формами добавления/редактирования учеников
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных
    let currentStudent = null;
    let isEditMode = false;
    let autoSaveTimer = null;
    let formData = {};

    // Элементы DOM
    const studentForm = document.getElementById('student-form');
    const studentIdInput = document.getElementById('student-id');
    const formTitle = document.getElementById('form-title');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const gradeSelect = document.getElementById('grade');
    const birthDateInput = document.getElementById('birth-date');
    const addressInput = document.getElementById('address');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const parentNameInput = document.getElementById('parent-name');
    const parentPhoneInput = document.getElementById('parent-phone');
    const parentEmailInput = document.getElementById('parent-email');
    const statusSelect = document.getElementById('status');
    const tariffSelect = document.getElementById('tariff');
    const notesTextarea = document.getElementById('notes');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const saveStudentBtn = document.getElementById('save-student-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const lessonsSection = document.getElementById('lessons-section');
    const lessonsHistory = document.getElementById('lessons-history');
    const draftIndicator = document.getElementById('draft-indicator');
    
    // Новые элементы для shadcn/ui
    const formProgress = document.getElementById('form-progress');
    const progressPercent = document.getElementById('progress-percent');
    const autosaveIndicator = document.getElementById('autosave-indicator');
    const autosaveText = document.getElementById('autosave-text');
    const themeToggle = document.getElementById('theme-toggle');

    // Инициализация при загрузке страницы
    init();

    function init() {
        loadUserData();
        checkEditMode();
        setupEventListeners();
        setupFormValidation();
        setupAutoSave();
        setupProgressTracking();
        setupThemeToggle();
        loadDraft();
        updateProgress();
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

    // Проверка режима редактирования
    function checkEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('id');
        
        if (studentId) {
            isEditMode = true;
            formTitle.textContent = 'Редактирование ученика';
            loadStudent(studentId);
        } else {
            formTitle.textContent = 'Добавление ученика';
        }
    }

    // Загрузка данных ученика
    function loadStudent(id) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        currentStudent = students.find(student => student.id == id);
        
        if (currentStudent) {
            // Заполняем форму данными ученика
            studentIdInput.value = currentStudent.id;
            firstNameInput.value = currentStudent.firstName || '';
            lastNameInput.value = currentStudent.lastName || '';
            gradeSelect.value = currentStudent.grade || '';
            birthDateInput.value = currentStudent.birthDate || '';
            addressInput.value = currentStudent.address || '';
            phoneInput.value = currentStudent.phone || '';
            emailInput.value = currentStudent.email || '';
            parentNameInput.value = currentStudent.parentName || '';
            parentPhoneInput.value = currentStudent.parentPhone || '';
            parentEmailInput.value = currentStudent.parentEmail || '';
            statusSelect.value = currentStudent.status || 'trial';
            tariffSelect.value = currentStudent.tariff || 'standard';
            notesTextarea.value = currentStudent.notes || '';
            
            // Показываем историю занятий
            if (currentStudent.lessons && currentStudent.lessons.length > 0) {
                lessonsSection.style.display = 'block';
                renderLessonsHistory(currentStudent.lessons);
            }
            
            // Обновляем возраст
            updateAgeDisplay();
        } else {
            showNotification('Ученик не найден', 'error');
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 2000);
        }
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Сохранение ученика
        if (studentForm) {
            studentForm.addEventListener('submit', handleFormSubmit);
        }

        // Сохранение черновика
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', saveDraft);
        }

        // Отмена
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите отменить изменения?')) {
                    window.location.href = 'students.html';
                }
            });
        }
// Выход из системы
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// Переключатель темы
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

// Закрытие мобильного меню при клике на пункт меню
const menuLinks = document.querySelectorAll('.sidebar-menu a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        const sidebar = document.querySelector('.form-sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
            toggleMobileMenu();
        }
    });
});

// Форматирование телефона
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        formatPhoneInput(this);
    });
}

if (parentPhoneInput) {
    parentPhoneInput.addEventListener('input', function() {
        formatPhoneInput(this);
    });
}

// Расчет возраста при изменении даты рождения
if (birthDateInput) {
    birthDateInput.addEventListener('change', updateAgeDisplay);
}

// Очистка ошибок и валидация в реальном времени при вводе
const inputs = studentForm.querySelectorAll('input, select, textarea');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        clearFieldError(this);
        validateFieldRealtime(this);
        updateProgress();
    });
    
    input.addEventListener('blur', function() {
        validateField(this);
    });
});
}

    // Настройка валидации формы
    function setupFormValidation() {
        // Правила валидации
        const validationRules = {
            'first-name': {
                required: true,
                minLength: 2,
                pattern: /^[а-яА-ЯёЁa-zA-Z\s]+$/,
                message: 'Введите корректное имя (минимум 2 символа)'
            },
            'last-name': {
                required: true,
                minLength: 2,
                pattern: /^[а-яА-ЯёЁa-zA-Z\s]+$/,
                message: 'Введите корректную фамилию (минимум 2 символа)'
            },
            'grade': {
                required: true,
                message: 'Выберите класс ученика'
            },
            'birth-date': {
                required: true,
                validate: function(value) {
                    const date = new Date(value);
                    const today = new Date();
                    const minDate = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
                    const maxDate = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate());
                    return date >= minDate && date <= maxDate;
                },
                message: 'Введите корректную дату рождения (возраст от 5 до 20 лет)'
            },
            'phone': {
                required: true,
                pattern: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
                message: 'Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX'
            },
            'email': {
                required: false,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Введите корректный email адрес'
            },
            'parent-phone': {
                required: false,
                pattern: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
                message: 'Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX'
            },
            'parent-email': {
                required: false,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Введите корректный email адрес'
            }
        };

        // Добавляем правила валидации к полям
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.dataset.validation = JSON.stringify(validationRules[fieldName]);
            }
        });
    }

    // Настройка отслеживания прогресса
    function setupProgressTracking() {
        const inputs = studentForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', updateProgress);
            input.addEventListener('change', updateProgress);
        });
    }

    // Настройка автосохранения
    function setupAutoSave() {
        const inputs = studentForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    saveDraft(true); // true = тихое сохранение
                }, 2000);
            });
        });
    }

    // Настройка переключателя темы
    function setupThemeToggle() {
        // Проверяем сохраненную тему
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    }

    // Переключение темы
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Применение темы
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Обновляем иконку в кнопке
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    // Обновление прогресса заполнения формы
    function updateProgress() {
        const inputs = studentForm.querySelectorAll('input[required], select[required], textarea[required]');
        const filledInputs = Array.from(inputs).filter(input => {
            if (input.type === 'checkbox') {
                return input.checked;
            } else {
                return input.value.trim() !== '';
            }
        });
        
        const progress = inputs.length > 0 ? Math.round((filledInputs.length / inputs.length) * 100) : 0;
        
        if (formProgress) {
            formProgress.style.width = `${progress}%`;
        }
        
        if (progressPercent) {
            progressPercent.textContent = `${progress}%`;
        }
    }

    // Валидация поля в реальном времени
    function validateFieldRealtime(field) {
        const validation = field.dataset.validation ? JSON.parse(field.dataset.validation) : {};
        const value = field.value.trim();
        const formGroup = field.closest('.form-group');
        
        if (!formGroup) return;
        
        // Находим иконки валидации
        const successIcon = formGroup.querySelector('.validation-icon.success');
        const errorIcon = formGroup.querySelector('.validation-icon.error');
        
        // Если поле пустое, скрываем все иконки
        if (!value) {
            if (successIcon) successIcon.style.display = 'none';
            if (errorIcon) errorIcon.style.display = 'none';
            formGroup.classList.remove('success', 'error');
            return;
        }
        
        // Проверяем обязательность
        if (validation.required && !value) {
            showFieldValidationError(field, false);
            return;
        }
        
        // Проверяем минимальную длину
        if (validation.minLength && value.length < validation.minLength) {
            showFieldValidationError(field, false);
            return;
        }
        
        // Проверяем по паттерну
        if (validation.pattern && !validation.pattern.test(value)) {
            showFieldValidationError(field, false);
            return;
        }
        
        // Кастомная валидация
        if (validation.validate && !validation.validate(value)) {
            showFieldValidationError(field, false);
            return;
        }
        
        // Поле прошло валидацию
        showFieldValidationError(field, true);
    }

    // Показать результат валидации поля
    function showFieldValidationError(field, isValid) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        const successIcon = formGroup.querySelector('.validation-icon.success');
        const errorIcon = formGroup.querySelector('.validation-icon.error');
        
        if (isValid) {
            formGroup.classList.add('success');
            formGroup.classList.remove('error');
            if (successIcon) successIcon.style.display = 'block';
            if (errorIcon) errorIcon.style.display = 'none';
        } else {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            if (successIcon) successIcon.style.display = 'none';
            if (errorIcon) errorIcon.style.display = 'block';
        }
    }

    // Обработка отправки формы
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('Исправьте ошибки в форме', 'error');
            return;
        }

        // Показываем индикатор загрузки
        const originalText = saveStudentBtn.innerHTML;
        saveStudentBtn.disabled = true;
        saveStudentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';

        // Собираем данные формы
        const studentData = collectFormData();

        // Сохраняем ученика
        setTimeout(() => {
            if (isEditMode) {
                updateStudent(studentData);
            } else {
                addStudent(studentData);
            }

            // Возвращаем кнопку в исходное состояние
            saveStudentBtn.disabled = false;
            saveStudentBtn.innerHTML = originalText;

            // Удаляем черновик
            localStorage.removeItem('studentDraft');

            // Показываем уведомление и перенаправляем
            showNotification(isEditMode ? 'Ученик успешно обновлен' : 'Ученик успешно добавлен', 'success');
            
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 1500);
        }, 1000);
    }

    // Сбор данных формы
    function collectFormData() {
        return {
            id: isEditMode ? currentStudent.id : Date.now(),
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            grade: gradeSelect.value,
            birthDate: birthDateInput.value,
            address: addressInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            parentName: parentNameInput.value.trim(),
            parentPhone: parentPhoneInput.value.trim(),
            parentEmail: parentEmailInput.value.trim(),
            status: statusSelect.value,
            tariff: tariffSelect.value,
            notes: notesTextarea.value.trim(),
            createdDate: isEditMode ? currentStudent.createdDate : new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            lessons: isEditMode ? (currentStudent.lessons || []) : [],
            finance: isEditMode ? (currentStudent.finance || {
                paidLessons: 0,
                balance: 0,
                totalIncome: 0
            }) : {
                paidLessons: 0,
                balance: 0,
                totalIncome: 0
            }
        };
    }

    // Валидация формы
    function validateForm() {
        let isValid = true;
        const inputs = studentForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Валидация поля
    function validateField(field) {
        const validation = field.dataset.validation ? JSON.parse(field.dataset.validation) : {};
        const value = field.value.trim();
        
        // Проверка на обязательность
        if (validation.required && !value) {
            showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        // Если поле не обязательное и пустое, пропускаем дальнейшие проверки
        if (!value) {
            return true;
        }
        
        // Проверка минимальной длины
        if (validation.minLength && value.length < validation.minLength) {
            showFieldError(field, validation.message);
            return false;
        }
        
        // Проверка по паттерну
        if (validation.pattern && !validation.pattern.test(value)) {
            showFieldError(field, validation.message);
            return false;
        }
        
        // Кастомная валидация
        if (validation.validate && !validation.validate(value)) {
            showFieldError(field, validation.message);
            return false;
        }
        
        // Поле прошло валидацию
        clearFieldError(field);
        return true;
    }

    // Показать ошибку поля
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');
            
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = message;
            }
            
            // Показываем иконку ошибки
            const errorIcon = formGroup.querySelector('.validation-icon.error');
            const successIcon = formGroup.querySelector('.validation-icon.success');
            if (errorIcon) errorIcon.style.display = 'block';
            if (successIcon) successIcon.style.display = 'none';
        }
    }

    // Очистить ошибку поля
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error', 'success');
            
            // Скрываем иконки валидации
            const errorIcon = formGroup.querySelector('.validation-icon.error');
            const successIcon = formGroup.querySelector('.validation-icon.success');
            if (errorIcon) errorIcon.style.display = 'none';
            if (successIcon) successIcon.style.display = 'none';
        }
    }

    // Добавление ученика
    function addStudent(studentData) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(studentData);
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Обновление ученика
    function updateStudent(studentData) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const index = students.findIndex(student => student.id == studentData.id);
        
        if (index !== -1) {
            students[index] = studentData;
            localStorage.setItem('students', JSON.stringify(students));
        }
    }

    // Сохранение черновика
    function saveDraft(silent = false) {
        const draftData = collectFormData();
        localStorage.setItem('studentDraft', JSON.stringify(draftData));
        
        // Обновляем индикатор автосохранения
        if (autosaveIndicator) {
            autosaveIndicator.classList.add('saving');
            autosaveIndicator.classList.remove('saved');
            if (autosaveText) {
                autosaveText.textContent = 'Сохранение...';
            }
        }
        
        // Имитируем сохранение
        setTimeout(() => {
            if (autosaveIndicator) {
                autosaveIndicator.classList.remove('saving');
                autosaveIndicator.classList.add('saved');
                if (autosaveText) {
                    autosaveText.textContent = 'Сохранено';
                }
            }
            
            if (!silent) {
                showNotification('Черновик сохранен', 'success');
            }
            
            // Через 2 секунды возвращаем к исходному состоянию
            setTimeout(() => {
                if (autosaveIndicator) {
                    autosaveIndicator.classList.remove('saving', 'saved');
                    if (autosaveText) {
                        autosaveText.textContent = 'Автосохранение включено';
                    }
                }
            }, 2000);
        }, 500);
        
        // Показываем индикатор черновика (для обратной совместимости)
        if (draftIndicator) {
            draftIndicator.style.display = 'flex';
        }
    }

    // Загрузка черновика
    function loadDraft() {
        const draft = localStorage.getItem('studentDraft');
        if (draft && !isEditMode) {
            const draftData = JSON.parse(draft);
            
            // Заполняем форму данными из черновика
            firstNameInput.value = draftData.firstName || '';
            lastNameInput.value = draftData.lastName || '';
            gradeSelect.value = draftData.grade || '';
            birthDateInput.value = draftData.birthDate || '';
            addressInput.value = draftData.address || '';
            phoneInput.value = draftData.phone || '';
            emailInput.value = draftData.email || '';
            parentNameInput.value = draftData.parentName || '';
            parentPhoneInput.value = draftData.parentPhone || '';
            parentEmailInput.value = draftData.parentEmail || '';
            statusSelect.value = draftData.status || 'trial';
            tariffSelect.value = draftData.tariff || 'standard';
            notesTextarea.value = draftData.notes || '';
            
            // Показываем индикатор черновика
            if (draftIndicator) {
                draftIndicator.style.display = 'flex';
            }
            
            // Обновляем возраст
            updateAgeDisplay();
        }
    }

    // Отображение истории занятий
    function renderLessonsHistory(lessons) {
        if (!lessons || lessons.length === 0) {
            lessonsHistory.innerHTML = '<p>Занятий пока не было</p>';
            return;
        }
        
        const sortedLessons = lessons.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentLessons = sortedLessons.slice(0, 5);
        
        lessonsHistory.innerHTML = recentLessons.map(lesson => `
            <div class="lesson-item">
                <div>
                    <div class="lesson-date">${formatDate(lesson.date)}</div>
                    <div class="lesson-topic">${lesson.topic}</div>
                </div>
                <div class="lesson-duration">${lesson.duration} мин</div>
            </div>
        `).join('');
    }

    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Форматирование телефона
    function formatPhoneInput(input) {
        let value = input.value.replace(/\D/g, '');
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = '+7';
            
            if (value.length > 1) {
                formattedValue += ' (' + value.substring(1, 4);
            }
            
            if (value.length > 4) {
                formattedValue += ') ' + value.substring(4, 7);
            }
            
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 9);
            }
            
            if (value.length > 9) {
                formattedValue += '-' + value.substring(9, 11);
            }
        }
        
        input.value = formattedValue;
    }

    // Обновление отображения возраста
    function updateAgeDisplay() {
        const birthDate = birthDateInput.value;
        if (!birthDate) return;
        
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        // Обновляем подсказку с возрастом
        const formGroup = birthDateInput.closest('.form-group');
        const hint = formGroup.querySelector('.form-hint span');
        if (hint) {
            hint.textContent = `Возраст: ${age} лет`;
        }
    }

    // Вспомогательные функции
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
        const sidebar = document.querySelector('.form-sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn i');
        
        if (sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            menuBtn.classList.remove('fa-times');
            menuBtn.classList.add('fa-bars');
            removeOverlay();
        } else {
            sidebar.classList.add('mobile-open');
            menuBtn.classList.remove('fa-bars');
            menuBtn.classList.add('fa-times');
            createOverlay();
        }
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
        overlay.addEventListener('click', toggleMobileMenu);
        
        document.body.appendChild(overlay);
    }
    
    function removeOverlay() {
        const overlay = document.querySelector('.mobile-menu-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
});