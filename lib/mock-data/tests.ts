// lib/mock-data/tests.ts

export type QuestionType = 'single-choice' | 'multiple-choice' | 'text-input';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswers: string[]; // Can be one or more depending on type
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subject: 'Алгебра' | 'Геометрия' | 'Математика';
  topic: string;
  questions: Question[];
  timeLimitMinutes: number; // 0 for no limit
  passThreshold: number; // e.g., 80 for 80%
}

export const tests: Test[] = [
  {
    id: 'test-1',
    title: 'Итоговый тест по Квадратным уравнениям',
    description: 'Проверка знаний по теме "Квадратные уравнения", включая теорему Виета.',
    subject: 'Алгебра',
    topic: 'Алгебраические уравнения',
    timeLimitMinutes: 30,
    passThreshold: 75,
    questions: [
      {
        id: 'q1',
        type: 'single-choice',
        text: 'Найдите корни уравнения x² - 5x + 6 = 0',
        options: ['2 и 3', '1 и 6', '-2 и -3', 'Нет корней'],
        correctAnswers: ['2 и 3'],
      },
      {
        id: 'q2',
        type: 'text-input',
        text: 'Чему равен дискриминант уравнения 2x² - 3x - 2 = 0?',
        options: [],
        correctAnswers: ['25'],
      },
    ],
  },
  {
    id: 'test-2',
    title: 'Тест по Теореме Пифагора',
    description: 'Базовые задачи на применение теоремы Пифагора.',
    subject: 'Геометрия',
    topic: 'Треугольники',
    timeLimitMinutes: 15,
    passThreshold: 80,
    questions: [
        {
            id: 'q3',
            type: 'multiple-choice',
            text: 'Выберите все прямоугольные треугольники (по сторонам):',
            options: ['3, 4, 5', '5, 12, 13', '6, 7, 8', '8, 15, 17'],
            correctAnswers: ['3, 4, 5', '5, 12, 13', '8, 15, 17'],
        },
    ],
  },
];
