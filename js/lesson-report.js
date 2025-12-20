// Глобальные переменные
let lessons = [];
let students = [];
let reportData = {};
let charts = {};

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLessonReport();
});

// Основная функция инициализации
function initLessonReport() {
    loadStudents();
    loadLessons();
    generateTestData();
    initEventListeners();
    updateStudentSelect();
    
    // Устанавливаем текущий период по умолчанию
    setDefaultPeriod();
    
    // Скрываем состояние загрузки
    setTimeout(() => {
        document.getElementById('loading-state').style.display = 'none';
    }, 1000);
}

// Загрузка данных
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
}

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

// Генерация тестовых данных
function generateTestData() {
    if (lessons.length === 0) {
        const testLessons = [
            {
                id: 1,
                studentId: 1,
                studentName: 'Александр Петров',
                grade: 9,
                date: new Date(2024, 10, 1, 15, 0).toISOString(),
                duration: 60,
                type: 'regular',
                topic: 'Алгебраические уравнения',
                price: 1800,
                status: 'completed',
                paymentStatus: 'paid',
                results: {
                    rating: 4,
                    progress: 85,
                    notes: 'Хорошо усвоил материал'
                }
            },
            {
                id: 2,
                studentId: 2,
                studentName: 'Елена Козлова',
                grade: 8,
                date: new Date(2024, 10, 5, 16, 30).toISOString(),
                duration: 60,
                type: 'regular',
                topic: 'Геометрические фигуры',
                price: 1800,
                status: 'completed',
                paymentStatus: 'paid',
                results: {
                    rating: 5,
                    progress: 90,
                    notes: 'Отличная работа'
                }
            },
            {
                id: 3,
                studentId: 3,
                studentName: 'Михаил Новиков',
                grade: 11,
                date: new Date(2024, 10, 10, 18, 0).toISOString(),
                duration: 90,
                type: 'exam',
                topic: 'Подготовка к ЕГЭ',
                price: 3300,
                status: 'completed',
                paymentStatus: 'paid',
                results: {
                    rating: 4,
                    progress: 75,
                    notes: 'Нуждается в практике'
                }
            },
            {
                id: 4,
                studentId: 1,
                studentName: 'Александр Петров',
                grade: 9,
                date: new Date(2024, 10, 15, 15, 0).toISOString(),
                duration: 60,
                type: 'regular',
                topic: 'Системы уравнений',
                price: 1800,
                status: 'completed',
                paymentStatus: 'paid',
                results: {
                    rating: 5,
                    progress: 88,
                    notes: 'Отличный прогресс'
                }
            },
            {
                id: 5,
                studentId: 4,
                studentName: 'Мария Иванова',
                grade: 7,
                date: new Date(2024, 10, 20, 14, 0).toISOString(),
                duration: 60,
                type: 'trial',
                topic: 'Пробное занятие',
                price: 0,
                status: 'completed',
                paymentStatus: 'unpaid',
                results: {
                    rating: 5,
                    progress: 80,
                    notes: 'Рекомендуем продолжить'
                }
            }
        ];
        
        lessons = testLessons;
        localStorage.setItem('lessons', JSON.stringify(lessons));
    }
    
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
    // Период отчета
    const reportPeriod = document.getElementById('report-period');
    if (reportPeriod) {
        reportPeriod.addEventListener('change', function() {
            toggleCustomPeriod(this.value);
        });
    }
    
    // Генерация отчета
    const generateBtn = document.getElementById('generate-report-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateReport);
    }
    
    // Сброс настроек
    const resetBtn = document.getElementById('reset-settings-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSettings);
    }
    
    // PDF отчет
    const pdfBtn = document.getElementById('generate-pdf-btn');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', generatePDFReport);
    }
    
    // Сравнение периодов
    const compareBtn = document.getElementById('compare-periods-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', showCompareModal);
    }
    
    // Модальное окно сравнения
    initCompareModal();
    
    // Мобильное меню
    initMobileMenu();
    
    // Выход
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Установка периода по умолчанию
function setDefaultPeriod() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('date-from').value = formatDateForInput(firstDay);
    document.getElementById('date-to').value = formatDateForInput(lastDay);
}

// Переключение произвольного периода
function toggleCustomPeriod(value) {
    const customGroup = document.getElementById('custom-period-group');
    const customToGroup = document.getElementById('custom-period-to-group');
    
    if (value === 'custom') {
        customGroup.style.display = 'block';
        customToGroup.style.display = 'block';
    } else {
        customGroup.style.display = 'none';
        customToGroup.style.display = 'none';
        setPeriodDates(value);
    }
}

