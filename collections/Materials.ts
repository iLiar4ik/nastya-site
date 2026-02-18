import type { CollectionConfig } from 'payload'

export const Materials: CollectionConfig = {
  slug: 'materials',
  labels: {
    singular: 'Материал',
    plural: 'Материалы',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'subject', 'category'],
    group: 'Панель учителя',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Тип',
      options: [
        { label: 'PDF', value: 'pdf' },
        { label: 'Документ', value: 'doc' },
        { label: 'Изображение', value: 'image' },
        { label: 'Видео', value: 'video' },
        { label: 'Ссылка', value: 'link' },
        { label: 'Заметка', value: 'note' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      label: 'Класс',
      options: [
        { label: '5 класс', value: '5' },
        { label: '6 класс', value: '6' },
        { label: '7 класс', value: '7' },
        { label: '8 класс', value: '8' },
        { label: '9 класс (ОГЭ)', value: '9' },
        { label: '10 класс', value: '10' },
        { label: '11 класс (ЕГЭ)', value: '11' },
      ],
    },
    {
      name: 'subject',
      type: 'select',
      label: 'Предмет',
      options: [
        { label: 'Алгебра', value: 'algebra' },
        { label: 'Геометрия', value: 'geometry' },
        { label: 'Математика', value: 'math' },
      ],
    },
    {
      name: 'topic',
      type: 'text',
      label: 'Тема',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Теги',
      fields: [
        {
          name: 'tag',
          type: 'select',
          options: [
            { label: 'Домашка', value: 'homework' },
            { label: 'Тест', value: 'test' },
            { label: 'Конспект', value: 'summary' },
            { label: 'Видео', value: 'video' },
            { label: 'Формулы', value: 'formulas' },
            { label: 'ОГЭ', value: 'oge' },
            { label: 'ЕГЭ', value: 'ege' },
          ],
        },
      ],
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Файл',
      admin: {
        condition: (data) => data?.type !== 'note' && data?.type !== 'link',
      },
    },
    {
      name: 'fileUrl',
      type: 'text',
      label: 'Ссылка на файл',
      admin: {
        condition: (data) => data?.type === 'link',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Содержимое (для заметок)',
      admin: {
        condition: (data) => data?.type === 'note',
      },
    },
  ],
}
