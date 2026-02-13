// components/dashboard/StudentAnalytics.tsx
"use client";

import { students } from '@/lib/mock-data/students';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function StudentAnalytics() {
  return (
    <div className="grid gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {students.map((student) => (
        <Card key={student.id}>
          <CardHeader className="flex flex-col items-center text-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={student.avatarUrl} alt={student.name} />
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>{student.class}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Посещаемость</span>
              <span className="font-semibold">{student.attendance}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Средний балл</span>
              <span className="font-semibold">{student.avgTestScore}/10</span>
            </div>
            
            <div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Прогресс курса</span>
                <span className="font-semibold">{student.courseProgress}%</span>
              </div>
              <Progress value={student.courseProgress} aria-label={`${student.courseProgress}% course progress`} />
            </div>

            <div className="flex flex-wrap gap-1">
              {student.subjects.map(subject => (
                <Badge key={subject} variant="secondary">{subject}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
                <Link href={`/dashboard/students/${student.id}`}>Смотреть профиль</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
