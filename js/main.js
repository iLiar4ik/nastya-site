// Функция для инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initMobileMenu();
    initSmoothScroll();
    initTariffSelection();
    initCalculator();
    initScrollAnimations();
    initModal();
    initNotifications();
});

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Изменение иконки меню
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Плавная прокрутка к секциям
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Выбор тарифа
function initTariffSelection() {
    const tariffButtons = document.querySelectorAll('[data-tariff]');
    
    tariffButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tariff = this.getAttribute('data-tariff');
            
            // Устанавливаем выбранный тариф в калькуляторе
            const tariffSelect = document.getElementById('tariff-select');
            if (tariffSelect) {
                tariffSelect.value = tariff;
                updateCalculator();
                
                // Прокручиваем к калькулятору
                const calculator = document.getElementById('calculator');
                if (calculator) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = calculator.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Показываем уведомление
                showNotification('Тариф выбран! Теперь вы можете рассчитать стоимость в калькуляторе ниже.');
            }
        });
    });
}

// Калькулятор стоимости
function initCalculator() {
    const tariffSelect = document.getElementById('tariff-select');
    const lessonsCount = document.getElementById('lessons-count');
    const duration = document.getElementById('duration');
    
    if (tariffSelect && lessonsCount && duration) {
        tariffSelect.addEventListener('change', updateCalculator);
        lessonsCount.addEventListener('input', updateCalculator);
        duration.addEventListener('change', updateCalculator);
        
        // Инициализация калькулятора при загрузке
        updateCalculator();
    }
}

function updateCalculator() {
    const tariffSelect = document.getElementById('tariff-select');
    const lessonsCount = document.getElementById('lessons-count');
    const duration = document.getElementById('duration');
    const totalPriceElement = document.getElementById('total-price');
    
    if (!tariffSelect || !lessonsCount || !duration || !totalPriceElement) return;
    
    const selectedOption = tariffSelect.options[tariffSelect.selectedIndex];
    const basePrice = parseInt(selectedOption.getAttribute('data-price'));
    const count = parseInt(lessonsCount.value) || 1;
    const durationMinutes = parseInt(duration.value);
    
    // Расчет цены в зависимости от длительности
    let price = basePrice;
    if (durationMinutes === 90) {
        price = Math.round(basePrice * 1.5);
    } else if (durationMinutes === 120) {
        price = basePrice * 2;
    }
    
    // Применение скидок
    let discount = 0;
    if (count >= 20) {
        discount = 15;
    } else if (count >= 10) {
        discount = 10;
    } else if (count >= 5) {
        discount = 5;
    }
    
    const totalPrice = price * count;
    const discountedPrice = Math.round(totalPrice * (1 - discount / 100));
    
    // Отображение результата
    if (discount > 0) {
        totalPriceElement.innerHTML = `
            <span style="text-decoration: line-through; opacity: 0.7; font-size: 0.8em;">${totalPrice} руб.</span><br>
            ${discountedPrice} руб. <span style="font-size: 0.8em;">(скидка ${discount}%)</span>
        `;
    } else {
        totalPriceElement.textContent = `${discountedPrice} руб.`;
    }
}

// Анимации при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми секциями
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Наблюдаем за тарифными карточками
    const tariffCards = document.querySelectorAll('.tariff-card');
    tariffCards.forEach((card, index) => {
        // Добавляем задержку для каждой карточки
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Модальное окно
function initModal() {
    const modal = document.getElementById('modal');
    const closeModalBtn = modal ? modal.querySelector('.shadcn-modal-close') : null;
    const trialLessonBtn = document.getElementById('trial-lesson-btn');
    
    if (modal && closeModalBtn) {
        // Закрытие модального окна по клику на крестик
        closeModalBtn.addEventListener('click', function() {
            closeModal();
        });
        
        // Закрытие модального окна по клику вне его
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Закрытие модального окна по нажатию на ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    if (trialLessonBtn) {
        trialLessonBtn.addEventListener('click', function() {
            openTrialLessonModal();
        });
    }
}

function openModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    if (modal && modalBody) {
        modalBody.innerHTML = content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function openTrialLessonModal() {
    const modal = document.getElementById('modal');
    const modalTitle = modal ? modal.querySelector('.shadcn-modal-title') : null;
    
    if (modalTitle) {
        modalTitle.textContent = 'Записаться на пробное занятие';
    }
    
    const content = `
        <p>Оставьте свои контактные данные, и я свяжусь с вами в ближайшее время для обсуждения деталей.</p>
        <form id="modal-trial-form" class="shadcn-form">
            <div class="form-group">
                <label for="modal-name">Имя родителя/ученика:</label>
                <input type="text" id="modal-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="modal-phone">Телефон:</label>
                <input type="tel" id="modal-phone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="modal-email">Email:</label>
                <input type="email" id="modal-email" name="email" required>
            </div>
            <div class="form-group">
                <label for="modal-grade">Класс ученика:</label>
                <select id="modal-grade" name="grade" required>
                    <option value="" disabled selected>Выберите класс</option>
                    <option value="5">5 класс</option>
                    <option value="6">6 класс</option>
                    <option value="7">7 класс</option>
                    <option value="8">8 класс</option>
                    <option value="9">9 класс</option>
                    <option value="10">10 класс</option>
                    <option value="11">11 класс</option>
                </select>
            </div>
            <div class="form-group">
                <label for="modal-message">Дополнительная информация:</label>
                <textarea id="modal-message" name="message" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Отправить заявку</button>
        </form>
    `;
    
    openModal(content);
    
    // Добавляем обработчик для формы в модальном окне
    const modalForm = document.getElementById('modal-trial-form');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleTrialLessonForm(this);
        });
    }
}

// Уведомления
function initNotifications() {
    const notificationClose = document.querySelector('.notification-close');
    
    if (notificationClose) {
        notificationClose.addEventListener('click', function() {
            hideNotification();
        });
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = notification ? notification.querySelector('.notification-message') : null;
    
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

function hideNotification() {
    const notification = document.getElementById('notification');
    
    if (notification) {
        notification.classList.remove('show');
    }
}

// Дополнительные функции для улучшения UX

// Функция для валидации телефона
function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Функция для валидации email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для форматирования телефона при вводе
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

// Инициализация форматирования телефона
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneInput(this);
        });
        
        input.addEventListener('focus', function() {
            if (this.value === '') {
                this.value = '+7 ';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '+7 ') {
                this.value = '';
            }
        });
    });
});

// Функция для отслеживания прокрутки и добавления класса к шапке
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Инициализация функции прокрутки шапки
document.addEventListener('DOMContentLoaded', function() {
    initHeaderScroll();
});