// components/student/ProgressTracker.tsx
"use client";

import { mockStudentData } from '@/lib/mock-data/student-view';
import { students } from '@/lib/mock-data/students';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Line, ComposedChart } from 'recharts';
import { Award, Star, Target } from 'lucide-react';

// Find the full student object to get detailed history
const student = students.find(s => s.name === mockStudentData.name);

const achievements = [
    { icon: <Target className="h-6 w-6" />, title: "10 занятий подряд", achieved: true },
    { icon: <Star className="h-6 w-6" />, title: "Отличник (средний балл 9+)", achieved: student && student.avgTestScore > 9 },
    { icon: <Award className="h-6 w-6" />, title: "Старательный (все ДЗ вовремя)", achieved: true },
];

export function ProgressTracker() {
  if (!student) {
    return <p>Не удалось загрузить данные о прогрессе.</p>;
  }

  const chartData = student.testHistory.map(t => ({ name: t.topic, 'Оценка': t.score }));

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Общий прогресс по курсу</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
            <div className="text-5xl font-bold text-primary">{student.courseProgress}%</div>
            <Progress value={student.courseProgress} />
        </CardContent>
      </Card>

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
        
        {/* Test scores chart */}
        <Card>
            <CardHeader>
                <CardTitle>График оценок по тестам</CardTitle>
                <CardDescription>Динамика за последние {student.testHistory.length} тестов.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <ComposedChart data={chartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]}/>
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="Оценка" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
            <CardTitle>Достижения и награды</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {achievements.map(ach => (
                <div key={ach.title} className={`p-4 rounded-lg flex items-center gap-4 border-2 ${ach.achieved ? 'border-yellow-400 bg-yellow-50 text-yellow-900' : 'border-dashed bg-muted/50 text-muted-foreground'}`}>
                    <div className={ach.achieved ? 'text-yellow-500' : ''}>{ach.icon}</div>
                    <p className="font-semibold">{ach.title}</p>
                </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
