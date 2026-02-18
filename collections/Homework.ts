import type { CollectionConfig } from 'payload'

export const Homework: CollectionConfig = {
  slug: 'homework',
  labels: {
    singular: 'Домашнее задание',
    plural: 'Домашние задания',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'student', 'status', 'dueDate'],
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
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      required: true,
      label: 'Ученик',
    },
    {
      name: 'material',
      type: 'relationship',
      relationTo: 'materials',
      label: 'Связанный материал',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Статус',
      options: [
        { label: 'Активное', value: 'active' },
        { label: 'На проверке', value: 'review' },
        { label: 'Проверено', value: 'checked' },
        { label: 'Просрочено', value: 'overdue' },
      ],
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      label: 'Срок сдачи',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'instructions',
      type: 'textarea',
      label: 'Инструкции для ученика',
    },
    {
      name: 'submittedDate',
      type: 'date',
      label: 'Дата сдачи',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'submissionType',
      type: 'select',
      label: 'Тип сдачи',
      options: [
        { label: 'Текст', value: 'text' },
        { label: 'Изображение', value: 'image' },
        { label: 'Файл', value: 'file' },
      ],
      admin: {
        condition: (data) => data?.status === 'review' || data?.status === 'checked',
      },
    },
    {
      name: 'submissionContent',
      type: 'textarea',
      label: 'Ответ ученика (текст/ссылка)',
      admin: {
        condition: (data) => data?.status === 'review' || data?.status === 'checked',
      },
    },
    {
      name: 'submissionFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Файл сдачи',
      admin: {
        condition: (data) => data?.submissionType === 'image' || data?.submissionType === 'file',
      },
    },
    {
      name: 'grade',
      type: 'number',
      label: 'Оценка',
      admin: {
        condition: (data) => data?.status === 'checked',
      },
    },
    {
      name: 'teacherComment',
      type: 'textarea',
      label: 'Комментарий учителя',
      admin: {
        condition: (data) => data?.status === 'checked',
      },
    },
    {
      name: 'studentComment',
      type: 'textarea',
      label: 'Комментарий ученика',
      admin: {
        readOnly: true,
      },
    },
  ],
}
