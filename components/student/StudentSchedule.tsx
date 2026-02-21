// components/student/StudentSchedule.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { mockStudentData } from '@/lib/mock-data/student-view';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const statusColorMap: { [key: string]: string } = {
  'Запланировано': 'border-blue-500',
  'Сегодня': 'border-green-500',
  'Завершено': 'border-gray-400',
};

export function StudentSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { schedule } = mockStudentData;

  const upcomingLessons = schedule.filter(lesson => lesson.date >= new Date());

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Card>
          <CardContent className="p-0">
             <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full"
                locale={ru}
                modifiers={{
                    // Highlight days that have lessons
                    lessonDay: schedule.map(l => l.date),
                }}
                modifiersClassNames={{
                    lessonDay: 'border-2 border-primary rounded-full',
                }}
             />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Ближайшие занятия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLessons.length > 0 ? (
                upcomingLessons.map(lesson => (
                    <div key={lesson.id} className={`p-4 rounded-lg border-l-4 ${statusColorMap[lesson.status] || 'border-gray-400'} bg-muted/50`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold">{lesson.subject}</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(lesson.date, "eeee, d MMMM 'в' HH:mm", { locale: ru })}
                                </p>
                            </div>
                            <Button size="sm" asChild>
                              <Link href="/student/lesson">Войти в урок</Link>
                            </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">Длительность: {lesson.duration} мин.</div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Нет предстоящих занятий.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
