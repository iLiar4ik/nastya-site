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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface OGETest {
  id: string;
  testDate: string;
  score: number;
  maxScore: number;
  notes?: string;
  student: {
    user: {
      name: string | null;
      email: string;
    };
  };
}

export default function OGEStatisticsPage() {
  const [tests, setTests] = useState<OGETest[]>([]);
  const [filteredTests, setFilteredTests] = useState<OGETest[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStudent === "all") {
      setFilteredTests(tests);
    } else {
      setFilteredTests(tests.filter((t) => t.student.user.email === selectedStudent));
    }
  }, [selectedStudent, tests]);

  const fetchData = async () => {
    try {
      const [testsRes, studentsRes] = await Promise.all([
        fetch("/api/oge/tests"),
        fetch("/api/students"),
      ]);

      const testsData = await testsRes.json();
      const studentsData = await studentsRes.json();

      setTests(testsData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = filteredTests.map((test) => ({
    name: test.student.user.name || test.student.user.email,
    score: test.score,
    percentage: Math.round((test.score / test.maxScore) * 100),
    date: format(new Date(test.testDate), "d MMM", { locale: ru }),
  }));

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Статистика пробников ОГЭ</h1>
          <p className="text-muted-foreground">
            Результаты пробных тестов по всем ученикам
          </p>
        </div>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Все ученики" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все ученики</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.user.email}>
                {student.user.name || student.user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>График результатов</CardTitle>
          <CardDescription>
            Процент выполнения пробных тестов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="percentage" fill="#8884d8" name="Процент (%)" />
            </BarChart>
          </ResponsiveContainer>
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
                <TableHead>Ученик</TableHead>
                <TableHead>Дата теста</TableHead>
                <TableHead>Баллы</TableHead>
                <TableHead>Процент</TableHead>
                <TableHead>Заметки</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Нет данных
                  </TableCell>
                </TableRow>
              ) : (
                filteredTests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      {test.student.user.name || test.student.user.email}
                    </TableCell>
                    <TableCell>
                      {format(new Date(test.testDate), "d MMM yyyy", { locale: ru })}
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

