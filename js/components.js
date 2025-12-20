// Утилиты для работы с компонентами в стиле shadcn/ui

// Инициализация компонентов
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initTooltips();
    initModals();
    initTabs();
    initAccordions();
    initToasts();
    initFormValidation();
    initAnimations();
    initShadcnNavigation();
});

// Управление темами
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Загружаем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Создаем переключатель темы
    themeToggle.innerHTML = `
        <button class="theme-toggle" aria-label="Переключить тему">
            <i class="fas fa-${savedTheme === 'dark' ? 'moon' : 'sun'}"></i>
        </button>
    `;

    // Добавляем обработчик клика
    themeToggle.querySelector('button').addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        themeToggle.className = `fas fa-${theme === 'dark' ? 'moon' : 'sun'}`;
    }
}

// Создание кнопок
function createButton(options = {}) {
    const {
        text = '',
        variant = 'primary',
        size = 'md',
        icon = null,
        round = false,
        iconOnly = false,
        className = '',
        onClick = null,
        disabled = false,
        type = 'button'
    } = options;

    const button = document.createElement('button');
    button.type = type;
    button.className = `shadcn-btn shadcn-btn-${variant} shadcn-btn-${size}`;
    
    if (round) button.classList.add('shadcn-btn-round');
    if (iconOnly) button.classList.add('shadcn-btn-icon');
    if (className) button.classList.add(...className.split(' '));
    if (disabled) button.disabled = true;

    // Добавляем иконку
    if (icon) {
        const iconElement = document.createElement('i');
        iconElement.className = icon;
        button.appendChild(iconElement);
    }

    // Добавляем текст
    if (!iconOnly && text) {
        const textNode = document.createTextNode(text);
        button.appendChild(textNode);
    }

    // Добавляем обработчик клика
    if (onClick) {
        button.addEventListener('click', onClick);
    }

    return button;
}

// Создание карточек
function createCard(options = {}) {
    const {
        title = '',
        description = '',
        content = '',
        footer = '',
        className = '',
        featured = false
    } = options;

    const card = document.createElement('div');
    card.className = `shadcn-card ${className}`;
    if (featured) card.classList.add('featured');

    let cardHTML = '';

    // Header
    if (title || description) {
        cardHTML += '<div class="shadcn-card-header">';
        if (title) cardHTML += `<h3 class="shadcn-card-title">${title}</h3>`;
        if (description) cardHTML += `<p class="shadcn-card-description">${description}</p>`;
        cardHTML += '</div>';
    }

    // Content
    if (content) {
        cardHTML += `<div class="shadcn-card-content">${content}</div>`;
    }

    // Footer
    if (footer) {
        cardHTML += `<div class="shadcn-card-footer">${footer}</div>`;
    }

    card.innerHTML = cardHTML;
    return card;
}

// Создание модальных окон
function createModal(options = {}) {
    const {
        title = '',
        content = '',
        footer = '',
        size = 'md',
        closable = true,
        className = ''
    } = options;

    const overlay = document.createElement('div');
    overlay.className = 'shadcn-modal-overlay';
    overlay.id = `modal-${Date.now()}`;

    const modal = document.createElement('div');
    modal.className = `shadcn-modal shadcn-modal-${size} ${className}`;

    let modalHTML = '';

    // Header
    if (title || closable) {
        modalHTML += '<div class="shadcn-modal-header">';
        if (title) modalHTML += `<h2 class="shadcn-modal-title">${title}</h2>`;
        if (closable) modalHTML += '<button class="shadcn-modal-close" aria-label="Закрыть"><i class="fas fa-times"></i></button>';
        modalHTML += '</div>';
    }

    // Content
    modalHTML += `<div class="shadcn-modal-content">${content}</div>`;

    // Footer
    if (footer) {
        modalHTML += `<div class="shadcn-modal-footer">${footer}</div>`;
    }

    modal.innerHTML = modalHTML;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Добавляем обработчики
    if (closable) {
        const closeBtn = modal.querySelector('.shadcn-modal-close');
        closeBtn.addEventListener('click', () => closeModal(overlay.id));
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal(overlay.id);
        });
    }

    // Показываем модальное окно
    setTimeout(() => overlay.classList.add('active'), 10);

    return overlay;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Создание тостов/уведомлений
