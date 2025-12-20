document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const notification = document.getElementById('notification');
    const notificationMessage = document.querySelector('.notification-message');
    const notificationClose = document.querySelector('.notification-close');

    // Проверка, запомнил ли пользователь свой логин
    const checkRememberedUser = () => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    };

    // Функция валидации email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Функция валидации пароля
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // Функция очистки ошибок
    const clearErrors = () => {
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('error');
        });
    };

    // Функция показа ошибки для конкретного поля
    const showError = (field, message) => {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    };

    // Функция показа уведомления
    const showNotification = (message, type = 'success') => {
        notificationMessage.textContent = message;
        notification.style.backgroundColor = type === 'success' ? 'var(--primary-color)' : '#f44336';
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    };

    // Функция закрытия уведомления
    const closeNotification = () => {
        notification.classList.remove('show');
    };

    // Функция сохранения сессии
    const saveSession = (user) => {
        const sessionData = {
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        
        // Если пользователь выбрал "Запомнить меня"
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', user.email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    };

    // Функция перенаправления в панель управления
    const redirectToDashboard = () => {
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    };

    // Функция для добавления эффекта загрузки на кнопку
    const loginButton = loginForm.querySelector('.login-btn');
    const showButtonLoading = () => {
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';
    };

    const hideButtonLoading = () => {
        loginButton.disabled = false;
        loginButton.textContent = 'Войти';
    };

    // Обработчик отправки формы
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Валидация полей
        let isValid = true;
        
        if (!validateEmail(email)) {
            showError(emailInput, 'Введите корректный email адрес');
            isValid = false;
        }
        
        if (!validatePassword(password)) {
            showError(passwordInput, 'Пароль должен содержать минимум 6 символов');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Показываем эффект загрузки
        showButtonLoading();
        
        try {
            // Используем API клиент для входа
            const result = await window.apiClient.login(email, password);
            
            if (result.user) {
                // Сохраняем сессию
                saveSession(result.user);
                
                // Показываем уведомление об успешном входе
                showNotification('Вход выполнен успешно! Перенаправление в панель управления...', 'success');
                
                // Перенаправляем в панель управления
                redirectToDashboard();
            }
        } catch (error) {
            // Скрываем эффект загрузки
            hideButtonLoading();
            
            // Показываем ошибку аутентификации
            const errorMessage = error.message || 'Неверный email или пароль. Проверьте введенные данные.';
            showNotification(errorMessage, 'error');
            
            // Добавляем ошибку к полям
            showError(emailInput, errorMessage);
            showError(passwordInput, errorMessage);
        }
    });

    // Обработчик закрытия уведомления
    if (notificationClose) {
        notificationClose.addEventListener('click', closeNotification);
    }

    // Обработчики для очистки ошибок при вводе
    emailInput.addEventListener('input', function() {
        if (this.closest('.form-group').classList.contains('error')) {
            this.closest('.form-group').classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.closest('.form-group').classList.contains('error')) {
            this.closest('.form-group').classList.remove('error');
        }
    });

    // Инициализация при загрузке страницы
    checkRememberedUser();

    // Проверка, авторизован ли пользователь (через токен)
    const checkAuthStatus = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                // Проверяем токен через API
                const result = await window.apiClient.getCurrentUser();
                if (result.user) {
                    // Если токен валиден, перенаправляем в панель управления
                    window.location.href = 'dashboard.html';
                }
            } catch (error) {
                // Токен невалиден, очищаем его
                window.apiClient.clearTokens();
                localStorage.removeItem('currentUser');
            }
        }
    };

    // Проверяем статус авторизации при загрузке страницы
    // Ждем загрузки API клиента
    setTimeout(() => {
        if (window.apiClient) {
            checkAuthStatus();
        }
    }, 100);

    // Добавляем анимацию для кнопки входа
    if (loginButton) {
        loginButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        loginButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
});
