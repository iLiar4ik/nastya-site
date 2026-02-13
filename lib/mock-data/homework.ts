// lib/mock-data/homework.ts

import { students } from './students';
import { materials } from './materials';

export type HomeworkStatus = 'Активные' | 'На проверке' | 'Проверенные' | 'Просроченные';

export type Homework = {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  materialId: string; // ID of the material related to this homework
  status: HomeworkStatus;
  dueDate: string;
  submittedDate?: string;
  studentSubmission?: {
    type: 'text' | 'image' | 'file';
    content: string; // text content or URL for image/file
  };
  grade?: number;
  teacherComment?: string;
  studentComment?: string;
};

export const homeworks: Homework[] = [
  {
    id: 'hw-1',
    title: 'Домашнее задание №5: Функции и графики',
    studentId: students[0].id,
    studentName: students[0].name,
    studentAvatar: students[0].avatarUrl,
    materialId: materials[2].id,
    status: 'На проверке',
    dueDate: '2024-10-20',
    submittedDate: '2024-10-19',
    studentSubmission: {
      type: 'text',
      content: 'Решил все четные номера, возникли вопросы по пункту В.',
    },
    studentComment: 'Мне было сложно с заданием №3. Можете помочь?',
  },
  {
    id: 'hw-2',
    title: 'Квадратные уравнения',
    studentId: students[1].id,
    studentName: students[1].name,
    studentAvatar: students[1].avatarUrl,
    materialId: materials[0].id,
    status: 'Проверенные',
    dueDate: '2024-10-18',
    submittedDate: '2024-10-17',
    grade: 9,
    teacherComment: 'Отличная работа! Все решено верно.',
    studentSubmission: {
      type: 'image',
      content: '/image/colpacs.png', // Placeholder image
    },
    studentComment: 'Я думаю, я хорошо справилась с этим заданием.',
  },
  {
    id: 'hw-3',
    title: 'Теорема Пифагора - практика',
    studentId: students[2].id,
    studentName: students[2].name,
    studentAvatar: students[2].avatarUrl,
    materialId: materials[1].id,
    status: 'Активные',
    dueDate: '2024-10-25',
  },
  {
    id: 'hw-4',
    title: 'Тригонометрические тождества',
    studentId: students[3].id,
    studentName: students[3].name,
    studentAvatar: students[3].avatarUrl,
    materialId: materials[3].id,
    status: 'Просроченные',
    dueDate: '2024-10-15',
  },
    {
    id: 'hw-5',
    title: 'Пробный тест ЕГЭ',
    studentId: students[0].id,
    studentName: students[0].name,
    studentAvatar: students[0].avatarUrl,
    materialId: materials[4].id,
    status: 'Проверенные',
    dueDate: '2024-10-10',
    submittedDate: '2024-10-10',
    grade: 7,
    teacherComment: 'Нужно уделить внимание задачам со стереометрией.',
    studentSubmission: {
      type: 'file',
      content: 'https://example.com/submission_hw5.pdf', // Placeholder file
    },
  },
];
