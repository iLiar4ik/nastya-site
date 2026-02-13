// components/dashboard/FinancialReport.tsx
"use client";

import { financialSummary, monthlyIncomeData, studentPaymentsData } from '@/lib/mock-data/finances';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { DollarSign, BarChart2, BookOpen } from 'lucide-react';

const statusColorMap: { [key: string]: string } = {
  'Оплачено': 'bg-green-100 text-green-800',
  'Ожидает': 'bg-yellow-100 text-yellow-800',
  'Просрочено': 'bg-red-100 text-red-800',
};

export function FinancialReport() {
  return (
    <div className="flex flex-col gap-8">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общий доход (мес)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{financialSummary.totalIncome.toLocaleString('ru-RU')} ₽</div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Количество занятий (мес)</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{financialSummary.totalLessons}</div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{financialSummary.avgCheck.toLocaleString('ru-RU')} ₽</div>
            </CardContent>
            </Card>
        </div>

        {/* Income Chart */}
        <Card>
            <CardHeader>
                <CardTitle>График доходов</CardTitle>
                <CardDescription>Общий доход за последние 12 месяцев.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyIncomeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value as number / 1000)}k`}/>
                        <RechartsTooltip formatter={(value) => `${(value as number).toLocaleString('ru-RU')} ₽`}/>
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        {/* Student Payments Table */}
        <Card>
            <CardHeader>
                <CardTitle>Доходы по ученикам (за текущий месяц)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Имя ученика</TableHead>
                            <TableHead>Тариф</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Статус оплаты</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentPaymentsData.map(payment => (
                            <TableRow key={payment.studentId}>
                                <TableCell className="font-medium">{payment.studentName}</TableCell>
                                <TableCell>{payment.tariff}</TableCell>
                                <TableCell>{payment.amount.toLocaleString('ru-RU')} ₽</TableCell>
                                <TableCell>
                                    <Badge className={`${statusColorMap[payment.status]}`}>{payment.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
