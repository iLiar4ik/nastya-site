import type { CollectionConfig } from 'payload'

export const Students: CollectionConfig = {
  slug: 'students',
  labels: {
    singular: 'Ученик',
    plural: 'Ученики',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'class', 'subjects', 'courseProgress'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Имя',
    },
    {
      name: 'class',
      type: 'text',
      label: 'Класс',
      admin: {
        description: 'Например: 9 "А" класс',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
    },
    {
      name: 'subjects',
      type: 'array',
      label: 'Предметы',
      fields: [
        {
          name: 'subject',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'attendance',
      type: 'number',
      label: 'Посещаемость %',
      defaultValue: 100,
      admin: {
        description: 'Процент посещённых занятий',
      },
    },
    {
      name: 'avgTestScore',
      type: 'number',
      label: 'Средний балл тестов',
      admin: {
        description: 'По 10-балльной шкале',
      },
    },
    {
      name: 'courseProgress',
      type: 'number',
      label: 'Прогресс курса %',
      defaultValue: 0,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Заметки учителя',
    },
  ],
}
