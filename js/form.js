// Функция для инициализации форм после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initTrialLessonForm();
    initContactForm();
    initFormValidation();
});

// Инициализация формы записи на пробное занятие
function initTrialLessonForm() {
    const trialLessonForm = document.getElementById('trial-lesson-form');
    
    if (trialLessonForm) {
        trialLessonForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTrialLessonForm(this);
        });
    }
}

// Инициализация контактной формы
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm(this);
        });
    }
}

// Обработка формы записи на пробное занятие
function handleTrialLessonForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Валидация данных
    if (!validateFormData(data)) {
        return;
    }
    
    // Показываем индикатор загрузки
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    // Имитация отправки формы (в реальном проекте здесь будет AJAX-запрос)
    setTimeout(() => {
        // Восстанавливаем кнопку
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Показываем уведомление об успешной отправке
        showNotification('Ваша заявка успешно отправлена! Я свяжусь с вами в ближайшее время.', 'success');
        
        // Очищаем форму
        form.reset();
        
        // Закрываем модальное окно, если форма была в нем
        const modal = document.getElementById('modal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
        
        // Сохраняем данные в localStorage для аналитики
        saveFormSubmission(data, 'trial_lesson');
    }, 1500);
}

// Обработка контактной формы
function handleContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Валидация данных
    if (!validateFormData(data)) {
        return;
    }
    
    // Показываем индикатор загрузки
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    // Имитация отправки формы (в реальном проекте здесь будет AJAX-запрос)
    setTimeout(() => {
        // Восстанавливаем кнопку
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Показываем уведомление об успешной отправке
        showNotification('Ваше сообщение успешно отправлено! Я отвечу вам в ближайшее время.', 'success');
        
        // Очищаем форму
        form.reset();
        
        // Сохраняем данные в localStorage для аналитики
        saveFormSubmission(data, 'contact');
    }, 1500);
}

// Валидация данных формы
function validateFormData(data) {
    // Проверка имени
    if (!data.name || data.name.trim().length < 2) {
        showNotification('Пожалуйста, введите корректное имя (минимум 2 символа).', 'error');
        return false;
    }
    
    // Проверка телефона
    if (!data.phone || !validatePhone(data.phone)) {
        showNotification('Пожалуйста, введите корректный номер телефона.', 'error');
        return false;
    }
    
    // Проверка email
    if (!data.email || !validateEmail(data.email)) {
        showNotification('Пожалуйста, введите корректный email адрес.', 'error');
        return false;
    }
    
    // Проверка класса (если есть)
    if (data.grade && data.grade === '') {
        showNotification('Пожалуйста, выберите класс ученика.', 'error');
        return false;
    }
    
    return true;
}

// Инициализация валидации форм в реальном времени
function initFormValidation() {
    // Валидация имени
    const nameInputs = document.querySelectorAll('input[name="name"]');
    nameInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateNameField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateNameField(this);
            }
        });
    });
    
    // Валидация телефона
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validatePhoneField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validatePhoneField(this);
            }
        });
    });
    
    // Валидация email
    const emailInputs = document.querySelectorAll('input[name="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmailField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateEmailField(this);
            }
        });
    });
    
    // Валидация класса
    const gradeSelects = document.querySelectorAll('select[name="grade"]');
    gradeSelects.forEach(select => {
        select.addEventListener('change', function() {
            validateGradeField(this);
        });
    });
}

