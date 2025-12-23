"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LessonsChartProps {
  data: Array<{
    month: string;
    scheduled: number;
    completed: number;
    cancelled: number;
  }>;
}

export default function LessonsChart({ data }: LessonsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="scheduled" fill="#8884d8" name="Запланировано" />
        <Bar dataKey="completed" fill="#82ca9d" name="Завершено" />
        <Bar dataKey="cancelled" fill="#ffc658" name="Отменено" />
      </BarChart>
    </ResponsiveContainer>
  );
}

