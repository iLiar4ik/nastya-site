// app/dashboard/students/[studentId]/page.tsx
"use client";

import { use } from 'react';
import { notFound } from 'next/navigation';
import { students } from '@/lib/mock-data/students';
import { homeworks } from '@/lib/mock-data/homework';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';
import { StudentTestChart } from '@/components/dashboard/StudentTestChart';

type PageProps = {
  params: Promise<{ studentId: string }>;
};

export default function StudentDetailPage({ params }: PageProps) {
  const { studentId } = use(params);
  const student = students.find(s => s.id === studentId);
  const studentHomeworks = homeworks.filter(hw => hw.studentId === studentId);

  if (!student) {
    notFound();
  }
  
  const chartData = student.testHistory.map(t => ({ name: t.topic, uv: t.score }));

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className='flex items-center gap-4'>
            <Link href="/dashboard/students">
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <Avatar className="h-20 w-20">
              <AvatarImage src={student.avatarUrl} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">{student.name}</h1>
                <p className="text-muted-foreground">{student.class}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                    {student.subjects.map(subject => (
                        <Badge key={subject} variant="secondary">{subject}</Badge>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><MessageSquare className="h-4 w-4 mr-2" />Написать</Button>
            <Button><Download className="h-4 w-4 mr-2" />Экспорт отчёта</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Посещаемость</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.attendance}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Средний балл</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.avgTestScore}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сдано ДЗ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.homeworkSubmitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Прогресс курса</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student.courseProgress}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Progress by Topic */}
        <Card>
            <CardHeader>
                <CardTitle>Прогресс по темам</CardTitle>
                <CardDescription>Общий уровень освоения ключевых тем.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {student.topicProgress.map(topic => (
                    <div key={topic.topic}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium">{topic.topic}</span>
                            <span className="text-sm text-muted-foreground">{topic.progress}%</span>
                        </div>
                        <Progress value={topic.progress} />
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <StudentTestChart data={chartData} />
      </div>

      {/* Homework History */}
        <Card>
            <CardHeader>
                <CardTitle>История домашних заданий</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Название</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Оценка</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentHomeworks.map(hw => (
                            <TableRow key={hw.id}>
                                <TableCell className="font-medium">{hw.title}</TableCell>
                                <TableCell><Badge variant={hw.status === 'Проверенные' ? 'default' : 'secondary'}>{hw.status}</Badge></TableCell>
                                <TableCell>{hw.grade ? `${hw.grade}/10` : '–'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4"/>
                                    </Button>
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