// Валидация поля имени
function validateNameField(input) {
    const value = input.value.trim();
    
    if (value.length < 2) {
        showFieldError(input, 'Имя должно содержать минимум 2 символа');
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Валидация поля телефона
function validatePhoneField(input) {
    const value = input.value.trim();
    
    if (!validatePhone(value)) {
        showFieldError(input, 'Введите корректный номер телефона');
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Валидация поля email
function validateEmailField(input) {
    const value = input.value.trim();
    
    if (!validateEmail(value)) {
        showFieldError(input, 'Введите корректный email адрес');
        return false;
    } else {
        hideFieldError(input);
        return true;
    }
}

// Валидация поля класса
function validateGradeField(select) {
    const value = select.value;
    
    if (value === '') {
        showFieldError(select, 'Выберите класс ученика');
        return false;
    } else {
        hideFieldError(select);
        return true;
    }
}

// Показать ошибку поля
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Удаляем существующее сообщение об ошибке
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем новое сообщение об ошибке
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#F44336';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
}

// Скрыть ошибку поля
function hideFieldError(field) {
    field.classList.remove('error');
    
    // Удаляем сообщение об ошибке
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Сохранение данных формы в localStorage для аналитики
function saveFormSubmission(data, formType) {
    try {
        // Получаем существующие данные или создаем новый массив
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        
        // Добавляем новую запись
        submissions.push({
            type: formType,
            data: data,
            timestamp: new Date().toISOString()
        });
        
        // Сохраняем обновленные данные
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
        
        // В реальном проекте здесь можно отправить данные в аналитическую систему
        console.log('Form submission saved:', { type: formType, data: data });
    } catch (error) {
        console.error('Error saving form submission:', error);
    }
}

// Функция для получения статистики по формам (для аналитики)
function getFormStatistics() {
    try {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        const stats = {
            total: submissions.length,
            trialLessons: submissions.filter(s => s.type === 'trial_lesson').length,
            contacts: submissions.filter(s => s.type === 'contact').length,
            byGrade: {},
            recentSubmissions: submissions.slice(-5).reverse()
        };
        
        // Считаем статистику по классам
        submissions.forEach(submission => {
            if (submission.data.grade) {
                stats.byGrade[submission.data.grade] = (stats.byGrade[submission.data.grade] || 0) + 1;
            }
        });
        
        return stats;
    } catch (error) {
        console.error('Error getting form statistics:', error);
        return null;
    }
}

// Функция для очистки старых данных формы (старше 30 дней)
function cleanOldFormSubmissions() {
    try {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const filteredSubmissions = submissions.filter(submission => {
            return new Date(submission.timestamp) > thirtyDaysAgo;
        });
        
        localStorage.setItem('formSubmissions', JSON.stringify(filteredSubmissions));
        console.log('Old form submissions cleaned');
    } catch (error) {
        console.error('Error cleaning old form submissions:', error);
    }
}

// Очищаем старые данные при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    cleanOldFormSubmissions();
});

// Дополнительные утилиты для работы с формами

// Функция для автоматического заполнения полей на основе URL параметров
function autofillFormFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Заполняем поле имени, если есть параметр name
    if (urlParams.has('name')) {
        const nameInputs = document.querySelectorAll('input[name="name"]');
        nameInputs.forEach(input => {
            input.value = urlParams.get('name');
        });
    }
    
    // Заполняем поле email, если есть параметр email
    if (urlParams.has('email')) {
        const emailInputs = document.querySelectorAll('input[name="email"]');
        emailInputs.forEach(input => {
            input.value = urlParams.get('email');
        });
    }
    
    // Заполняем поле телефона, если есть параметр phone
    if (urlParams.has('phone')) {
        const phoneInputs = document.querySelectorAll('input[name="phone"]');
        phoneInputs.forEach(input => {
            input.value = urlParams.get('phone');
        });
    }
    
    // Заполняем поле класса, если есть параметр grade
    if (urlParams.has('grade')) {
        const gradeSelects = document.querySelectorAll('select[name="grade"]');
        gradeSelects.forEach(select => {
            select.value = urlParams.get('grade');
        });
    }
}

// Автозаполнение форм при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    autofillFormFromUrl();
});

// Функция для добавления CSS-стилей для ошибок валидации
function addFormValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        input.error, select.error, textarea.error {
            border-color: #F44336 !important;
            box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
        }
        
        .field-error {
            color: #F44336;
            font-size: 0.8rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease-out;
        }
        
        button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    
    document.head.appendChild(style);
}

// Добавляем стили при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    addFormValidationStyles();
});