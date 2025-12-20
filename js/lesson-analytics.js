// Глобальные переменные
let lessons = [];
let students = [];
let analyticsData = {};
let charts = {};
let currentPeriod = 'month';

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initLessonAnalytics();
});

// Основная функция инициализации
async function initLessonAnalytics() {
    await loadStudents();
    await loadLessons();
    // generateTestData(); // Удаляем генерацию тестовых данных, используем API
    initEventListeners();
    initThemeToggle();
    
    // Устанавливаем период по умолчанию
    setDefaultPeriod();
    
    // Загружаем аналитику
    loadAnalytics();
    
    // Скрываем состояние загрузки
    setTimeout(() => {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.classList.add('hidden');
        }
    }, 1000);
}

// Загрузка данных из API
async function loadStudents() {
    try {
        const result = await window.apiClient.getStudents({ limit: 100 });
        students = result.students || [];
    } catch (error) {
        console.error('Error loading students:', error);
        students = [];
    }
}

async function loadLessons() {
    try {
        // Загружаем уроки за последние 3 месяца для аналитики
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        const startDateStr = startDate.toISOString().split('T')[0];
        
        const result = await window.apiClient.getLessons({
            startDate: startDateStr,
            endDate: endDate,
            limit: 1000
        });
        lessons = result.lessons || [];
    } catch (error) {
        console.error('Error loading lessons:', error);
        lessons = [];
    }
}

// Генерация тестовых данных
function generateTestData() {
    if (lessons.length === 0) {
        // Создаем расширенный набор тестовых данных для аналитики
        const testLessons = [];
        const today = new Date();
        
        for (let i = 0; i < 60; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Добавляем уроки только в рабочие дни
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                const studentIndex = (i % 4) + 1;
                const lesson = {
                    id: i + 1,
                    studentId: studentIndex,
                    studentName: ['Александр Петров', 'Елена Козлова', 'Михаил Новиков', 'Мария Иванова'][studentIndex - 1],
                    grade: [9, 8, 11, 7][studentIndex - 1],
                    date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
                                  14 + Math.floor(Math.random() * 5), Math.random() > 0.5 ? 0 : 30).toISOString(),
                    duration: [60, 60, 90, 60][studentIndex - 1],
                    type: ['regular', 'regular', 'exam', 'trial'][studentIndex - 1],
                    topic: ['Алгебра', 'Геометрия', 'Тригонометрия', 'Основы математики'][i % 4],
                    price: [1800, 1800, 3300, 0][studentIndex - 1],
                    status: Math.random() > 0.1 ? 'completed' : 'cancelled',
                    paymentStatus: Math.random() > 0.2 ? 'paid' : 'unpaid',
                    results: Math.random() > 0.1 ? {
                        rating: Math.floor(Math.random() * 2) + 4,
                        progress: Math.floor(Math.random() * 30) + 70,
                        notes: 'Хороший прогресс'
                    } : null
                };
                
                testLessons.push(lesson);
            }
        }
        
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
    // Кнопки периода
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            periodBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-primary-foreground');
                b.classList.add('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
            });
            this.classList.remove('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
            this.classList.add('bg-primary', 'text-primary-foreground');
            
            currentPeriod = this.dataset.period;
            setPeriodDates(currentPeriod);
            loadAnalytics();
        });
    });
    
    // Изменение дат
    const dateFrom = document.getElementById('analytics-date-from');
    const dateTo = document.getElementById('analytics-date-to');
    
    if (dateFrom) dateFrom.addEventListener('change', loadAnalytics);
    if (dateTo) dateTo.addEventListener('change', loadAnalytics);
    
    // Кнопки вкладок
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Обновление аналитики
    const refreshBtn = document.getElementById('refresh-analytics-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadAnalytics);
    }
    
    // Экспорт
    const exportBtn = document.getElementById('export-analytics-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAnalytics);
    }
    
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
    let dateFrom, dateTo;
    
    switch (currentPeriod) {
        case 'week':
            dateFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            dateTo = today;
            break;
        case 'month':
            dateFrom = new Date(today.getFullYear(), today.getMonth(), 1);
            dateTo = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            dateFrom = new Date(today.getFullYear(), quarter * 3, 1);
            dateTo = new Date(today.getFullYear(), quarter * 3 + 3, 0);
            break;
        case 'year':
            dateFrom = new Date(today.getFullYear(), 0, 1);
            dateTo = new Date(today.getFullYear(), 11, 31);
            break;
        case 'all':
            if (lessons.length > 0) {
                const dates = lessons.map(l => new Date(l.date));
                dateFrom = new Date(Math.min(...dates));
                dateTo = new Date(Math.max(...dates));
            } else {
                dateFrom = today;
                dateTo = today;
            }
            break;
    }
    
    if (dateFrom && dateTo) {
        document.getElementById('analytics-date-from').value = formatDateForInput(dateFrom);
        document.getElementById('analytics-date-to').value = formatDateForInput(dateTo);
    }
}