function createToast(options = {}) {
    const {
        title = '',
        description = '',
        variant = 'primary',
        duration = 5000,
        closable = true
    } = options;

    const container = getOrCreateToastContainer();

    const toast = document.createElement('div');
    toast.className = `shadcn-toast shadcn-toast-${variant}`;

    let toastHTML = '';

    // Content
    toastHTML += '<div class="shadcn-toast-content">';
    if (title) toastHTML += `<div class="shadcn-toast-title">${title}</div>`;
    if (description) toastHTML += `<div class="shadcn-toast-description">${description}</div>`;
    toastHTML += '</div>';

    // Close button
    if (closable) {
        toastHTML += '<button class="shadcn-toast-close" aria-label="Закрыть"><i class="fas fa-times"></i></button>';
    }

    toast.innerHTML = toastHTML;
    container.appendChild(toast);

    // Добавляем обработчики
    if (closable) {
        const closeBtn = toast.querySelector('.shadcn-toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));
    }

    // Показываем тост
    setTimeout(() => toast.classList.add('show'), 10);

    // Автоматически скрываем
    if (duration > 0) {
        setTimeout(() => removeToast(toast), duration);
    }

    return toast;
}

function getOrCreateToastContainer() {
    let container = document.querySelector('.shadcn-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'shadcn-toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function removeToast(toast) {
    if (toast && toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }
}

// Инициализация модальных окон
function initModals() {
    // Автоматическая инициализация модальных окон с data-атрибутами
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    // Закрытие модальных окон
    document.querySelectorAll('.shadcn-modal-close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.shadcn-modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Закрытие по клику на оверлей
    document.querySelectorAll('.shadcn-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
}

// Инициализация tooltips
function initTooltips() {
    // Инициализация tooltips с data-tooltip атрибутом
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText) {
                // Создаем tooltip элемент, если его еще нет
                let tooltip = this.querySelector('.tooltip-popup');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = 'tooltip-popup';
                    tooltip.textContent = tooltipText;
                    this.style.position = 'relative';
                    this.appendChild(tooltip);
                }
                tooltip.classList.add('show');
            }
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip-popup');
            if (tooltip) {
                tooltip.classList.remove('show');
            }
        });
    });
}

// Инициализация табов
function initTabs() {
    document.querySelectorAll('.shadcn-tabs').forEach(tabsContainer => {
        const triggers = tabsContainer.querySelectorAll('.shadcn-tabs-trigger');
        const panes = tabsContainer.querySelectorAll('.shadcn-tabs-pane');

        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', function() {
                // Удаляем активный класс у всех
                triggers.forEach(t => t.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));

                // Добавляем активный класс текущим
                this.classList.add('active');
                if (panes[index]) {
                    panes[index].classList.add('active');
                }
            });
        });
    });
}

// Инициализация аккордеонов
function initAccordions() {
    document.querySelectorAll('.shadcn-accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');

            // Закрываем все аккордеоны в той же группе
            const accordion = this.closest('.shadcn-accordion');
            accordion.querySelectorAll('.shadcn-accordion-trigger').forEach(t => {
                t.classList.remove('active');
            });
            accordion.querySelectorAll('.shadcn-accordion-content').forEach(c => {
                c.classList.remove('active');
            });

            // Открываем текущий, если он был закрыт
            if (!isActive) {
                this.classList.add('active');
                if (content) {
                    content.classList.add('active');
                }
            }
        });
    });
}

// Инициализация тостов
function initToasts() {
    // Глобальная функция для показа тостов
    window.showToast = createToast;
}

