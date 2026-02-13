// lib/mock-data/finances.ts

export type MonthlyIncome = {
    month: string;
    total: number;
};

export type StudentPayment = {
    studentId: string;
    studentName: string;
    tariff: string;
    amount: number;
    status: 'Оплачено' | 'Ожидает' | 'Просрочено';
};

export const monthlyIncomeData: MonthlyIncome[] = [
    { month: 'Янв', total: 60000 },
    { month: 'Фев', total: 65000 },
    { month: 'Мар', total: 72000 },
    { month: 'Апр', total: 68000 },
    { month: 'Май', total: 75000 },
    { month: 'Июн', total: 50000 },
    { month: 'Июл', total: 45000 },
    { month: 'Авг', total: 55000 },
    { month: 'Сен', total: 80000 },
    { month: 'Окт', total: 85000 },
    { month: 'Ноя', total: 90000 },
    { month: 'Дек', total: 95000 },
];

export const studentPaymentsData: StudentPayment[] = [
    { studentId: '1', studentName: 'Александр Петров', tariff: 'ОГЭ (2 раза/нед)', amount: 21600, status: 'Оплачено' },
    { studentId: '2', studentName: 'Мария Иванова', tariff: 'ЕГЭ (2 раза/нед)', amount: 21600, status: 'Оплачено' },
    { studentId: '3', studentName: 'Дмитрий Сидоров', tariff: 'Математика (1 раз/нед)', amount: 8000, status: 'Ожидает' },
    { studentId: '4', studentName: 'Елена Смирнова', tariff: 'Алгебра (2 раза/нед)', amount: 14400, status: 'Просрочено' },
    { studentId: '5', studentName: 'Иван Кузнецов', tariff: 'Математика (1 раз/нед)', amount: 8000, status: 'Оплачено' },
];

export const financialSummary = {
    totalIncome: 85000,
    totalLessons: 48,
    avgCheck: 1770,
};
