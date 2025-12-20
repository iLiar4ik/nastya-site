// Глобальные переменные для деталей занятия
let currentLesson = null;
let students = [];
let lessons = [];
let notes = [];

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initLessonDetails();
});

// Основная функция инициализации
function initLessonDetails() {
    loadStudents();
    loadLessons();
    loadNotes();
    initEventListeners();
    
    // Получаем ID занятия из URL
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get('id');
    
    if (lessonId) {
        loadLessonDetails(lessonId);
    } else {
        showToast('Занятие не найдено', 'error');
        setTimeout(() => {
            window.location.href = 'schedule.html';
        }, 2000);
    }
}

// Загрузка учеников из localStorage
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

// Загрузка занятий из localStorage
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

// Загрузка заметок из localStorage
function loadNotes() {
    try {
        const storedNotes = localStorage.getItem('lessonNotes');
        if (storedNotes) {
            notes = JSON.parse(storedNotes);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
        notes = [];
    }
}

// Загрузка деталей занятия
function loadLessonDetails(lessonId) {
    const lesson = lessons.find(l => l.id == lessonId);
    if (!lesson) {
        showToast('Занятие не найдено', 'error');
        setTimeout(() => {
            window.location.href = 'schedule.html';
        }, 2000);
        return;
    }
    
    currentLesson = lesson;
    displayLessonDetails(lesson);
    loadLessonNotes(lessonId);
    updatePageTitle(lesson);
}

// Отображение деталей занятия
function displayLessonDetails(lesson) {
    const lessonDate = new Date(lesson.date);
    const student = students.find(s => s.id == lesson.studentId);
    
    // Основная информация
    document.getElementById('lesson-date').textContent = formatDate(lessonDate);
    document.getElementById('lesson-time').textContent = formatTime(lessonDate);
    document.getElementById('lesson-duration').textContent = formatDuration(lesson.duration);
    
    const statusElement = document.getElementById('lesson-status');
    statusElement.textContent = getStatusText(lesson.status);
    statusElement.className = `status-badge ${lesson.status}`;
    
    // Информация об ученике
    if (student) {
        document.getElementById('student-name').textContent = student.name;
        document.getElementById('student-grade').textContent = `${student.grade} класс`;
        document.getElementById('student-phone').textContent = student.phone;
        document.getElementById('student-email').textContent = student.email;
    }
    
    // Тип занятия
    document.getElementById('lesson-type').textContent = lesson.type === 'online' ? 'Онлайн' : 'Офлайн';
    const typeIcon = document.getElementById('lesson-type-icon');
    if (typeIcon) {
        typeIcon.className = lesson.type === 'online' ? 'fas fa-laptop' : 'fas fa-map-marker-alt';
    }
    
    // Стоимость
    document.getElementById('lesson-price').textContent = `${lesson.price || 0} руб.`;
    
    // Оплата
    updatePaymentInfo(lesson);
    
    // Тема занятия
    document.getElementById('lesson-topic').textContent = lesson.topic || 'Тема не указана';
    
    // Домашнее задание
    const homeworkElement = document.getElementById('homework-content');
    if (homeworkElement) {
        homeworkElement.textContent = lesson.homework || 'Домашнее задание не задано';
    }
    
    // Обновление прогресса
    updateProgressBars(lesson);
    
    // Управление кнопками в зависимости от статуса
    updateActionButtons(lesson);
    
    // Показываем результаты, если занятие проведено
    if (lesson.status === 'completed') {
        showResultsSection(lesson);
    }
}

// Обновление информации об оплате
function updatePaymentInfo(lesson) {
    const paymentInfo = document.getElementById('payment-info');
    const paymentAmount = document.getElementById('payment-amount');
    const paymentStatus = document.getElementById('payment-status');
    
    if (!paymentInfo || !paymentAmount || !paymentStatus) return;
    
    // Если занятие не проведено, скрываем информацию об оплате
    if (lesson.status !== 'completed') {
        paymentInfo.style.display = 'none';
        return;
    }
    
    paymentInfo.style.display = 'block';
    paymentAmount.textContent = `${lesson.price || 0} руб.`;
    
    // Обновляем статус оплаты
    const statusText = getPaymentStatusText(lesson.paymentStatus);
    paymentStatus.textContent = statusText;
    paymentStatus.className = `payment-status ${lesson.paymentStatus || 'unpaid'}`;
}

// Обновление прогресс-баров
function updateProgressBars(lesson) {
    const lessonProgressBar = document.getElementById('lesson-progress-bar');
    const lessonProgressText = document.getElementById('lesson-progress-text');
    const materialsProgressBar = document.getElementById('materials-progress-bar');
    const materialsProgressText = document.getElementById('materials-progress-text');
    
    if (!lessonProgressBar || !lessonProgressText || !materialsProgressBar || !materialsProgressText) return;
    
    // Прогресс занятия в зависимости от статуса
    let lessonProgress = 25; // Запланировано
    let lessonStatusText = 'Запланировано';
    
    if (lesson.status === 'completed') {
        lessonProgress = 100;
        lessonStatusText = 'Завершено';
    } else if (lesson.status === 'cancelled') {
        lessonProgress = 0;
        lessonStatusText = 'Отменено';
    }
    
    lessonProgressBar.style.width = `${lessonProgress}%`;
    lessonProgressText.textContent = lessonStatusText;
    
    // Прогресс материалов (заглушка, можно улучшить)
    const materialsProgress = lesson.materials ? lesson.materials.length * 25 : 50;
    materialsProgressBar.style.width = `${Math.min(materialsProgress, 100)}%`;
    materialsProgressText.textContent = `${Math.min(materialsProgress, 100)}%`;
}

// Получение текста статуса оплаты
function getPaymentStatusText(status) {
    const statusTexts = {
        'paid': 'Оплачено',
        'unpaid': 'Не оплачено',
        'partial': 'Частично оплачено'
    };
    
    return statusTexts[status] || 'Не оплачено';
}

// Обновление кнопок действий
function updateActionButtons(lesson) {
    const editBtn = document.getElementById('edit-btn');
    const completeBtn = document.getElementById('complete-btn');
    
    if (!editBtn || !completeBtn) return;
    
    if (lesson.status === 'completed') {
        completeBtn.style.display = 'none';
    } else {
        completeBtn.style.display = 'inline-block';
    }
}

// Показ секции результатов
function showResultsSection(lesson) {
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) return;
    
    resultsSection.style.display = 'block';
    
    // Если результаты уже есть, отображаем их
    if (lesson.results) {
        displayExistingResults(lesson.results);
    }
}

