import type { CollectionConfig } from 'payload'

export const Payments: CollectionConfig = {
  slug: 'payments',
  labels: {
    singular: 'Платёж',
    plural: 'Платежи',
  },
  admin: {
    useAsTitle: 'tariff',
    defaultColumns: ['student', 'tariff', 'amount', 'status', 'dueDate'],
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
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      required: true,
      label: 'Ученик',
    },
    {
      name: 'tariff',
      type: 'text',
      required: true,
      label: 'Тариф',
      admin: {
        description: 'Например: ОГЭ (2 раза/нед), ЕГЭ (2 раза/нед)',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Сумма (₽)',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Статус',
      options: [
        { label: 'Ожидает', value: 'pending' },
        { label: 'Оплачено', value: 'paid' },
        { label: 'Просрочено', value: 'overdue' },
      ],
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Срок оплаты',
    },
    {
      name: 'paidDate',
      type: 'date',
      label: 'Дата оплаты',
      admin: {
        condition: (data) => data?.status === 'paid',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Примечание',
    },
  ],
}
