// JavaScript для детальной страницы ученика
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переменных
    let currentStudent = null;
    let currentTab = 'info';

    // Элементы DOM
    const studentFullName = document.getElementById('student-full-name');
    const studentAvatarLarge = document.getElementById('student-avatar-large');
    const studentGrade = document.getElementById('student-grade');
    const studentPhone = document.getElementById('student-phone');
    const studentEmail = document.getElementById('student-email');
    const studentAge = document.getElementById('student-age');
    const studentStatus = document.getElementById('student-status');
    
    // Вкладки
    const tabButtons = document.querySelectorAll('.shadcn-tabs-trigger');
    const tabContents = document.querySelectorAll('.shadcn-tabs-pane');
    
    // Кнопки действий
    const editStudentBtn = document.getElementById('edit-student-btn');
    const backToStudentsBtn = document.getElementById('back-to-students-btn');
    const addLessonBtn = document.getElementById('add-lesson-btn');
    
    // Элементы вкладки "Основная информация"
    const infoFullName = document.getElementById('info-full-name');
    const infoGrade = document.getElementById('info-grade');
    const infoBirthDate = document.getElementById('info-birth-date');
    const infoAge = document.getElementById('info-age');
    const infoPhone = document.getElementById('info-phone');
    const infoEmail = document.getElementById('info-email');
    const infoAddress = document.getElementById('info-address');
    const infoStatus = document.getElementById('info-status');
    const infoParentName = document.getElementById('info-parent-name');
    const infoParentPhone = document.getElementById('info-parent-phone');
    const infoParentEmail = document.getElementById('info-parent-email');
    const infoTariff = document.getElementById('info-tariff');
    const infoCreatedDate = document.getElementById('info-created-date');
    const infoNotes = document.getElementById('info-notes');
    
    // Элементы вкладки "История занятий"
    const lessonsTbody = document.getElementById('lessons-tbody');
    
    // Элементы вкладки "Прогресс"
    const progressChart = document.getElementById('progress-chart');
    const achievementsList = document.getElementById('achievements-list');
    
    // Элементы вкладки "Финансы"
    const totalLessons = document.getElementById('total-lessons');
    const paidLessons = document.getElementById('paid-lessons');
    const balance = document.getElementById('balance');
    const totalIncome = document.getElementById('total-income');
    const financeTbody = document.getElementById('finance-tbody');
    
    // Элементы вкладки "Посещаемость"
    const attendanceChart = document.getElementById('attendance-chart');
    const attendanceTotal = document.getElementById('attendance-total');
    const attendanceAttended = document.getElementById('attendance-attended');
    const attendanceMissed = document.getElementById('attendance-missed');
    const attendancePercentage = document.getElementById('attendance-percentage');

    // Инициализация при загрузке страницы
    init();

    function init() {
        loadUserData();
        loadStudent();
        setupEventListeners();
        renderStudentInfo();
        switchTab('info');
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

    // Загрузка данных ученика
    function loadStudent() {
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('id');
        
        if (!studentId) {
            showNotification('ID ученика не указан', 'error');
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 2000);
            return;
        }
        
        const students = JSON.parse(localStorage.getItem('students')) || [];
        currentStudent = students.find(student => student.id == studentId);
        
        if (!currentStudent) {
            showNotification('Ученик не найден', 'error');
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 2000);
        }
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Переключение вкладок
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });

        // Кнопки действий
        if (editStudentBtn) {
            editStudentBtn.addEventListener('click', () => {
                window.location.href = `student-form.html?id=${currentStudent.id}`;
            });
        }

        if (backToStudentsBtn) {
            backToStudentsBtn.addEventListener('click', () => {
                window.location.href = 'students.html';
            });
        }

        if (addLessonBtn) {
            addLessonBtn.addEventListener('click', () => {
                addLesson();
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
        
        // Закрытие мобильного меню при клике на пункт меню
        const menuLinks = document.querySelectorAll('.sidebar-menu a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                const sidebar = document.querySelector('.details-sidebar');
                if (sidebar && sidebar.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    // Отображение информации об ученике
    function renderStudentInfo() {
        if (!currentStudent) return;
        
        const initials = `${currentStudent.firstName.charAt(0)}${currentStudent.lastName.charAt(0)}`.toUpperCase();
        const age = calculateAge(currentStudent.birthDate);
        const statusText = getStatusText(currentStudent.status);
        const tariffText = getTariffText(currentStudent.tariff);
        
        // Основная информация в шапке
        if (studentFullName) studentFullName.textContent = `${currentStudent.firstName} ${currentStudent.lastName}`;
        if (studentAvatarLarge) studentAvatarLarge.textContent = initials;
        if (studentGrade) studentGrade.textContent = `${currentStudent.grade} класс`;
        if (studentPhone) studentPhone.textContent = currentStudent.phone;
        if (studentEmail) studentEmail.textContent = currentStudent.email || 'Не указан';
        if (studentAge) studentAge.textContent = `${age} лет`;
        if (studentStatus) {
            studentStatus.textContent = statusText;
            studentStatus.className = `student-status ${currentStudent.status}`;
        }
        
        // Вкладка "Основная информация"
        if (infoFullName) infoFullName.textContent = `${currentStudent.firstName} ${currentStudent.lastName}`;
        if (infoGrade) infoGrade.textContent = `${currentStudent.grade} класс`;
        if (infoBirthDate) infoBirthDate.textContent = formatDate(currentStudent.birthDate);
        if (infoAge) infoAge.textContent = `${age} лет`;
        if (infoPhone) infoPhone.textContent = currentStudent.phone;
        if (infoEmail) infoEmail.textContent = currentStudent.email || 'Не указан';
        if (infoAddress) infoAddress.textContent = currentStudent.address || 'Не указан';
        if (infoStatus) infoStatus.textContent = statusText;
        if (infoParentName) infoParentName.textContent = currentStudent.parentName || 'Не указан';
        if (infoParentPhone) infoParentPhone.textContent = currentStudent.parentPhone || 'Не указан';
        if (infoParentEmail) infoParentEmail.textContent = currentStudent.parentEmail || 'Не указан';
        if (infoTariff) infoTariff.textContent = tariffText;
        if (infoCreatedDate) infoCreatedDate.textContent = formatDate(currentStudent.createdDate);
        if (infoNotes) infoNotes.textContent = currentStudent.notes || 'Нет заметок';
        
        // Отображаем содержимое для всех вкладок
        renderLessonsTab();
        renderProgressTab();
        renderFinanceTab();
        renderAttendanceTab();
    }

    // Переключение вкладок
    function switchTab(tabName) {
        // Обновляем кнопки вкладок
        tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Обновляем содержимое вкладок
        tabContents.forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        currentTab = tabName;
    }

    // Отображение вкладки "История занятий"
    function renderLessonsTab() {
        if (!currentStudent.lessons || currentStudent.lessons.length === 0) {
            lessonsTbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Занятий пока не было</td></tr>';
            return;
        }
        
        const sortedLessons = currentStudent.lessons.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        lessonsTbody.innerHTML = sortedLessons.map(lesson => {
            const statusText = getLessonStatusText(lesson.status);
            const statusClass = lesson.status;
            
            return `
                <tr>
                    <td>${formatDate(lesson.date)}</td>
                    <td>${lesson.topic}</td>
                    <td>${lesson.duration} мин</td>
                    <td><span class="shadcn-badge shadcn-badge-${getStatusBadgeVariant(statusClass)}">${statusText}</span></td>
                    <td>
                        <button class="shadcn-btn shadcn-btn-outline shadcn-btn-sm" onclick="editLesson(${lesson.id})" style="margin-right: 0.5rem;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="shadcn-btn shadcn-btn-outline shadcn-btn-sm shadcn-btn-danger" onclick="deleteLesson(${lesson.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Отображение вкладки "Прогресс"
    function renderProgressTab() {
        // Создаем простой график прогресса
        if (!currentStudent.lessons || currentStudent.lessons.length === 0) {
            progressChart.innerHTML = '<p>Недостаточно данных для построения графика</p>';
            achievementsList.innerHTML = '<p>Достижений пока нет</p>';
            return;
        }
        
        // Простой текстовый график прогресса
        const completedLessons = currentStudent.lessons.filter(lesson => lesson.status === 'completed').length;
        const averageRating = currentStudent.lessons
            .filter(lesson => lesson.rating)
            .reduce((sum, lesson, _, arr) => sum + lesson.rating / arr.length, 0);
        
        progressChart.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <h3>Статистика прогресса</h3>
                <div style="display: flex; justify-content: space-around; margin-top: 20px;">
                    <div>
                        <div style="font-size: 2rem; font-weight: bold; color: hsl(var(--shadcn-primary));">${completedLessons}</div>
                        <div>Завершено занятий</div>
                    </div>
                    <div>
                        <div style="font-size: 2rem; font-weight: bold; color: hsl(var(--shadcn-primary));">${averageRating.toFixed(1)}/5</div>
                        <div>Средняя оценка</div>
                    </div>
                </div>
            </div>
        `;
        
        // Генерируем достижения
        const achievements = generateAchievements(completedLessons, averageRating);
        achievementsList.innerHTML = achievements.map(achievement => `
            <div class="shadcn-card" style="margin-bottom: 0.625rem;">
                <div class="shadcn-card-content">
                    <div style="display: flex; align-items: center; gap: 0.9375rem;">
                        <div style="font-size: 2rem; color: hsl(var(--shadcn-primary));">${achievement.icon}</div>
                        <div>
                            <div style="font-weight: 600; color: hsl(var(--shadcn-foreground));">${achievement.title}</div>
                            <div style="color: hsl(var(--shadcn-muted-foreground)); font-size: 0.9rem;">${achievement.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Отображение вкладки "Финансы"
    function renderFinanceTab() {
        const finance = currentStudent.finance || {
            paidLessons: 0,
            balance: 0,
            totalIncome: 0
        };
        
        const totalLessonsCount = currentStudent.lessons ? currentStudent.lessons.length : 0;
        const completedLessonsCount = currentStudent.lessons ? 
            currentStudent.lessons.filter(lesson => lesson.status === 'completed').length : 0;
        
        if (totalLessons) totalLessons.textContent = totalLessonsCount;
        if (paidLessons) paidLessons.textContent = finance.paidLessons;
        if (balance) balance.textContent = `${finance.balance}₽`;
        if (totalIncome) totalIncome.textContent = `${finance.totalIncome}₽`;
        
        // Генерируем финансовую историю
        const financeHistory = generateFinanceHistory(finance, completedLessonsCount);
        financeTbody.innerHTML = financeHistory.map(record => {
            const amountColor = record.amount > 0 ? 'hsl(var(--shadcn-success))' : 'hsl(var(--shadcn-error))';
            const amountPrefix = record.amount > 0 ? '+' : '';
            
            return `
                <tr>
                    <td>${formatDate(record.date)}</td>
                    <td>${record.type}</td>
                    <td style="color: ${amountColor};">${amountPrefix}${record.amount}₽</td>
                    <td>${record.description}</td>
                </tr>
            `;
        }).join('');
    }

    // Отображение вкладки "Посещаемость"
    function renderAttendanceTab() {
        if (!currentStudent.lessons || currentStudent.lessons.length === 0) {
            attendanceChart.innerHTML = '<p>Недостаточно данных для построения графика</p>';
            attendanceTotal.textContent = '0';
            attendanceAttended.textContent = '0';
            attendanceMissed.textContent = '0';
            attendancePercentage.textContent = '0%';
            return;
        }
        
        const totalLessonsCount = currentStudent.lessons.length;
        const attendedLessons = currentStudent.lessons.filter(lesson => lesson.status === 'completed').length;
        const missedLessons = currentStudent.lessons.filter(lesson => lesson.status === 'missed').length;
        const attendancePercentageValue = totalLessonsCount > 0 ? Math.round((attendedLessons / totalLessonsCount) * 100) : 0;
        
        // Простой график посещаемости
        attendanceChart.innerHTML = `
            <div style="text-align: center; width: 100%;">
                <h3>График посещаемости</h3>
                <div class="shadcn-progress" style="margin-top: 20px;">
                    <div class="shadcn-progress-bar" style="width: ${attendancePercentageValue}%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                        ${attendancePercentageValue}%
                    </div>
                </div>
            </div>
        `;
        
        if (attendanceTotal) attendanceTotal.textContent = totalLessonsCount;
        if (attendanceAttended) attendanceAttended.textContent = attendedLessons;
        if (attendanceMissed) attendanceMissed.textContent = missedLessons;
        if (attendancePercentage) attendancePercentage.textContent = `${attendancePercentageValue}%`;
    }

    // Добавление занятия
    function addLesson() {
        const topic = prompt('Введите тему занятия:');
        if (!topic) return;
        
        const duration = prompt('Введите длительность занятия в минутах (60, 90, 120):');
        if (!duration || !['60', '90', '120'].includes(duration)) {
            showNotification('Некорректная длительность занятия', 'error');
            return;
        }
        
        const newLesson = {
            id: Date.now(),
            date: new Date().toISOString(),
            topic: topic,
            duration: parseInt(duration),
            status: 'completed',
            homework: false,
            rating: 5
        };
        
        if (!currentStudent.lessons) {
            currentStudent.lessons = [];
        }
        
        currentStudent.lessons.push(newLesson);
        
        // Обновляем данные ученика в localStorage
        updateStudentInStorage(currentStudent);
        
        // Обновляем отображение
        renderLessonsTab();
        renderProgressTab();
        renderFinanceTab();
        renderAttendanceTab();
        
        showNotification('Занятие успешно добавлено', 'success');
    }

    // Редактирование занятия
    function editLesson(lessonId) {
        const lesson = currentStudent.lessons.find(l => l.id === lessonId);
        if (!lesson) return;
        
        const newTopic = prompt('Введите новую тему занятия:', lesson.topic);
        if (!newTopic) return;
        
        lesson.topic = newTopic;
        
        // Обновляем данные ученика в localStorage
        updateStudentInStorage(currentStudent);
        
        // Обновляем отображение
        renderLessonsTab();
        
        showNotification('Занятие успешно обновлено', 'success');
    }

    // Удаление занятия
    function deleteLesson(lessonId) {
        if (!confirm('Вы уверены, что хотите удалить это занятие?')) return;
        
        currentStudent.lessons = currentStudent.lessons.filter(l => l.id !== lessonId);
        
        // Обновляем данные ученика в localStorage
        updateStudentInStorage(currentStudent);
        
        // Обновляем отображение
        renderLessonsTab();
        renderProgressTab();
        renderFinanceTab();
        renderAttendanceTab();
        
        showNotification('Занятие успешно удалено', 'success');
    }

    // Обновление данных ученика в localStorage
    function updateStudentInStorage(updatedStudent) {
        const students = JSON.parse(localStorage.getItem('students')) || [];
        const index = students.findIndex(student => student.id === updatedStudent.id);
        
        if (index !== -1) {
            students[index] = updatedStudent;
            localStorage.setItem('students', JSON.stringify(students));
            currentStudent = updatedStudent;
        }
    }

    // Генерация достижений
    function generateAchievements(completedLessons, averageRating) {
        const achievements = [];
        
        if (completedLessons >= 1) {
            achievements.push({
                icon: '🎯',
                title: 'Первое занятие',
                description: 'Проведено первое занятие'
            });
        }
        
        if (completedLessons >= 5) {
            achievements.push({
                icon: '🌟',
                title: 'Начинающий математик',
                description: 'Завершено 5 занятий'
            });
        }
        
        if (completedLessons >= 10) {
            achievements.push({
                icon: '🏆',
                title: 'Опытный ученик',
                description: 'Завершено 10 занятий'
            });
        }
        
        if (averageRating >= 4.5) {
            achievements.push({
                icon: '⭐',
                title: 'Отличник',
                description: 'Средняя оценка выше 4.5'
            });
        }
        
        return achievements;
    }

    // Генерация финансовой истории
    function generateFinanceHistory(finance, completedLessons) {
        const history = [];
        
        // Добавляем записи об оплате
        if (finance.paidLessons > 0) {
            const paymentDate = new Date();
            paymentDate.setDate(paymentDate.getDate() - 30);
            
            const paymentDescription = 'Оплата за ' + finance.paidLessons + ' занятий';
            history.push({
                date: paymentDate.toISOString(),
                type: 'Оплата',
                amount: finance.totalIncome,
                description: paymentDescription
            });
        }
        
        // Добавляем записи о проведенных занятиях
        if (currentStudent.lessons) {
            currentStudent.lessons
                .filter(lesson => lesson.status === 'completed')
                .forEach(lesson => {
                    const lessonCost = getLessonCost(lesson.duration);
                    const lessonDescription = lesson.topic + ' (' + lesson.duration + ' мин)';
                    history.push({
                        date: lesson.date,
                        type: 'Занятие',
                        amount: -lessonCost,
                        description: lessonDescription
                    });
                });
        }
        
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Получение стоимости занятия
    function getLessonCost(duration) {
        const baseCost = 1000; // Базовая стоимость за 60 минут
        if (duration === 90) return Math.round(baseCost * 1.5);
        if (duration === 120) return baseCost * 2;
        return baseCost;
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

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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

    function getLessonStatusText(status) {
        const statusMap = {
            'completed': 'Завершено',
            'missed': 'Пропущено',
            'cancelled': 'Отменено'
        };
        return statusMap[status] || status;
    }

    function getStatusBadgeVariant(status) {
        const variantMap = {
            'completed': 'success',
            'missed': 'error',
            'cancelled': 'warning'
        };
        return variantMap[status] || 'secondary';
    }

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        const notificationMessage = notification.querySelector('.notification-message');
        
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.className = 'notification ' + type;
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
        const sidebar = document.querySelector('.details-sidebar');
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

    // Добавляем стили для опасной кнопки
    const style = document.createElement('style');
    style.textContent = `
        .shadcn-btn-danger {
            background-color: hsl(var(--shadcn-error) / 0.1);
            color: hsl(var(--shadcn-error));
            border-color: hsl(var(--shadcn-error) / 0.2);
        }
        
        .shadcn-btn-danger:hover {
            background-color: hsl(var(--shadcn-error) / 0.2);
            color: hsl(var(--shadcn-error));
        }
    `;
    document.head.appendChild(style);
});