// Отображение существующих результатов
function displayExistingResults(results) {
    if (results.rating) {
        setRating(results.rating);
    }
    
    if (results.progress) {
        document.getElementById('student-progress').value = results.progress;
    }
    
    if (results.notes) {
        document.getElementById('lesson-results').value = results.notes;
    }
}

// Загрузка заметок к занятию
function loadLessonNotes(lessonId) {
    const lessonNotes = notes.filter(n => n.lessonId == lessonId);
    displayNotes(lessonNotes);
}

// Отображение заметок
function displayNotes(lessonNotes) {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;
    
    notesList.innerHTML = '';
    
    if (lessonNotes.length === 0) {
        notesList.innerHTML = '<p style="text-align: center; color: hsl(var(--muted-foreground));">Заметок пока нет</p>';
        return;
    }
    
    lessonNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesList.appendChild(noteElement);
    });
}

// Создание элемента заметки
function createNoteElement(note) {
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item';
    noteItem.dataset.noteId = note.id;
    
    const noteDate = new Date(note.date);
    
    noteItem.innerHTML = `
        <div class="note-header">
            <div class="note-author">${note.author}</div>
            <div class="note-date">${formatDateTime(noteDate)}</div>
        </div>
        <div class="note-content">${note.content}</div>
        <div class="note-actions">
            <button class="note-action" title="Редактировать" onclick="editNote(${note.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="note-action" title="Удалить" onclick="deleteNote(${note.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return noteItem;
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Кнопка редактирования
    const editBtn = document.getElementById('edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            editLesson();
        });
    }
    
    // Кнопка проведения занятия
    const completeBtn = document.getElementById('complete-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', function() {
            completeLesson();
        });
    }
    
    // Кнопка добавления материала
    const addMaterialBtn = document.getElementById('add-material-btn');
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', function() {
            showMaterialModal();
        });
    }
    
    // Модальное окно материала
    const materialModal = document.getElementById('material-modal');
    const materialModalClose = document.getElementById('material-modal-close');
    const materialCancelBtn = document.getElementById('material-cancel-btn');
    const materialForm = document.getElementById('material-form');
    
    if (materialModalClose) {
        materialModalClose.addEventListener('click', hideMaterialModal);
    }
    
    if (materialCancelBtn) {
        materialCancelBtn.addEventListener('click', hideMaterialModal);
    }
    
    if (materialModal) {
        materialModal.addEventListener('click', function(e) {
            if (e.target === materialModal) {
                hideMaterialModal();
            }
        });
    }
    
    if (materialForm) {
        materialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveMaterial();
        });
    }
    
    // Рейтинг
    const ratingStars = document.querySelectorAll('.rating-star');
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            setRating(parseInt(this.dataset.rating));
        });
        
        star.addEventListener('mouseenter', function() {
            highlightRating(parseInt(this.dataset.rating));
        });
    });
    
    const ratingGroup = document.querySelector('.rating-group');
    if (ratingGroup) {
        ratingGroup.addEventListener('mouseleave', function() {
            const currentRating = getCurrentRating();
            highlightRating(currentRating);
        });
    }
    
    // Форма результатов
    const resultsForm = document.getElementById('results-form');
    if (resultsForm) {
        resultsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveResults();
        });
    }
    
    // Кнопка отмены результатов
    const cancelResultsBtn = document.getElementById('cancel-results-btn');
    if (cancelResultsBtn) {
        cancelResultsBtn.addEventListener('click', function() {
            hideResultsForm();
        });
    }
    
    // Кнопка добавления заметки
    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', function() {
            addNote();
        });
    }
    
    // Кнопка выхода
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
}

// Показ модального окна для добавления материала
function showMaterialModal() {
    const modal = document.getElementById('material-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('material-name').focus();
    }
}

// Скрытие модального окна для добавления материала
function hideMaterialModal() {
    const modal = document.getElementById('material-modal');
    const form = document.getElementById('material-form');
    
    if (modal) {
        modal.style.display = 'none';
    }
    
    if (form) {
        form.reset();
    }
}

// Сохранение материала
function saveMaterial() {
    const name = document.getElementById('material-name').value;
    const type = document.getElementById('material-type').value;
    const url = document.getElementById('material-url').value;
    const description = document.getElementById('material-description').value;
    
    if (!name) {
        showToast('Пожалуйста, введите название материала', 'error');
        return;
    }
    
    // Определяем иконку в зависимости от типа
    let iconClass = 'fas fa-file';
    switch (type) {
        case 'link':
            iconClass = 'fas fa-link';
            break;
        case 'video':
            iconClass = 'fas fa-video';
            break;
        case 'image':
            iconClass = 'fas fa-image';
            break;
    }
    
    // Создаем элемент материала
    const materialsList = document.getElementById('materials-list');
    if (!materialsList) return;
    
    const materialItem = document.createElement('li');
    materialItem.className = 'material-item';
    
    materialItem.innerHTML = `
        <div class="material-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="material-info">
            <div class="material-name">${name}</div>
            <div class="material-description">${description || 'Без описания'}</div>
        </div>
        <button class="btn btn-sm btn-outline" onclick="openMaterial('${url || '#'}')">
            ${url ? 'Перейти' : 'Открыть'}
        </button>
    `;
    
    materialsList.appendChild(materialItem);
    
    // Обновляем прогресс материалов
    updateMaterialsProgress();
    
    // Сохраняем в localStorage (опционально)
    if (currentLesson && !currentLesson.materials) {
        currentLesson.materials = [];
    }
    
    if (currentLesson) {
        currentLesson.materials.push({
            id: Date.now(),
            name,
            type,
            url,
            description
        });
        
        // Обновляем занятие в localStorage
        const lessonIndex = lessons.findIndex(l => l.id === currentLesson.id);
        if (lessonIndex !== -1) {
            lessons[lessonIndex] = currentLesson;
            localStorage.setItem('lessons', JSON.stringify(lessons));
        }
    }
    
    hideMaterialModal();
    showToast('Материал добавлен', 'success');
}

// Обновление прогресса материалов
function updateMaterialsProgress() {
    const materialsList = document.getElementById('materials-list');
    const materialsProgressBar = document.getElementById('materials-progress-bar');
    const materialsProgressText = document.getElementById('materials-progress-text');
    
    if (!materialsList || !materialsProgressBar || !materialsProgressText) return;
    
    const materialCount = materialsList.querySelectorAll('.material-item').length;
    const progress = Math.min(materialCount * 25, 100);
    
    materialsProgressBar.style.width = `${progress}%`;
    materialsProgressText.textContent = `${progress}%`;
}

// Редактирование занятия
function editLesson() {
    if (!currentLesson) return;
    
    window.location.href = `lesson-form.html?id=${currentLesson.id}`;
}

// Проведение занятия
function completeLesson() {
    if (!currentLesson) return;
    
    // Показываем форму результатов
    const resultsSection = document.getElementById('results-section');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Изменяем текст кнопки
    const completeBtn = document.getElementById('complete-btn');
    if (completeBtn) {
        completeBtn.textContent = 'Сохранить результаты';
        completeBtn.onclick = saveResults;
    }
}

// Сохранение результатов
function saveResults() {
    if (!currentLesson) return;
    
    const rating = getCurrentRating();
    const progress = document.getElementById('student-progress').value;
    const resultsText = document.getElementById('lesson-results').value;
    
    // Валидация
    if (!rating) {
        showToast('Пожалуйста, оцените занятие', 'error');
        return;
    }
    
    if (!progress) {
        showToast('Пожалуйста, укажите прогресс ученика', 'error');
        return;
    }
    
    // Обновляем занятие
    const lessonIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (lessonIndex === -1) return;
    
    lessons[lessonIndex].status = 'completed';
    lessons[lessonIndex].paymentStatus = 'paid'; // Предполагаем, что оплата получена
    lessons[lessonIndex].results = {
        rating: rating,
        progress: progress,
        notes: resultsText,
        completedAt: new Date().toISOString()
    };
    
    // Сохраняем изменения
    localStorage.setItem('lessons', JSON.stringify(lessons));
    
    // Обновляем текущее занятие
    currentLesson = lessons[lessonIndex];
    
    // Обновляем отображение
    updateActionButtons(currentLesson);
    updatePaymentInfo(currentLesson);
    updateProgressBars(currentLesson);
    
    // Скрываем форму результатов
    hideResultsForm();
    
    showToast('Результаты занятия сохранены', 'success');
}

// Скрытие формы результатов
function hideResultsForm() {
    const resultsForm = document.getElementById('results-form');
    if (resultsForm) {
        resultsForm.reset();
    }
    
    // Возвращаем кнопку в исходное состояние
    const completeBtn = document.getElementById('complete-btn');
    if (completeBtn) {
        completeBtn.textContent = 'Отметить проведенным';
        completeBtn.onclick = completeLesson;
    }
}

// Установка рейтинга
function setRating(rating) {
    const ratingStars = document.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    updateRatingText(rating);
}

// Подсветка рейтинга
function highlightRating(rating) {
    const ratingStars = document.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    updateRatingText(rating);
}

// Получение текущего рейтинга
function getCurrentRating() {
    const activeStars = document.querySelectorAll('.rating-star.active');
    return activeStars.length;
}

// Обновление текста рейтинга
function updateRatingText(rating) {
    const ratingText = document.getElementById('rating-text');
    if (!ratingText) return;
    
    const ratingTexts = ['', 'Плохо', 'Удовлетворительно', 'Хорошо', 'Отлично', 'Превосходно'];
    ratingText.textContent = ratingTexts[rating] || 'Выберите оценку';
}

// Открытие материала
function openMaterial(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
    } else {
        showToast('Материал недоступен', 'error');
    }
}

// Добавление заметки
function addNote() {
    const noteContent = document.getElementById('new-note');
    if (!noteContent || !noteContent.value.trim()) {
        showToast('Пожалуйста, введите текст заметки', 'error');
        return;
    }
    
    const newNote = {
        id: Date.now(),
        lessonId: currentLesson.id,
        author: 'Настя', // В реальном приложении будет имя текущего пользователя
        content: noteContent.value.trim(),
        date: new Date().toISOString()
    };
    
    // Добавляем заметку
    notes.push(newNote);
    
    // Сохраняем изменения
    localStorage.setItem('lessonNotes', JSON.stringify(notes));
    
    // Добавляем заметку на страницу
    const notesList = document.getElementById('notes-list');
    if (notesList) {
        // Удаляем сообщение об отсутствии заметок
        const emptyMessage = notesList.querySelector('p');
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        const noteElement = createNoteElement(newNote);
        notesList.insertBefore(noteElement, notesList.firstChild);
    }
    
    // Очищаем поле
    noteContent.value = '';
    
    showToast('Заметка добавлена', 'success');
}

// Редактирование заметки
function editNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const newContent = prompt('Редактировать заметку:', note.content);
    if (!newContent || newContent === note.content) return;
    
    // Обновляем заметку
    note.content = newContent.trim();
    note.date = new Date().toISOString();
    
    // Сохраняем изменения
    localStorage.setItem('lessonNotes', JSON.stringify(notes));
    
    // Обновляем отображение
    loadLessonNotes(currentLesson.id);
    
    showToast('Заметка обновлена', 'success');
}

// Удаление заметки
function deleteNote(noteId) {
    if (!confirm('Вы уверены, что хотите удалить эту заметку?')) return;
    
    // Удаляем заметку
    const noteIndex = notes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
    }
    
    // Сохраняем изменения
    localStorage.setItem('lessonNotes', JSON.stringify(notes));
    
    // Удаляем элемент со страницы
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    if (noteElement) {
        noteElement.remove();
    }
    
    // Проверяем, остались ли заметки
    const notesList = document.getElementById('notes-list');
    if (notesList && notesList.children.length === 0) {
        notesList.innerHTML = '<p style="text-align: center; color: hsl(var(--muted-foreground));">Заметок пока нет</p>';
    }
    
    showToast('Заметка удалена', 'success');
}

// Обновление заголовка страницы
function updatePageTitle(lesson) {
    const lessonDate = new Date(lesson.date);
    const dateString = formatDate(lessonDate);
    const timeString = formatTime(lessonDate);
    
    document.title = `${dateString} ${timeString} - ${lesson.studentName} | Репетитор по математике Настя`;
}

// Форматирование даты
function formatDate(date) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// Форматирование времени
function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Форматирование даты и времени
function formatDateTime(date) {
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('ru-RU', options);
}

// Форматирование длительности
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} минут`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? 
            `${hours} час ${remainingMinutes} минут` : 
            `${hours} час${hours > 1 ? 'а' : ''}`;
    }
}

// Получение текста статуса
function getStatusText(status) {
    const statusTexts = {
        'scheduled': 'Запланировано',
        'completed': 'Проведено',
        'cancelled': 'Отменено'
    };
    
    return statusTexts[status] || status;
}

// Выход из системы
function logout() {
    if (confirm('Вы уверены, что хотите выйти из системы?')) {
        // В реальном приложении здесь будет выход из системы
        window.location.href = 'login.html';
    }
}

// Переключение мобильного меню
function toggleMobileMenu() {
    const sidebar = document.querySelector('.lesson-details-sidebar');
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