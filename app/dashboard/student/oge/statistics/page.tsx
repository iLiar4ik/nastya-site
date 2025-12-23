"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

interface OGETest {
  id: string;
  testDate: string;
  score: number;
  maxScore: number;
  notes?: string;
}

export default function StudentOGEStatisticsPage() {
  const [tests, setTests] = useState<OGETest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/oge/tests/student");
      const data = await response.json();
      setTests(data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = tests
    .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
    .map((test) => ({
      date: format(new Date(test.testDate), "d MMM", { locale: ru }),
      score: test.score,
      percentage: Math.round((test.score / test.maxScore) * 100),
    }));

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Моя статистика ОГЭ</h1>
        <p className="text-muted-foreground">
          Результаты моих пробных тестов
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>График прогресса</CardTitle>
          <CardDescription>
            Динамика результатов пробных тестов
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Нет данных для построения графика
            </div>
          ) : (
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
                  name="Процент выполнения (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Таблица результатов</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата теста</TableHead>
                <TableHead>Баллы</TableHead>
                <TableHead>Процент</TableHead>
                <TableHead>Заметки</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Нет результатов тестов
                  </TableCell>
                </TableRow>
              ) : (
                tests
                  .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
                  .map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>
                        {format(new Date(test.testDate), "d MMMM yyyy", { locale: ru })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {test.score} / {test.maxScore}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {Math.round((test.score / test.maxScore) * 100)}%
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {test.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