// Валидация форм
function initFormValidation() {
    document.querySelectorAll('.shadcn-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(form)) {
                // Если форма валидна, вызываем кастомный обработчик
                const customSubmit = this.getAttribute('data-on-submit');
                if (customSubmit && window[customSubmit]) {
                    window[customSubmit](this);
                } else {
                    // Стандартная отправка формы
                    this.submit();
                }
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Проверка на обязательность
    if (required && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }

    // Специфические проверки
    if (value && isValid) {
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Введите корректный email адрес';
                }
                break;
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                    isValid = false;
                    errorMessage = 'Введите корректный номер телефона';
                }
                break;
        }
    }

    // Показываем или скрываем ошибку
    if (isValid) {
        hideFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

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
    
    field.parentNode.appendChild(errorElement);
}

function hideFieldError(field) {
    field.classList.remove('error');
    
    // Удаляем сообщение об ошибке
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Инициализация анимаций
function initAnimations() {
    // Анимация при прокрутке
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('shadcn-fade-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с атрибутом data-animate
    document.querySelectorAll('[data-animate]').forEach(element => {
        observer.observe(element);
    });
}

// Утилиты для работы с прогресс-барами
function updateProgressBar(progressId, value, max = 100) {
    const progressBar = document.getElementById(progressId);
    if (!progressBar) return;

    const percentage = Math.min((value / max) * 100, 100);
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', value);
    progressBar.setAttribute('aria-valuemax', max);
}

// Утилиты для работы с табами
function switchTab(tabGroupId, tabId) {
    const tabGroup = document.getElementById(tabGroupId);
    if (!tabGroup) return;

    // Удаляем активный класс у всех табов и панелей
    tabGroup.querySelectorAll('.shadcn-tabs-trigger').forEach(trigger => {
        trigger.classList.remove('active');
    });
    tabGroup.querySelectorAll('.shadcn-tabs-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Добавляем активный класс выбранному табу и панели
    const activeTrigger = tabGroup.querySelector(`[data-tab="${tabId}"]`);
    const activePane = tabGroup.querySelector(`#${tabId}`);

    if (activeTrigger) activeTrigger.classList.add('active');
    if (activePane) activePane.classList.add('active');
}

// Утилиты для работы с аккордеонами
function toggleAccordion(accordionId, forceState = null) {
    const accordion = document.getElementById(accordionId);
    if (!accordion) return;

    const trigger = accordion.querySelector('.shadcn-accordion-trigger');
    const content = accordion.querySelector('.shadcn-accordion-content');
    
    if (!trigger || !content) return;

    const isActive = trigger.classList.contains('active');
    
    if (forceState === null) {
        // Переключаем состояние
        trigger.classList.toggle('active');
        content.classList.toggle('active');
    } else {
        // Устанавливаем указанное состояние
        trigger.classList.toggle('active', forceState);
        content.classList.toggle('active', forceState);
    }
}

// Утилиты для создания форм
function createForm(options = {}) {
    const {
        fields = [],
        submitText = 'Отправить',
        submitVariant = 'primary',
        onSubmit = null,
        className = ''
    } = options;

    const form = document.createElement('form');
    form.className = `shadcn-form ${className}`;

    // Добавляем поля
    fields.forEach(field => {
        const fieldElement = createFormField(field);
        form.appendChild(fieldElement);
    });

    // Добавляем кнопку отправки
    const submitBtn = createButton({
        text: submitText,
        variant: submitVariant,
        type: 'submit'
    });
    form.appendChild(submitBtn);

    // Добавляем обработчик отправки
    if (onSubmit) {
        form.addEventListener('submit', onSubmit);
    }

    return form;
}

function createFormField(options = {}) {
    const {
        type = 'text',
        name = '',
        label = '',
        placeholder = '',
        required = false,
        selectOptions = null,
        className = ''
    } = options;

    const group = document.createElement('div');
    group.className = 'shadcn-form-group';

    // Создаем label
    if (label) {
        const labelElement = document.createElement('label');
        labelElement.className = 'shadcn-label';
        labelElement.textContent = label;
        labelElement.setAttribute('for', name);
        group.appendChild(labelElement);
    }

    let input;
    
    switch (type) {
        case 'select':
            input = document.createElement('select');
            input.className = 'shadcn-select';
            if (selectOptions) {
                selectOptions.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    input.appendChild(optionElement);
                });
            }
            break;
        case 'textarea':
            input = document.createElement('textarea');
            input.className = 'shadcn-input shadcn-textarea';
            input.placeholder = placeholder;
            break;
        default:
            input = document.createElement('input');
            input.type = type;
            input.className = 'shadcn-input';
            input.placeholder = placeholder;
    }

    input.name = name;
    input.id = name;
    if (required) input.setAttribute('required', '');
    if (className) input.classList.add(...className.split(' '));

    group.appendChild(input);
    return group;
}

// Утилиты для создания бейджей
function createBadge(text, variant = 'primary', className = '') {
    const badge = document.createElement('span');
    badge.className = `shadcn-badge shadcn-badge-${variant} ${className}`;
    badge.textContent = text;
    return badge;
}

// Утилиты для создания алертов
function createAlert(title, description, variant = 'primary', className = '') {
    const alert = document.createElement('div');
    alert.className = `shadcn-alert shadcn-alert-${variant} ${className}`;

    let icon = '';
    switch (variant) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            break;
        default:
            icon = 'fas fa-info-circle';
    }

    alert.innerHTML = `
        <div class="shadcn-alert-icon">
            <i class="${icon}"></i>
        </div>
        <div class="shadcn-alert-content">
            ${title ? `<div class="shadcn-alert-title">${title}</div>` : ''}
            ${description ? `<div class="shadcn-alert-description">${description}</div>` : ''}
        </div>
    `;

    return alert;
}