// Установка дат периода
function setPeriodDates(period) {
    currentPeriod = period;
    setDefaultPeriod();
}

// Загрузка аналитики
function loadAnalytics() {
    showLoading(true);
    
    setTimeout(() => {
        const dateFrom = document.getElementById('analytics-date-from').value;
        const dateTo = document.getElementById('analytics-date-to').value;
        
        // Фильтруем уроки за период
        const filteredLessons = lessons.filter(lesson => {
            const lessonDate = new Date(lesson.date);
            const fromDate = new Date(dateFrom + 'T00:00:00');
            const toDate = new Date(dateTo + 'T23:59:59');
            
            return lessonDate >= fromDate && lessonDate <= toDate;
        });
        
        // Генерируем аналитические данные
        analyticsData = generateAnalyticsData(filteredLessons);
        
        // Обновляем интерфейс
        updateKeyMetrics(analyticsData);
        updateCharts(analyticsData);
        updateForecast(analyticsData);
        updateDetailedAnalytics(analyticsData);
        
        showLoading(false);
        showToast('Аналитика обновлена', 'success');
    }, 1000);
}

// Генерация аналитических данных
function generateAnalyticsData(filteredLessons) {
    const data = {
        totalLessons: filteredLessons.length,
        completedLessons: filteredLessons.filter(l => l.status === 'completed').length,
        totalIncome: filteredLessons.reduce((sum, l) => sum + (l.price || 0), 0),
        avgProgress: 0,
        efficiencyRate: 0,
        lessonsByDate: {},
        lessonsByWeekday: {},
        lessonsByHour: {},
        studentAnalytics: {},
        topicAnalytics: {},
        trends: {}
    };
    
    // Расчет среднего прогресса
    const lessonsWithProgress = filteredLessons.filter(l => l.results?.progress);
    if (lessonsWithProgress.length > 0) {
        data.avgProgress = lessonsWithProgress.reduce((sum, l) => sum + l.results.progress, 0) / lessonsWithProgress.length;
    }
    
    // Расчет эффективности
    const successfulLessons = filteredLessons.filter(l => 
        l.status === 'completed' && l.results?.rating && l.results.rating >= 4
    );
    data.efficiencyRate = data.completedLessons > 0 ? 
        (successfulLessons.length / data.completedLessons * 100) : 0;
    
    // Группировка по датам
    filteredLessons.forEach(lesson => {
        const date = formatDate(new Date(lesson.date));
        if (!data.lessonsByDate[date]) {
            data.lessonsByDate[date] = { count: 0, income: 0, progress: [] };
        }
        data.lessonsByDate[date].count++;
        data.lessonsByDate[date].income += lesson.price || 0;
        if (lesson.results?.progress) {
            data.lessonsByDate[date].progress.push(lesson.results.progress);
        }
    });
    
    // Группировка по дням недели
    const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    filteredLessons.forEach(lesson => {
        const weekday = weekdays[new Date(lesson.date).getDay()];
        if (!data.lessonsByWeekday[weekday]) {
            data.lessonsByWeekday[weekday] = 0;
        }
        data.lessonsByWeekday[weekday]++;
    });
    
    // Группировка по часам
    filteredLessons.forEach(lesson => {
        const hour = new Date(lesson.date).getHours();
        if (!data.lessonsByHour[hour]) {
            data.lessonsByHour[hour] = 0;
        }
        data.lessonsByHour[hour]++;
    });
    
    // Аналитика по ученикам
    students.forEach(student => {
        const studentLessons = filteredLessons.filter(l => l.studentId === student.id);
        const completedStudentLessons = studentLessons.filter(l => l.status === 'completed');
        
        if (completedStudentLessons.length > 0) {
            const avgRating = completedStudentLessons
                .filter(l => l.results?.rating)
                .reduce((sum, l) => sum + l.results.rating, 0) / 
                completedStudentLessons.filter(l => l.results?.rating).length;
            
            const avgProgress = completedStudentLessons
                .filter(l => l.results?.progress)
                .reduce((sum, l) => sum + l.results.progress, 0) / 
                completedStudentLessons.filter(l => l.results?.progress).length;
            
            data.studentAnalytics[student.name] = {
                totalLessons: studentLessons.length,
                completedLessons: completedStudentLessons.length,
                attendance: (completedStudentLessons.length / studentLessons.length * 100),
                avgRating: avgRating || 0,
                avgProgress: avgProgress || 0,
                efficiency: avgRating >= 4 ? 100 : (avgRating / 4 * 100)
            };
        }
    });
    
    // Аналитика по темам
    filteredLessons.forEach(lesson => {
        if (!data.topicAnalytics[lesson.topic]) {
            data.topicAnalytics[lesson.topic] = {
                count: 0,
                avgProgress: 0,
                avgRating: 0,
                progress: [],
                ratings: []
            };
        }
        
        data.topicAnalytics[lesson.topic].count++;
        if (lesson.results?.progress) {
            data.topicAnalytics[lesson.topic].progress.push(lesson.results.progress);
        }
        if (lesson.results?.rating) {
            data.topicAnalytics[lesson.topic].ratings.push(lesson.results.rating);
        }
    });
    
    // Расчет средних значений по темам
    Object.keys(data.topicAnalytics).forEach(topic => {
        const topic = data.topicAnalytics[topic];
        if (topic.progress.length > 0) {
            topic.avgProgress = topic.progress.reduce((sum, p) => sum + p, 0) / topic.progress.length;
        }
        if (topic.ratings.length > 0) {
            topic.avgRating = topic.ratings.reduce((sum, r) => sum + r, 0) / topic.ratings.length;
        }
    });
    
    return data;
}

