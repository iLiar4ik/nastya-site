document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    const notification = document.getElementById('notification');
    const notificationMessage = document.querySelector('.notification-message');
    const notificationClose = document.querySelector('.notification-close');
    const sidebarMenuLinks = document.querySelectorAll('.sidebar-menu a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    
    // Элементы статистики на главной странице
    const totalStudentsCard = document.querySelector('.dashboard-card-value');
    const newStudentsTable = document.querySelector('.students-table tbody');

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

    // Функция получения инициалов пользователя
    const getUserInitials = (name) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        } else if (parts.length === 1) {
            return parts[0][0];
        }
        return 'П';
    };

    // Функция обновления статистики на главной странице
    const updateDashboardStats = async () => {
        try {
            // Загружаем статистику и учеников через API
            const [statistics, studentsResult] = await Promise.all([
                window.apiClient.getStudentStatistics(),
                window.apiClient.getStudents({ page: 1, limit: 3 })
            ]);
            
            // Обновляем карточки статистики
            const statCards = document.querySelectorAll('.shadcn-stat-card');
            if (statCards.length >= 4) {
                statCards[0].querySelector('.shadcn-stat-value').textContent = statistics.total || 0;
                // Остальные карточки обновятся из аналитики
            }
            
            // Обновляем таблицу новых учеников
            if (newStudentsTable && studentsResult.students) {
                newStudentsTable.innerHTML = studentsResult.students.map(student => {
                    const statusClass = student.status;
                    const statusText = getStatusText(student.status);
                    const tariffText = getTariffText(student.tariff);
                    const createdDate = formatDate(student.created_at);
                    
                    return `
                        <tr>
                            <td>${student.first_name} ${student.last_name}</td>
                            <td>${student.grade} класс</td>
                            <td>${tariffText}</td>
                            <td><span class="student-status ${statusClass}">${statusText}</span></td>
                            <td>${createdDate}</td>
                        </tr>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
            showNotification('Ошибка загрузки статистики', 'error');
        }
    };

    // Функция форматирования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Сегодня';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Вчера';
        } else {
            const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
            if (daysDiff < 7) {
                return `${daysDiff} дня назад`;
            } else {
                return date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long'
                });
            }
        }
    };

    // Функция получения текста статуса
    const getStatusText = (status) => {
        const statusMap = {
            'active': 'Активный',
            'trial': 'Пробное занятие',
            'inactive': 'Неактивный'
        };
        return statusMap[status] || status;
    };

    // Функция получения текста тарифа
    const getTariffText = (tariff) => {
        const tariffMap = {
            'standard': 'Стандартный курс',
            'oge': 'Подготовка к ОГЭ',
            'ege': 'Подготовка к ЕГЭ',
            'intensive': 'Интенсивный курс'
        };
        return tariffMap[tariff] || tariff;
    };

    // Функция проверки авторизации пользователя
    const checkAuthStatus = async () => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
            // Если токен отсутствует, перенаправляем на страницу входа
            window.location.href = 'login.html';
            return null;
        }
        
        try {
            // Проверяем токен через API
            const result = await window.apiClient.getCurrentUser();
            if (result.user) {
                // Сохраняем пользователя в localStorage для совместимости
                const sessionData = {
                    userId: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(sessionData));
                return sessionData;
            }
        } catch (error) {
            // Токен невалиден, очищаем его и перенаправляем на вход
            window.apiClient.clearTokens();
            localStorage.removeItem('currentUser');
            showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return null;
        }
        
        return null;
    };

    // Функция обновления информации о пользователе в интерфейсе
    const updateUserInfo = (user) => {
        if (user) {
            userName.textContent = user.name;
            userAvatar.textContent = getUserInitials(user.name);
        }
    };

    // Функция выхода из системы
    const logout = async () => {
        try {
            await window.apiClient.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('currentUser');
        showNotification('Вы вышли из системы', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    };

    // Функция переключения активного пункта меню
    const setActiveMenuItem = (pageName) => {
        sidebarMenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });
    };

    // Функция мобильного меню
    const toggleMobileMenu = () => {
        dashboardSidebar.classList.toggle('active');
    };

    // Функция генерации демо-данных для разных разделов
    const generatePageContent = (pageName) => {
        const dashboardContent = document.querySelector('.dashboard-content');
        
        switch (pageName) {
                case 'students':
                    // Перенаправляем на страницу учеников
                    window.location.href = 'students.html';
                    return;
            case 'schedule':
                dashboardContent.innerHTML = `
                    <h1 class="dashboard-title">Расписание</h1>
                    <div class="dashboard-section">
                        <div class="dashboard-section-title">
                            Расписание на неделю
                            <button class="btn btn-primary" onclick="showNotification('Функция добавления занятия в разработке', 'error')">
                                <i class="fas fa-plus"></i> Добавить занятие
                            </button>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                                <button class="btn btn-outline">Сегодня</button>
                                <button class="btn btn-outline">Завтра</button>
                                <button class="btn btn-outline">Эта неделя</button>
                                <button class="btn btn-outline">Следующая неделя</button>
                            </div>
                        </div>
                        <table class="students-table">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Время</th>
                                    <th>Ученик</th>
                                    <th>Класс</th>
                                    <th>Тип занятия</th>
                                    <th>Длительность</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>25 ноября</td>
                                    <td>15:00</td>
                                    <td>Александр Петров</td>
                                    <td>9 класс</td>
                                    <td>Пробное занятие</td>
                                    <td>60 мин</td>
                                    <td><span class="student-status trial">Запланировано</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>25 ноября</td>
                                    <td>16:30</td>
                                    <td>Елена Козлова</td>
                                    <td>8 класс</td>
                                    <td>Обычное занятие</td>
                                    <td>60 мин</td>
                                    <td><span class="student-status trial">Запланировано</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>25 ноября</td>
                                    <td>18:00</td>
                                    <td>Михаил Новиков</td>
                                    <td>11 класс</td>
                                    <td>Подготовка к ЕГЭ</td>
                                    <td>90 мин</td>
                                    <td><span class="student-status trial">Запланировано</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                break;
                
            case 'lessons':
                dashboardContent.innerHTML = `
                    <h1 class="dashboard-title">Занятия</h1>
                    <div class="dashboard-section">
                        <div class="dashboard-section-title">
                            Проведенные занятия
                            <button class="btn btn-primary" onclick="showNotification('Функция добавления занятия в разработке', 'error')">
                                <i class="fas fa-plus"></i> Добавить занятие
                            </button>
                        </div>
                        <table class="students-table">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Ученик</th>
                                    <th>Класс</th>
                                    <th>Тип занятия</th>
                                    <th>Длительность</th>
                                    <th>Стоимость</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>24 ноября</td>
                                    <td>Мария Иванова</td>
                                    <td>7 класс</td>
                                    <td>Обычное занятие</td>
                                    <td>60 мин</td>
                                    <td>1800 ₽</td>
                                    <td><span class="student-status active">Проведено</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>23 ноября</td>
                                    <td>Елена Козлова</td>
                                    <td>8 класс</td>
                                    <td>Обычное занятие</td>
                                    <td>60 мин</td>
                                    <td>1800 ₽</td>
                                    <td><span class="student-status active">Проведено</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                break;
                
            case 'payments':
                dashboardContent.innerHTML = `
                    <h1 class="dashboard-title">Платежи</h1>
                    <div class="dashboard-cards">
                        <div class="dashboard-card">
                            <div class="dashboard-card-title">Доход за месяц</div>
                            <div class="dashboard-card-value">₽45,600</div>
                            <div class="dashboard-card-change positive">
                                <i class="fas fa-arrow-up"></i> +12% к прошлому месяцу
                            </div>
                        </div>
                        <div class="dashboard-card">
                            <div class="dashboard-card-title">Ожидается платежей</div>
                            <div class="dashboard-card-value">₽12,000</div>
                            <div class="dashboard-card-change">
                                <i class="fas fa-clock"></i> 3 платежа на этой неделе
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-section">
                        <div class="dashboard-section-title">
                            История платежей
                            <button class="btn btn-primary" onclick="showNotification('Функция добавления платежа в разработке', 'error')">
                                <i class="fas fa-plus"></i> Добавить платеж
                            </button>
                        </div>
                        <table class="students-table">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Ученик</th>
                                    <th>Сумма</th>
                                    <th>Тип</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>20 ноября</td>
                                    <td>Мария Иванова</td>
                                    <td>7200 ₽</td>
                                    <td>Оплата за 4 занятия</td>
                                    <td><span class="student-status active">Оплачено</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-receipt"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>18 ноября</td>
                                    <td>Елена Козлова</td>
                                    <td>5400 ₽</td>
                                    <td>Оплата за 3 занятия</td>
                                    <td><span class="student-status active">Оплачено</span></td>
                                    <td>
                                        <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">
                                            <i class="fas fa-receipt"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                break;
                
            case 'materials':
                dashboardContent.innerHTML = `
                    <h1 class="dashboard-title">Учебные материалы</h1>
                    <div class="dashboard-section">
                        <div class="dashboard-section-title">
                            Мои материалы
                            <button class="btn btn-primary" onclick="showNotification('Функция загрузки материалов в разработке', 'error')">
                                <i class="fas fa-upload"></i> Загрузить материал
                            </button>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                            <div class="dashboard-card">
                                <div class="dashboard-card-title">Математика 7 класс</div>
                                <div class="dashboard-card-value">15 файлов</div>
                                <div class="dashboard-card-change">
                                    <i class="fas fa-folder"></i> Папка с материалами
                                </div>
                            </div>
                            <div class="dashboard-card">
                                <div class="dashboard-card-title">Подготовка к ОГЭ</div>
                                <div class="dashboard-card-value">23 файла</div>
                                <div class="dashboard-card-change">
                                    <i class="fas fa-folder"></i> Папка с материалами
                                </div>
                            </div>
                            <div class="dashboard-card">
                                <div class="dashboard-card-title">Подготовка к ЕГЭ</div>
                                <div class="dashboard-card-value">31 файл</div>
                                <div class="dashboard-card-change">
                                    <i class="fas fa-folder"></i> Папка с материалами
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'reports':
                dashboardContent.innerHTML = `
                    <h1 class="dashboard-title">Отчеты</h1>
                    <div class="dashboard-cards">
                        <div class="dashboard-card">
                            <div class="dashboard-card-title">Всего занятий</div>
                            <div class="dashboard-card-value">156</div>
                            <div class="dashboard-card-change positive">
                                <i class="fas fa-arrow-up"></i> +15 за месяц
                            </div>
                        </div>
                        <div class="dashboard-card">
                            <div class="dashboard-card-title">Средний прогресс</div>
                            <div class="dashboard-card-value">+23%</div>
                            <div class="dashboard-card-change positive">
                                <i class="fas fa-arrow-up"></i> +5% за квартал
                            </div>
                        </div>
                    </div>
                    <div class="dashboard-section">
                        <div class="dashboard-section-title">
                            График прогресса учеников
                            <button class="btn btn-primary" onclick="showNotification('Функция генерации отчетов в разработке', 'error')">
                                <i class="fas fa-download"></i> Скачать отчет
                            </button>
                        </div>
                        <div style="height: 300px; display: flex; align-items: center; justify-content: center; background-color: var(--bg-light); border-radius: var(--border-radius);">
                            <div style="text-align: center; color: var(--text-light);">
                                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 15px;"></i>
                                <p>График прогресса учеников</p>
                                <p style="font-size: 0.9rem;">Функция графиков в разработке</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'settings':
                dashboardContent.innerHTML = `
                    <h1 class="dashboard-title">Настройки</h1>
                    <div class="dashboard-section">
                        <div class="dashboard-section-title">
                            Профиль
                        </div>
                        <form id="profile-form">
                            <div class="form-group">
                                <label for="profile-name">Имя</label>
                                <input type="text" id="profile-name" value="${checkAuthStatus()?.name || ''}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" value="${checkAuthStatus()?.email || ''}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="profile-phone">Телефон</label>
                                <input type="tel" id="profile-phone" placeholder="+7 (999) 123-45-67">
                            </div>
                            <div class="form-group">
                                <label for="profile-bio">О себе</label>
                                <textarea id="profile-bio" rows="4" placeholder="Расскажите о себе..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                        </form>
                    </div>
                    
                    <div class="dashboard-section">
                        <div class="dashboard-section-title">
                            Безопасность
                        </div>
                        <form id="security-form">
                            <div class="form-group">
                                <label for="current-password">Текущий пароль</label>
                                <input type="password" id="current-password" placeholder="Введите текущий пароль">
                            </div>
                            <div class="form-group">
                                <label for="new-password">Новый пароль</label>
                                <input type="password" id="new-password" placeholder="Введите новый пароль">
                            </div>
                            <div class="form-group">
                                <label for="confirm-new-password">Подтверждение нового пароля</label>
                                <input type="password" id="confirm-new-password" placeholder="Подтвердите новый пароль">
                            </div>
                            <button type="submit" class="btn btn-primary">Изменить пароль</button>
                        </form>
                    </div>
                `;
                
                        // Добавляем обработчики для форм настроек
                        const profileForm = document.getElementById('profile-form');
                        const securityForm = document.getElementById('security-form');
                        
                        profileForm.addEventListener('submit', function(e) {
                            e.preventDefault();
                            showNotification('Профиль успешно обновлен', 'success');
                        });
                        
                        securityForm.addEventListener('submit', function(e) {
                            e.preventDefault();
                            showNotification('Пароль успешно изменен', 'success');
                        });
                break;
                
            default:
                // Если страница не найдена, возвращаем на главную
                location.reload();
                return;
        }
    };

    // Инициализация при загрузке страницы
    const initDashboard = async () => {
        const currentUser = await checkAuthStatus();
        
        if (currentUser) {
            updateUserInfo(currentUser);
            
            // Обработчик выхода
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }
            
            // Обработчик закрытия уведомления
            if (notificationClose) {
                notificationClose.addEventListener('click', closeNotification);
            }
            
            // Обработчики для пунктов меню
            sidebarMenuLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const pageName = this.dataset.page;
                    
                    if (pageName && pageName !== 'dashboard') {
                        setActiveMenuItem(pageName);
                        generatePageContent(pageName);
                    } else if (pageName === 'dashboard') {
                        // Если выбрана главная страница, перезагружаем страницу
                        location.reload();
                    }
                });
            });
            
            // Обновляем статистику на главной странице
            await updateDashboardStats();
            
            // Обработчик для мобильного меню
            if (mobileMenuBtn) {
                mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            }
            
            // Показываем приветственное уведомление
            const lastLoginTime = new Date(currentUser.loginTime);
            const currentTime = new Date();
            const hoursSinceLogin = (currentTime - lastLoginTime) / (1000 * 60 * 60);
            
            if (hoursSinceLogin < 0.1) {
                showNotification(`Добро пожаловать, ${currentUser.name}!`, 'success');
            }
        }
    };

    // Ждем загрузки API клиента
    if (window.apiClient) {
        initDashboard();
    } else {
        // Если API клиент еще не загружен, ждем
        const checkApiClient = setInterval(() => {
            if (window.apiClient) {
                clearInterval(checkApiClient);
                initDashboard();
            }
        }, 100);
    }
});