// Экспорт утилит для использования в других файлах
window.ShadcnUI = {
    createButton,
    createCard,
    createModal,
    closeModal,
    createToast,
    createForm,
    createFormField,
    createBadge,
    createAlert,
    updateProgressBar,
    switchTab,
    toggleAccordion,
    validateForm,
    validateField,
    showFieldError,
    hideFieldError,
    toggleTheme,
    setTheme
};

// Инициализация навигации shadcn
function initShadcnNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.shadcn-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (!mobileMenuToggle || !nav) return;
    
    // Создаем оверлей, если его нет
    if (!navOverlay) {
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
        
        // Добавляем обработчик для закрытия меню при клике на оверлей
        overlay.addEventListener('click', closeMobileNav);
    }
    
    // Обработчик для кнопки мобильного меню
    mobileMenuToggle.addEventListener('click', toggleMobileNav);
    
    // Закрытие меню при клике на пункт навигации
    const navItems = nav.querySelectorAll('.shadcn-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            closeMobileNav();
        });
    });
    
    // Закрытие меню при нажатии на ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
            closeMobileNav();
        }
    });
}

function toggleMobileNav() {
    const nav = document.querySelector('.shadcn-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!nav || !navOverlay || !mobileMenuToggle) return;
    
    const isOpen = nav.classList.contains('mobile-open');
    
    if (isOpen) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
}

function openMobileNav() {
    const nav = document.querySelector('.shadcn-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!nav || !navOverlay || !mobileMenuToggle) return;
    
    nav.classList.add('mobile-open');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Изменяем иконку кнопки
    const icon = mobileMenuToggle.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
}

function closeMobileNav() {
    const nav = document.querySelector('.shadcn-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (!nav || !navOverlay || !mobileMenuToggle) return;
    
    nav.classList.remove('mobile-open');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Возвращаем иконку кнопки
    const icon = mobileMenuToggle.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Функция для подсветки активного пункта меню
function setActiveNavItem(currentPage) {
    const navItems = document.querySelectorAll('.shadcn-nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        
        // Проверяем href или data-page атрибут
        const href = item.getAttribute('href');
        const dataPage = item.getAttribute('data-page');
        
        if ((href && href.includes(currentPage)) || (dataPage && dataPage === currentPage)) {
            item.classList.add('active');
        }
    });
}

// Экспорт дополнительных функций
window.ShadcnNavigation = {
    toggleMobileNav,
    openMobileNav,
    closeMobileNav,
    setActiveNavItem
};