// Установка дат периода
function setPeriodDates(period) {
    const today = new Date();
    let dateFrom, dateTo;
    
    switch (period) {
        case 'current-month':
            dateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
            dateTo = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'last-month':
            dateFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            dateTo = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'current-quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            dateFrom = new Date(today.getFullYear(), quarter * 3, 1);
            dateTo = new Date(today.getFullYear(), quarter * 3 + 3, 0);
            break;
        case 'last-quarter':
            const lastQuarter = Math.floor(today.getMonth() / 3) - 1;
            dateFrom = new Date(today.getFullYear(), lastQuarter * 3, 1);
            dateTo = new Date(today.getFullYear(), lastQuarter * 3 + 3, 0);
            break;
        case 'current-year':
            dateFrom = new Date(today.getFullYear(), 0, 1);
            dateTo = new Date(today.getFullYear(), 11, 31);
            break;
    }
    
    if (dateFrom && dateTo) {
        document.getElementById('date-from').value = formatDateForInput(dateFrom);
        document.getElementById('date-to').value = formatDateForInput(dateTo);
    }
}

// Обновление списка учеников
function updateStudentSelect() {
    const studentSelect = document.getElementById('student-select');
    if (!studentSelect) return;
    
    studentSelect.innerHTML = '<option value="">Все ученики</option>';
    
    const uniqueStudents = [...new Map(lessons.map(lesson => 
        [lesson.studentId, { id: lesson.studentId, name: lesson.studentName }]
    )).values()];
    
    uniqueStudents.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = student.name;
        studentSelect.appendChild(option);
    });
}

// Генерация отчета
function generateReport() {
    showLoading(true);
    
    setTimeout(() => {
        const period = document.getElementById('report-period').value;
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;
        const studentId = document.getElementById('student-select').value;
        const reportType = document.getElementById('report-type').value;
        
        // Фильтруем уроки
        let filteredLessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            const fromDate = new Date(dateFrom + 'T00:00:00');
            const toDate = new Date(dateTo + 'T23:59:59');
            
            return lessonDate >= fromDate && lessonDate <= toDate &&
                   (!studentId || lesson.studentId == studentId) &&
                   lesson.status === 'completed';
        });
        
        // Генерируем данные отчета
        reportData = generateReportData(filteredLessons, reportType);
        
        // Обновляем интерфейс
        updateKeyMetrics(reportData);
        updateCharts(reportData);
        updateReportTable(filteredLessons);
        updateFinancialSummary(reportData);
        
        showLoading(false);
        showToast('Отчет успешно сформирован', 'success');
    }, 1000);
}

// Генерация данных отчета
function generateReportData(filteredLessons, reportType) {
    const data = {
        totalLessons: filteredLessons.length,
        totalIncome: filteredLessons.reduce((sum, l) => sum + (l.price || 0), 0),
        avgCheck: 0,
        attendanceRate: 0,
        lessonsByDate: {},
        lessonsByStudent: {},
        lessonsByType: {},
        financialData: {
            regular: 0,
            trial: 0,
            exam: 0
        },
        paymentRatio: 0
    };
    
    // Расчет среднего чека
    data.avgCheck = data.totalLessons > 0 ? data.totalIncome / data.totalLessons : 0;
    
    // Расчет посещаемости
    const scheduledLessons = lessons.filter(l => {
        const lessonDate = new Date(l.date);
        const fromDate = new Date(document.getElementById('date-from').value + 'T00:00:00');
        const toDate = new Date(document.getElementById('date-to').value + 'T23:59:59');
        return lessonDate >= fromDate && lessonDate <= toDate;
    });
    
    data.attendanceRate = scheduledLessons.length > 0 ? 
        (filteredLessons.length / scheduledLessons.length * 100) : 0;
    
    // Группировка по датам
    filteredLessons.forEach(lesson => {
        const date = formatDate(new Date(lesson.date));
        if (!data.lessonsByDate[date]) {
            data.lessonsByDate[date] = { count: 0, income: 0 };
        }
        data.lessonsByDate[date].count++;
        data.lessonsByDate[date].income += lesson.price || 0;
    });
    
    // Группировка по ученикам
    filteredLessons.forEach(lesson => {
        if (!data.lessonsByStudent[lesson.studentName]) {
            data.lessonsByStudent[lesson.studentName] = 0;
        }
        data.lessonsByStudent[lesson.studentName]++;
    });
    
    // Группировка по типам
    filteredLessons.forEach(lesson => {
        if (!data.lessonsByType[lesson.type]) {
            data.lessonsByType[lesson.type] = 0;
        }
        data.lessonsByType[lesson.type]++;
        
        // Финансовые данные по типам
        data.financialData[lesson.type] += lesson.price || 0;
    });
    
    // Расчет платежей
    const paidLessons = filteredLessons.filter(l => l.paymentStatus === 'paid').length;
    data.paymentRatio = filteredLessons.length > 0 ? 
        (paidLessons / filteredLessons.length * 100) : 0;
    
    return data;
}

