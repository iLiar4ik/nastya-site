"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Grade {
  id: string;
  topic: string;
  grade: number;
  maxGrade: number;
  date: Date;
}

interface ProgressChartProps {
  grades: Grade[];
}

export function ProgressChart({ grades }: ProgressChartProps) {
  const chartData = grades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((grade) => ({
      date: format(new Date(grade.date), "d MMM", { locale: ru }),
      percentage: Math.round((grade.grade / grade.maxGrade) * 100),
      grade: grade.grade,
    }));

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Недостаточно данных для построения графика
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke="#8884d8"
          name="Процент выполнения"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

