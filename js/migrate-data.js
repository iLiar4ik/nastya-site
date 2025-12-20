// Скрипт для миграции данных из LocalStorage в API
// Использование: откройте консоль браузера на любой странице и выполните migrateData()

async function migrateData() {
    console.log('Начало миграции данных...');
    
    try {
        // Проверяем наличие API клиента
        if (!window.apiClient) {
            throw new Error('API клиент не загружен. Убедитесь, что js/api/client.js подключен.');
        }

        // Проверяем авторизацию
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('Необходимо войти в систему перед миграцией данных');
        }

        // Экспорт данных из LocalStorage
        const studentsData = JSON.parse(localStorage.getItem('students') || '[]');
        const lessonsData = JSON.parse(localStorage.getItem('lessons') || '[]');
        const usersData = JSON.parse(localStorage.getItem('users') || '[]');

        console.log(`Найдено данных: ${studentsData.length} учеников, ${lessonsData.length} уроков, ${usersData.length} пользователей`);

        // Миграция учеников
        let migratedStudents = 0;
        for (const student of studentsData) {
            try {
                // Преобразуем формат данных
                const studentData = {
                    first_name: student.firstName || student.first_name,
                    last_name: student.lastName || student.last_name,
                    grade: student.grade,
                    birth_date: student.birthDate || student.birth_date,
                    phone: student.phone,
                    email: student.email,
                    address: student.address,
                    parent_name: student.parentName || student.parent_name,
                    parent_phone: student.parentPhone || student.parent_phone,
                    parent_email: student.parentEmail || student.parent_email,
                    status: student.status || 'active',
                    tariff: student.tariff,
                    notes: student.notes
                };

                await window.apiClient.createStudent(studentData);
                migratedStudents++;
                console.log(`Мигрирован ученик: ${studentData.first_name} ${studentData.last_name}`);
            } catch (error) {
                console.error(`Ошибка миграции ученика ${student.id}:`, error.message);
            }
        }

        // Миграция уроков (после миграции учеников)
        let migratedLessons = 0;
        for (const lesson of lessonsData) {
            try {
                // Находим нового ID ученика (нужно будет сопоставить старые и новые ID)
                // Для упрощения используем student_id напрямую, если он есть
                const lessonData = {
                    student_id: lesson.studentId || lesson.student_id,
                    date: lesson.date ? lesson.date.split('T')[0] : new Date().toISOString().split('T')[0],
                    time: lesson.time || (lesson.date ? new Date(lesson.date).toTimeString().split(' ')[0].substring(0, 5) : '15:00'),
                    duration: lesson.duration || 60,
                    topic: lesson.topic,
                    status: lesson.status || 'scheduled',
                    homework: lesson.homework || false,
                    rating: lesson.rating,
                    notes: lesson.notes
                };

                await window.apiClient.createLesson(lessonData);
                migratedLessons++;
                console.log(`Мигрирован урок: ${lessonData.date} ${lessonData.time}`);
            } catch (error) {
                console.error(`Ошибка миграции урока ${lesson.id}:`, error.message);
            }
        }

        console.log(`Миграция завершена! Мигрировано: ${migratedStudents} учеников, ${migratedLessons} уроков`);
        
        // Опционально: очистить LocalStorage после успешной миграции
        // localStorage.removeItem('students');
        // localStorage.removeItem('lessons');
        
        return {
            success: true,
            migratedStudents,
            migratedLessons
        };
    } catch (error) {
        console.error('Ошибка миграции:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Экспорт функции для использования в консоли
window.migrateData = migrateData;

console.log('Скрипт миграции загружен. Используйте migrateData() для начала миграции.');


