// lib/mock-data/chat.ts

export type Message = {
    id: string;
    sender: 'teacher' | 'student';
    text: string;
    timestamp: string;
    isRead: boolean;
};

export const chatHistory: Message[] = [
    {
        id: 'msg1',
        sender: 'teacher',
        text: 'Привет, Александр! Напоминаю, что завтра у нас занятие по ОГЭ в 16:00. Не забудь посмотреть материалы по неравенствам.',
        timestamp: 'Вчера, 18:30',
        isRead: true,
    },
    {
        id: 'msg2',
        sender: 'student',
        text: 'Здравствуйте! Да, помню, спасибо. По материалам есть вопрос, можно будет в начале урока обсудить?',
        timestamp: 'Вчера, 18:35',
        isRead: true,
    },
    {
        id: 'msg3',
        sender: 'teacher',
        text: 'Конечно, обязательно разберем все вопросы.',
        timestamp: 'Вчера, 18:40',
        isRead: true,
    },
    {
        id: 'msg4',
        sender: 'student',
        text: 'Отлично, спасибо!',
        timestamp: 'Вчера, 18:41',
        isRead: false, // Teacher hasn't read this yet
    },
];
