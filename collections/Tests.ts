import type { CollectionConfig } from 'payload'

export const Tests: CollectionConfig = {
  slug: 'tests',
  labels: {
    singular: 'Тест',
    plural: 'Тесты',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subject', 'topic', 'timeLimitMinutes'],
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
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'subject',
      type: 'select',
      required: true,
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
      name: 'timeLimitMinutes',
      type: 'number',
      label: 'Лимит времени (мин)',
      defaultValue: 0,
      admin: {
        description: '0 = без лимита',
      },
    },
    {
      name: 'passThreshold',
      type: 'number',
      label: 'Порог прохождения %',
      defaultValue: 75,
    },
    {
      name: 'questions',
      type: 'array',
      label: 'Вопросы',
      required: true,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Текст вопроса',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Тип',
          options: [
            { label: 'Один ответ', value: 'single-choice' },
            { label: 'Несколько ответов', value: 'multiple-choice' },
            { label: 'Текстовый ответ', value: 'text-input' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          label: 'Варианты ответа',
          fields: [
            {
              name: 'option',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            condition: (data, siblingData) =>
              siblingData?.type === 'single-choice' || siblingData?.type === 'multiple-choice',
          },
        },
        {
          name: 'correctAnswers',
          type: 'array',
          label: 'Правильные ответы',
          required: true,
          fields: [
            {
              name: 'answer',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
