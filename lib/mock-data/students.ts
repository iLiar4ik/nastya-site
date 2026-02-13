// lib/mock-data/students.ts

export type TopicProgress = {
  topic: string;
  progress: number;
};

export type TestHistory = {
  date: string;
  topic: string;
  score: number;
};

export type AttendanceHistory = {
  date: string; // e.g., '2024-09-01'
  status: 'attended' | 'missed';
};

export type Student = {
  id: string;
  name: string;
  class: string;
  avatarUrl: string;
  attendance: number;
  avgTestScore: number;
  homeworkSubmitted: number;
  courseProgress: number;
  lastActivity: string;
  subjects: string[];
  topicProgress: TopicProgress[];
  testHistory: TestHistory[];
  attendanceHistory: AttendanceHistory[];
};

export const students: Student[] = [
  {
    id: '1',
    name: 'Александр Петров',
    class: '9 "А" класс',
    avatarUrl: '/image/Ykazka.png', // Placeholder
    attendance: 95,
    avgTestScore: 8.2,
    homeworkSubmitted: 15,
    courseProgress: 80,
    lastActivity: '2 дня назад',
    subjects: ['Алгебра', 'Геометрия', 'ОГЭ'],
    topicProgress: [
      { topic: 'Алгебра', progress: 85 },
      { topic: 'Геометрия', progress: 70 },
      { topic: 'Теория вероятностей', progress: 90 },
    ],
    testHistory: [
      { date: '2024-09-15', topic: 'Функции', score: 8 },
      { date: '2024-10-01', topic: 'Уравнения', score: 9 },
      { date: '2024-10-12', topic: 'Пробный ОГЭ', score: 7 },
    ],
    attendanceHistory: [
      { date: '2024-09-20', status: 'attended'},
      { date: '2024-09-27', status: 'attended'},
      { date: '2024-10-04', status: 'missed'},
      { date: '2024-10-11', status: 'attended'},
    ]
  },
  {
    id: '2',
    name: 'Мария Иванова',
    class: '11 "Б" класс',
    avatarUrl: '/image/Ykazka.png', // Placeholder
    attendance: 88,
    avgTestScore: 9.1,
    homeworkSubmitted: 20,
    courseProgress: 92,
    lastActivity: 'Сегодня',
    subjects: ['Математика', 'ЕГЭ'],
    topicProgress: [
      { topic: 'Стереометрия', progress: 95 },
      { topic: 'Планиметрия', progress: 88 },
      { topic: 'Экономическая задача', progress: 91 },
    ],
    testHistory: [
      { date: '2024-09-18', topic: 'Логарифмы', score: 9 },
      { date: '2024-10-05', topic: 'Производные', score: 10 },
      { date: '2024-10-15', topic: 'Пробный ЕГЭ', score: 8 },
    ],
    attendanceHistory: [
      { date: '2024-09-22', status: 'attended'},
      { date: '2024-09-29', status: 'missed'},
      { date: '2024-10-06', status: 'missed'},
      { date: '2024-10-13', status: 'attended'},
    ]
  },
  // Simplified data for other students
  {
    id: '3',
    name: 'Дмитрий Сидоров',
    class: '7 "В" класс',
    avatarUrl: '/image/Ykazka.png',
    attendance: 100,
    avgTestScore: 7.5,
    homeworkSubmitted: 12,
    courseProgress: 65,
    lastActivity: 'Вчера',
    subjects: ['Алгебра', 'Геометрия'],
    topicProgress: [{ topic: 'Алгебра', progress: 65 }, { topic: 'Геометрия', progress: 75 }],
    testHistory: [{ date: '2024-10-10', topic: 'Дроби', score: 7 }],
    attendanceHistory: [],
  },
  {
    id: '4',
    name: 'Елена Смирнова',
    class: '10 "А" класс',
    avatarUrl: '/image/Ykazka.png',
    attendance: 92,
    avgTestScore: 8.8,
    homeworkSubmitted: 18,
    courseProgress: 75,
    lastActivity: '4 дня назад',
    subjects: ['Алгебра', 'Функции'],
    topicProgress: [{ topic: 'Алгебра', progress: 80 }, { topic: 'Функции', progress: 70 }],
    testHistory: [{ date: '2024-10-12', topic: 'Тригонометрия', score: 9 }],
    attendanceHistory: [],
  },
  {
    id: '5',
    name: 'Иван Кузнецов',
    class: '8 "Г" класс',
    avatarUrl: '/image/Ykazka.png',
    attendance: 85,
    avgTestScore: 6.9,
    homeworkSubmitted: 10,
    courseProgress: 50,
    lastActivity: '1 неделю назад',
    subjects: ['Математика'],
    topicProgress: [{ topic: 'Математика', progress: 50 }],
    testHistory: [{ date: '2024-10-08', topic: 'Уравнения', score: 6 }],
    attendanceHistory: [],
  },
];
