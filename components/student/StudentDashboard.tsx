// components/student/StudentDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { mockStudentData } from '@/lib/mock-data/student-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Clock, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';

export function StudentDashboard() {
  const [name, setName] = useState('')
  useEffect(() => {
    fetch('/api/student/me')
      .then((r) => (r.ok ? r.json() : Promise.resolve({ name: '' })))
      .then((d: { name?: string }) => setName(d.name || ''))
  }, [])
  const { nextLesson, overallProgress, notifications } = mockStudentData;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{name ? `Привет, ${name}!` : 'Привет!'}</h1>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>

      {/* Key Info Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Следующее занятие</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nextLesson.subject}</div>
            <p className="text-xs text-muted-foreground">
              {format(nextLesson.date, "eeee, d MMMM 'в' HH:mm", { locale: ru })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий прогресс</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Последние уведомления</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div key={notif.id} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {!notif.isRead && <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm ${!notif.isRead ? 'font-semibold' : ''}`}>{notif.text}</p>
                  <p className="text-xs text-muted-foreground">{notif.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Нет новых уведомлений.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