// Обновление ключевых метрик
function updateKeyMetrics(data) {
    document.getElementById('total-lessons').textContent = data.totalLessons;
    document.getElementById('total-income').textContent = `${data.totalIncome.toLocaleString()} ₽`;
    document.getElementById('avg-progress').textContent = `${Math.round(data.avgProgress)}%`;
    document.getElementById('efficiency-rate').textContent = `${Math.round(data.efficiencyRate)}%`;
    
    // Расчет трендов (упрощенная версия)
    updateTrends(data);
}

// Обновление трендов
function updateTrends(data) {
    // В реальном приложении здесь будет сравнение с предыдущим периодом
    const lessonsTrend = Math.floor(Math.random() * 20) - 10;
    const incomeTrend = Math.floor(Math.random() * 30) - 5;
    const progressTrend = Math.floor(Math.random() * 10) - 5;
    const efficiencyTrend = Math.floor(Math.random() * 15) - 5;
    
    updateTrendDisplay('lessons-trend', lessonsTrend);
    updateTrendDisplay('income-trend', incomeTrend);
    updateTrendDisplay('progress-trend', progressTrend);
    updateTrendDisplay('efficiency-trend', efficiencyTrend);
}

function updateTrendDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const icon = element.querySelector('i');
    const span = element.querySelector('span:first-child');
    
    // Удаляем все классы цветов
    icon.classList.remove('text-green-500', 'text-red-500', 'text-gray-500');
    span.classList.remove('text-green-500', 'text-red-500', 'text-gray-500');
    
    if (value > 0) {
        icon.className = 'fas fa-arrow-up text-green-500 mr-1';
        span.className = 'text-green-500';
    } else if (value < 0) {
        icon.className = 'fas fa-arrow-down text-red-500 mr-1';
        span.className = 'text-red-500';
    } else {
        icon.className = 'fas fa-minus text-gray-500 mr-1';
        span.className = 'text-gray-500';
    }
    
    span.textContent = `${value >= 0 ? '+' : ''}${value}%`;
}

