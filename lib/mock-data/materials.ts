// lib/mock-data/materials.ts

export type Material = {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'link' | 'note';
  category: '5 класс' | '6 класс' | '7 класс' | '8 класс' | '9 класс (ОГЭ)' | '10 класс' | '11 класс (ЕГЭ)';
  subject: 'Алгебра' | 'Геометрия' | 'Математика';
  topic: string;
  tags: ('домашка' | 'тест' | 'конспект' | 'видео' | 'формулы' | 'ОГЭ' | 'ЕГЭ')[];
  fileUrl?: string;
  content?: string; // for notes
  createdAt: string;
};

export const materials: Material[] = [
  {
    id: 'mat-1',
    title: 'Квадратные уравнения: Полное руководство',
    type: 'pdf',
    category: '8 класс',
    subject: 'Алгебра',
    topic: 'Алгебраические уравнения',
    tags: ['конспект', 'формулы'],
    fileUrl: '#',
    createdAt: '2024-10-15',
  },
  {
    id: 'mat-2',
    title: 'Видеоурок: Теорема Пифагора',
    type: 'video',
    category: '7 класс',
    subject: 'Геометрия',
    topic: 'Треугольники',
    tags: ['видео', 'конспект'],
    fileUrl: '#',
    createdAt: '2024-10-12',
  },
  {
    id: 'mat-3',
    title: 'Домашнее задание №5: Функции и графики',
    type: 'doc',
    category: '9 класс (ОГЭ)',
    subject: 'Алгебра',
    topic: 'Функции',
    tags: ['домашка', 'тест'],
    fileUrl: '#',
    createdAt: '2024-10-11',
  },
  {
    id: 'mat-4',
    title: 'Заметка: Основные тригонометрические тождества',
    type: 'note',
    category: '10 класс',
    subject: 'Алгебра',
    topic: 'Тригонометрия',
    tags: ['формулы'],
    content: 'sin²(α) + cos²(α) = 1; tg(α) = sin(α) / cos(α); ...',
    createdAt: '2024-10-10',
  },
    {
    id: 'mat-5',
    title: 'Пробный тест ЕГЭ по стереометрии',
    type: 'pdf',
    category: '11 класс (ЕГЭ)',
    subject: 'Геометрия',
    topic: 'Стереометрия',
    tags: ['тест', 'ЕГЭ'],
    fileUrl: '#',
    createdAt: '2024-10-09',
  },
  {
    id: 'mat-6',
    title: 'Изображение: график параболы',
    type: 'image',
    category: '8 класс',
    subject: 'Алгебра',
    topic: 'Функции',
    tags: ['видео'],
    fileUrl: '/image/class.png', // Placeholder
    createdAt: '2024-10-08',
  }
];