// Обновление ключевых показателей
function updateKeyMetrics(data) {
    document.getElementById('total-lessons').textContent = data.totalLessons;
    document.getElementById('total-income').textContent = `${data.totalIncome.toLocaleString()} ₽`;
    document.getElementById('avg-check').textContent = `${Math.round(data.avgCheck).toLocaleString()} ₽`;
    document.getElementById('attendance-rate').textContent = `${Math.round(data.attendanceRate)}%`;
}

// Обновление графиков
function updateCharts(data) {
    // Уничтожаем существующие графики
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // График динамики уроков
    const lessonsCtx = document.getElementById('lessons-chart')?.getContext('2d');
    if (lessonsCtx) {
        const dates = Object.keys(data.lessonsByDate).sort();
        const counts = dates.map(date => data.lessonsByDate[date].count);
        
        charts.lessons = new Chart(lessonsCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Количество уроков',
                    data: counts,
                    borderColor: 'hsl(var(--primary))',
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // График распределения по ученикам
    const studentsCtx = document.getElementById('students-chart')?.getContext('2d');
    if (studentsCtx) {
        const studentNames = Object.keys(data.lessonsByStudent);
        const lessonCounts = Object.values(data.lessonsByStudent);
        
        charts.students = new Chart(studentsCtx, {
            type: 'doughnut',
            data: {
                labels: studentNames,
                datasets: [{
                    data: lessonCounts,
                    backgroundColor: [
                        'hsl(var(--primary) / 0.8)',
                        'hsl(var(--blue) / 0.8)',
                        'hsl(var(--green) / 0.8)',
                        'hsl(var(--orange) / 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Финансовый график
    const financeCtx = document.getElementById('finance-chart')?.getContext('2d');
    if (financeCtx) {
        const dates = Object.keys(data.lessonsByDate).sort();
        const income = dates.map(date => data.lessonsByDate[date].income);
        
        charts.finance = new Chart(financeCtx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Доход',
                    data: income,
                    backgroundColor: 'hsl(var(--green) / 0.8)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // График типов уроков
    const typesCtx = document.getElementById('types-chart')?.getContext('2d');
    if (typesCtx) {
        const typeNames = {
            'regular': 'Обычные',
            'trial': 'Пробные',
            'exam': 'Экзамены'
        };
        
        const labels = Object.keys(data.lessonsByType).map(type => typeNames[type] || type);
        const counts = Object.values(data.lessonsByType);
        
        charts.types = new Chart(typesCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        'hsl(var(--destructive) / 0.8)',
                        'hsl(var(--yellow) / 0.8)',
                        'hsl(var(--orange) / 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Обновление таблицы отчета
function updateReportTable(filteredLessons) {
    const tbody = document.getElementById('report-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = filteredLessons.map(lesson => {
        const date = new Date(lesson.date);
        
        return `
            <tr>
                <td>${formatDate(date)}</td>
                <td>${lesson.studentName}</td>
                <td>${lesson.grade} класс</td>
                <td>${getTypeText(lesson.type)}</td>
                <td>${lesson.duration} мин</td>
                <td>${lesson.price || 0} ₽</td>
                <td>${lesson.results ? getRatingStars(lesson.results.rating) : '-'}</td>
                <td>${lesson.results ? lesson.results.progress + '%' : '-'}</td>
                <td><span class="status-badge ${lesson.status}">${getStatusText(lesson.status)}</span></td>
            </tr>
        `;
    }).join('');
}

// Обновление финансовой сводки
function updateFinancialSummary(data) {
    document.getElementById('regular-income').textContent = `${data.financialData.regular.toLocaleString()} ₽`;
    document.getElementById('trial-income').textContent = `${data.financialData.trial.toLocaleString()} ₽`;
    document.getElementById('exam-income').textContent = `${data.financialData.exam.toLocaleString()} ₽`;
    document.getElementById('payment-ratio').textContent = `${Math.round(data.paymentRatio)}%`;
}

// Сброс настроек
function resetSettings() {
    document.getElementById('report-period').value = 'current-month';
    document.getElementById('student-select').value = '';
    document.getElementById('report-type').value = 'summary';
    
    toggleCustomPeriod('current-month');
    setDefaultPeriod();
    
    showToast('Настройки сброшены', 'success');
}

// Генерация PDF отчета
function generatePDFReport() {
    showToast('Функция PDF экспорта в разработке', 'info');
    
    // Временное решение - экспорт в текстовый файл
    const reportContent = generateTextReport();
    downloadFile(reportContent, 'lesson-report.txt', 'text/plain');
    showToast('Отчет сохранен в текстовом формате', 'success');
}

// Генерация текстового отчета
function generateTextReport() {
    const period = document.getElementById('report-period').value;
    const studentId = document.getElementById('student-select').value;
    const student = students.find(s => s.id == studentId);
    
    let content = 'ОТЧЕТ ПО УРОКАМ\n';
    content += '='.repeat(50) + '\n\n';
    
    content += 'Период: ' + getPeriodText(period) + '\n';
    if (student) content += 'Ученик: ' + student.name + '\n';
    content += 'Дата формирования: ' + new Date().toLocaleDateString('ru-RU') + '\n\n';
    
    content += 'КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ\n';
    content += '-'.repeat(50) + '\n';
    content += 'Всего уроков: ' + reportData.totalLessons + '\n';
    content += 'Общий доход: ' + reportData.totalIncome.toLocaleString() + ' ₽\n';
    content += 'Средний чек: ' + Math.round(reportData.avgCheck).toLocaleString() + ' ₽\n';
    content += 'Посещаемость: ' + Math.round(reportData.attendanceRate) + '%\n\n';
    
    content += 'ФИНАНСОВАЯ СВОДКА\n';
    content += '-'.repeat(50) + '\n';
    content += 'Обычные уроки: ' + reportData.financialData.regular.toLocaleString() + ' ₽\n';
    content += 'Пробные занятия: ' + reportData.financialData.trial.toLocaleString() + ' ₽\n';
    content += 'Подготовка к экзаменам: ' + reportData.financialData.exam.toLocaleString() + ' ₽\n';
    content += 'Оплачено: ' + Math.round(reportData.paymentRatio) + '%\n';
    
    return content;
}

// Модальное окно сравнения
function initCompareModal() {
    const modal = document.getElementById('compare-modal');
    const closeBtn = document.getElementById('compare-modal-close');
    const cancelBtn = document.getElementById('cancel-compare-btn');
    const applyBtn = document.getElementById('apply-compare-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', hideCompareModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideCompareModal);
    }
    
    if (applyBtn) {
        applyBtn.addEventListener('click', applyCompare);
    }
    
    modal?.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideCompareModal();
        }
    });
}

function showCompareModal() {
    const modal = document.getElementById('compare-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideCompareModal() {
    const modal = document.getElementById('compare-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function applyCompare() {
    const period1 = document.getElementById('compare1-period').value;
    const period2 = document.getElementById('compare2-period').value;
    
    if (period1 === period2) {
        showToast('Выберите разные периоды для сравнения', 'error');
        return;
    }
    
    showToast('Функция сравнения в разработке', 'info');
    hideCompareModal();
}

// Вспомогательные функции
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
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

function getPeriodText(period) {
    const periods = {
        'current-month': 'Текущий месяц',
        'last-month': 'Прошлый месяц',
        'current-quarter': 'Текущий квартал',
        'last-quarter': 'Прошлый квартал',
        'current-year': 'Текущий год',
        'custom': 'Произвольный период'
    };
    return periods[period] || period;
}

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

function showLoading(show) {
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    
    if (show) {
        loadingState.style.display = 'flex';
        emptyState.style.display = 'none';
    } else {
        loadingState.style.display = 'none';
    }
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
    
    // Добавляем обработчики для закрытия меню при клике на пункты меню
    const menuLinks = sidebar.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (sidebar.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        });
    });
}

// Переключение мобильного меню
function toggleMobileMenu() {
    const sidebar = document.querySelector('.dashboard-sidebar');
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

// Выход из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти из системы?')) {
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