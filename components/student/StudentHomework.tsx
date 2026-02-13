// components/student/StudentHomework.tsx
"use client";

import { ReactNode } from 'react';
import { homeworks, Homework, HomeworkStatus } from '@/lib/mock-data/homework';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, AlertCircle, FileQuestion, Star } from 'lucide-react';
import Link from 'next/link';

// Assuming a single student view for now
const currentStudentId = '1';
const studentHomeworks = homeworks.filter(hw => hw.studentId === currentStudentId);

const statusMap: { [key in HomeworkStatus]: { icon: ReactNode; color: string; label: string } } = {
  'Активные': { icon: <Clock className="h-4 w-4" />, color: 'text-blue-500', label: 'Активные' },
  'На проверке': { icon: <FileQuestion className="h-4 w-4" />, color: 'text-yellow-500', label: 'На проверке' },
  'Проверенные': { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-500', label: 'Проверенные' },
  'Просроченные': { icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-500', label: 'Просроченные' },
};

const HomeworkCard = ({ hw }: { hw: Homework }) => {
  const statusInfo = statusMap[hw.status];
  return (
    <Card className="hover:bg-muted/50 transition-colors flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{hw.title}</CardTitle>
            <Badge variant="outline" className={statusInfo.color}>
                {statusInfo.icon}
                <span className="ml-2">{statusInfo.label}</span>
            </Badge>
        </div>
        <CardDescription>Срок сдачи: {hw.dueDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {hw.status === 'Проверенные' && hw.grade && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 text-green-800">
                <Star className="h-5 w-5" />
                <div>
                    <p className="font-semibold">Оценка: {hw.grade}/10</p>
                    <p className="text-xs">{hw.teacherComment}</p>
                </div>
            </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            {/* Link to a static page for now */}
          <Link href="#">{hw.status === 'Активные' ? 'Начать выполнение' : 'Посмотреть'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export function StudentHomework() {
  const statuses: HomeworkStatus[] = ['Активные', 'На проверке', 'Проверенные', 'Просроченные'];

  return (
    <Tabs defaultValue="Активные" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {statuses.map(status => (
          <TabsTrigger key={status} value={status}>
            {statusMap[status].icon}
            <span className="ml-2">{status}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {statuses.map(status => (
        <TabsContent key={status} value={status}>
            <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {studentHomeworks.filter(hw => hw.status === status).map(hw => (
                    <HomeworkCard key={hw.id} hw={hw} />
                ))}
            </div>
            {studentHomeworks.filter(hw => hw.status === status).length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Нет домашних заданий в этом статусе.</p>
                </div>
            )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
