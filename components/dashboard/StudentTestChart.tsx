// components/dashboard/StudentTestChart.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ChartData = {
    name: string;
    uv: number;
};

interface StudentTestChartProps {
    data: ChartData[];
}

export function StudentTestChart({ data }: StudentTestChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Результаты тестов</CardTitle>
                <CardDescription>Динамика оценок по последним тестам.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]}/>
                        <RechartsTooltip />
                        <Bar dataKey="uv" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
