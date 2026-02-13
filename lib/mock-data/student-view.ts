// lib/mock-data/student-view.ts

export type UpcomingLesson = {
    id: string;
    subject: 'Математика' | 'Алгебра' | 'Геометрия' | 'ОГЭ' | 'ЕГЭ';
    date: Date;
    duration: 60 | 90;
    status: 'Запланировано' | 'Сегодня' | 'Завершено';
};

export type StudentNotification = {
    id: string;
    type: 'new_hw' | 'new_message' | 'reminder' | 'grade_ready';
    text: string;
    isRead: boolean;
    date: string;
};

export const mockStudentData = {
    name: 'Александр',
    class: '9 "А" класс',
    overallProgress: 80,
    nextLesson: {
        subject: 'ОГЭ',
        date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        duration: 90,
    },
    notifications: [
        { id: 'n1', type: 'grade_ready', text: 'Домашнее задание "Квадратные уравнения" проверено. Оценка: 7/10.', isRead: false, date: '1 час назад' },
        { id: 'n2', type: 'new_hw', text: 'Новое домашнее задание по теме "Неравенства".', isRead: false, date: '4 часа назад' },
        { id: 'n3', type: 'reminder', text: 'Напоминание: занятие по ОГЭ завтра в 16:00.', isRead: true, date: '1 день назад' },
        { id: 'n4', type: 'new_message', text: 'Новое сообщение от учителя.', isRead: true, date: '2 дня назад' },
    ] as StudentNotification[],
    schedule: [
        { id: 's1', subject: 'Алгебра', date: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), duration: 60, status: 'Завершено' },
        { id: 's2', subject: 'ОГЭ', date: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), duration: 90, status: 'Запланировано' },
        { id: 's3', subject: 'Геометрия', date: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), duration: 60, status: 'Запланировано' },
    ] as UpcomingLesson[],
};