// Обновление графиков
function updateCharts(data) {
    // Уничтожаем существующие графики
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    // Получаем тему для графиков
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    
    // График динамики
    const dynamicsCtx = document.getElementById('dynamics-chart')?.getContext('2d');
    if (dynamicsCtx) {
        const dates = Object.keys(data.lessonsByDate).sort();
        const counts = dates.map(date => data.lessonsByDate[date].count);
        const income = dates.map(date => data.lessonsByDate[date].income);
        
        charts.dynamics = new Chart(dynamicsCtx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Уроки',
                    data: counts,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'y',
                    tension: 0.1
                }, {
                    label: 'Доход',
                    data: income,
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: { color: textColor },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                }
            }
        });
    }
    
    // График посещаемости по дням недели
    const attendanceCtx = document.getElementById('attendance-chart')?.getContext('2d');
    if (attendanceCtx) {
        const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const values = weekdays.map(day => {
            const fullDay = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
                [weekdays.indexOf(day)];
            return data.lessonsByWeekday[fullDay] || 0;
        });
        
        charts.attendance = new Chart(attendanceCtx, {
            type: 'bar',
            data: {
                labels: weekdays,
                datasets: [{
                    label: 'Количество уроков',
                    data: values,
                    backgroundColor: 'rgba(168, 85, 247, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    }
                }
            }
        });
    }
    
    // График распределения по времени
    const timeCtx = document.getElementById('time-distribution-chart')?.getContext('2d');
    if (timeCtx) {
        const hours = Array.from({length: 12}, (_, i) => i + 12); // 12:00 - 23:00
        const values = hours.map(hour => data.lessonsByHour[hour] || 0);
        
        charts.timeDistribution = new Chart(timeCtx, {
            type: 'radar',
            data: {
                labels: hours.map(h => `${h}:00`),
                datasets: [{
                    label: 'Количество уроков',
                    data: values,
                    borderColor: 'rgb(251, 146, 60)',
                    backgroundColor: 'rgba(251, 146, 60, 0.2)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        ticks: { color: textColor },
                        grid: { color: gridColor },
                        pointLabels: { color: textColor }
                    }
                }
            }
        });
    }
    
    // График эффективности по ученикам
    const studentCtx = document.getElementById('student-efficiency-chart')?.getContext('2d');
    if (studentCtx) {
        const studentNames = Object.keys(data.studentAnalytics);
        const efficiency = studentNames.map(name => data.studentAnalytics[name].efficiency);
        
        charts.studentEfficiency = new Chart(studentCtx, {
            type: 'bar',
            data: {
                labels: studentNames,
                datasets: [{
                    label: 'Эффективность %',
                    data: efficiency,
                    backgroundColor: 'rgba(6, 182, 212, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: textColor },
                        grid: { color: gridColor }
                    },
                    y: {
                        ticks: { color: textColor },
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // График популярности тем
    const topicsCtx = document.getElementById('topics-popularity-chart')?.getContext('2d');
    if (topicsCtx) {
        const topicNames = Object.keys(data.topicAnalytics);
        const counts = topicNames.map(topic => data.topicAnalytics[topic].count);
        
        charts.topicsPopularity = new Chart(topicsCtx, {
            type: 'doughnut',
            data: {
                labels: topicNames,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(168, 85, 247, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor
                        }
                    }
                }
            }
        });
    }
}

// Обновление прогноза
function updateForecast(data) {
    // Простой прогноз на основе линейной регрессии
    const dates = Object.keys(data.lessonsByDate).sort();
    const counts = dates.map(date => data.lessonsByDate[date].count);
    const income = dates.map(date => data.lessonsByDate[date].income);
    
    // Прогноз уроков
    const lessonsForecast = calculateLinearForecast(counts);
    const incomeForecast = calculateLinearForecast(income);
    
    document.getElementById('lessons-forecast').textContent = Math.round(lessonsForecast.predicted);
    document.getElementById('lessons-confidence').textContent = 
        `${Math.round(lessonsForecast.lower)}-${Math.round(lessonsForecast.upper)}`;
    
    document.getElementById('income-forecast').textContent = `${Math.round(incomeForecast.predicted).toLocaleString()} ₽`;
    document.getElementById('income-confidence').textContent = 
        `${Math.round(incomeForecast.lower).toLocaleString()}-${Math.round(incomeForecast.upper).toLocaleString()} ₽`;
    
    // Прогноз новых учеников
    const studentsForecast = Math.floor(Math.random() * 3) + 1;
    document.getElementById('students-forecast').textContent = studentsForecast;
    
    // Генерация рекомендаций
    generateRecommendations(data);
}

// Расчет линейного прогноза
function calculateLinearForecast(data) {
    if (data.length < 2) {
        return { predicted: data[0] || 0, lower: 0, upper: 0 };
    }
    
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = data.reduce((sum, val, index) => sum + val * index, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const predicted = slope * n + intercept;
    const variance = data.reduce((sum, val) => {
        const expected = slope * data.indexOf(val) + intercept;
        return sum + Math.pow(val - expected, 2);
    }, 0) / n;
    
    const margin = Math.sqrt(variance) * 1.96; // 95% доверительный интервал
    
    return {
        predicted: Math.max(0, predicted),
        lower: Math.max(0, predicted - margin),
        upper: predicted + margin
    };
}

// Генерация рекомендаций
function generateRecommendations(data) {
    const recommendations = [];
    
    // Анализ эффективности
    if (data.efficiencyRate < 80) {
        recommendations.push({
            icon: 'fa-exclamation-triangle',
            text: 'Эффективность уроков ниже 80%. Рассмотрите изменение методики преподавания.'
        });
    }
    
    // Анализ посещаемости
    const attendanceRate = (data.completedLessons / data.totalLessons) * 100;
    if (attendanceRate < 90) {
        recommendations.push({
            icon: 'fa-calendar-times',
            text: 'Посещаемость ниже 90%. Улучшите напоминания о уроках.'
        });
    }
    
    // Анализ дохода
    if (data.totalIncome < 10000) {
        recommendations.push({
            icon: 'fa-chart-line',
            text: 'Доход можно увеличить. Рассмотрите привлечение новых учеников.'
        });
    }
    
    // Анализ прогресса
    if (data.avgProgress < 80) {
        recommendations.push({
            icon: 'fa-user-graduate',
            text: 'Средний прогресс ниже 80%. Усилите индивидуальный подход.'
        });
    }
    
    // Если все хорошо
    if (recommendations.length === 0) {
        recommendations.push({
            icon: 'fa-check-circle',
            text: 'Отличные показатели! Продолжайте в том же духе.'
        });
    }
    
    // Отображаем рекомендации
    const recommendationsContainer = document.getElementById('recommendations');
    if (recommendationsContainer) {
        recommendationsContainer.innerHTML = recommendations.map(rec => `
            <div class="flex items-start space-x-2">
                <i class="fas ${rec.icon} text-yellow-500 mt-0.5"></i>
                <span class="text-sm text-muted-foreground">${rec.text}</span>
            </div>
        `).join('');
    }
}

// Обновление детальной аналитики
function updateDetailedAnalytics(data) {
    // Эффективность
    updatePerformanceTab(data);
    
    // Ученики
    updateStudentsTab(data);
    
    // Темы
    updateTopicsTab(data);
}

// Обновление вкладки эффективности
function updatePerformanceTab(data) {
    const ratedLessons = lessons.filter(l => l.results?.rating);
    const avgRating = ratedLessons.length > 0 ? 
        ratedLessons.reduce((sum, l) => sum + l.results.rating, 0) / ratedLessons.length : 0;
    
    document.getElementById('avg-rating').textContent = avgRating.toFixed(1);
    document.getElementById('success-rate').textContent = `${Math.round(data.efficiencyRate)}%`;
    document.getElementById('avg-progress-per-lesson').textContent = `${Math.round(data.avgProgress)}%`;
    
    // Расчет коэффициента удержания
    const retentionRate = calculateRetentionRate();
    document.getElementById('retention-rate').textContent = `${Math.round(retentionRate)}%`;
}

// Расчет коэффициента удержания
function calculateRetentionRate() {
    if (students.length === 0) return 0;
    
    const activeStudents = students.filter(s => s.status === 'active').length;
    return (activeStudents / students.length) * 100;
}

// Обновление вкладки учеников
function updateStudentsTab(data) {
    const tbody = document.getElementById('students-analytics-body');
    if (!tbody) return;
    
    tbody.innerHTML = Object.keys(data.studentAnalytics).map(studentName => {
        const analytics = data.studentAnalytics[studentName];
        return `
            <tr class="border-b hover:bg-muted/50 transition-colors">
                <td class="p-3 font-medium">${studentName}</td>
                <td class="p-3">${analytics.completedLessons}</td>
                <td class="p-3">${Math.round(analytics.avgProgress)}%</td>
                <td class="p-3">${analytics.avgRating.toFixed(1)}</td>
                <td class="p-3">${Math.round(analytics.attendance)}%</td>
                <td class="p-3">
                    <div class="flex items-center space-x-2">
                        <div class="flex-1 bg-secondary rounded-full h-2">
                            <div class="bg-primary h-2 rounded-full" style="width: ${analytics.efficiency}%"></div>
                        </div>
                        <span class="text-sm font-medium">${Math.round(analytics.efficiency)}%</span>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Обновление вкладки тем
function updateTopicsTab(data) {
    const topicList = document.getElementById('topic-list');
    if (!topicList) return;
    
    const sortedTopics = Object.keys(data.topicAnalytics)
        .sort((a, b) => data.topicAnalytics[b].count - data.topicAnalytics[a].count);
    
    topicList.innerHTML = sortedTopics.map(topic => {
        const analytics = data.topicAnalytics[topic];
        return `
            <div class="bg-secondary/30 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-foreground">${topic}</h4>
                    <span class="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">${analytics.count} уроков</span>
                </div>
                <div class="grid grid-cols-2 gap-4 mb-3">
                    <div>
                        <span class="text-sm text-muted-foreground">Средний прогресс:</span>
                        <span class="ml-2 font-medium">${Math.round(analytics.avgProgress)}%</span>
                    </div>
                    <div>
                        <span class="text-sm text-muted-foreground">Средняя оценка:</span>
                        <span class="ml-2 font-medium">${analytics.avgRating.toFixed(1)}</span>
                    </div>
                </div>
                <div class="w-full bg-secondary rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: ${analytics.avgProgress}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Переключение вкладок
function switchTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('bg-background', 'text-foreground', 'shadow-sm');
            btn.classList.remove('text-muted-foreground');
        } else {
            btn.classList.remove('bg-background', 'text-foreground', 'shadow-sm');
            btn.classList.add('text-muted-foreground');
        }
    });
    
    tabPanes.forEach(pane => {
        if (pane.id === `${tabName}-tab`) {
            pane.classList.remove('hidden');
            pane.classList.add('active');
        } else {
            pane.classList.add('hidden');
            pane.classList.remove('active');
        }
    });
}

// Экспорт аналитики
function exportAnalytics() {
    const analyticsContent = generateAnalyticsReport();
    downloadFile(analyticsContent, 'analytics-report.txt', 'text/plain');
    showToast('Аналитика экспортирована', 'success');
}

// Генерация отчета аналитики
function generateAnalyticsReport() {
    let content = 'АНАЛИТИЧЕСКИЙ ОТЧЕТ\n';
    content += '=' .repeat(50) + '\n\n';
    
    content += 'Период: ' + currentPeriod + '\n';
    content += 'Дата формирования: ' + new Date().toLocaleDateString('ru-RU') + '\n\n';
    
    content += 'КЛЮЧЕВЫЕ МЕТРИКИ\n';
    content += '-'.repeat(50) + '\n';
    content += 'Всего уроков: ' + analyticsData.totalLessons + '\n';
    content += 'Проведено уроков: ' + analyticsData.completedLessons + '\n';
    content += 'Общий доход: ' + analyticsData.totalIncome.toLocaleString() + ' ₽\n';
    content += 'Средний прогресс: ' + Math.round(analyticsData.avgProgress) + '%\n';
    content += 'Эффективность: ' + Math.round(analyticsData.efficiencyRate) + '%\n\n';
    
    content += 'ПРОГНОЗ\n';
    content += '-'.repeat(50) + '\n';
    const lessonsForecast = document.getElementById('lessons-forecast').textContent;
    const incomeForecast = document.getElementById('income-forecast').textContent;
    content += 'Прогноз уроков: ' + lessonsForecast + '\n';
    content += 'Прогноз дохода: ' + incomeForecast + '\n\n';
    
    content += 'РЕКОМЕНДАЦИИ\n';
    content += '-'.repeat(50) + '\n';
    const recommendations = document.querySelectorAll('#recommendations .flex');
    recommendations.forEach((rec, index) => {
        content += `${index + 1}. ${rec.querySelector('span').textContent}\n`;
    });
    
    return content;
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
    if (loadingState) {
        if (show) {
            loadingState.classList.remove('hidden');
        } else {
            loadingState.classList.add('hidden');
        }
    }
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('hidden');
            
            // Создаем или удаляем оверлей
            if (!sidebar.classList.contains('hidden')) {
                createOverlay();
            } else {
                removeOverlay();
            }
        });
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
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar) {
            sidebar.classList.add('hidden');
        }
        removeOverlay();
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