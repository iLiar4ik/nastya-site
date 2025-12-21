"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Lesson {
  id: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  teacher?: {
    name: string | null;
    email: string;
  };
  student?: {
    user: {
      name: string | null;
      email: string;
    };
  };
}

interface LessonListProps {
  lessons: Lesson[];
  title?: string;
}

const statusLabels = {
  scheduled: "Запланирован",
  completed: "Завершен",
  cancelled: "Отменен",
};

const statusColors = {
  scheduled: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export function LessonList({ lessons, title = "Уроки" }: LessonListProps) {
  const upcomingLessons = lessons.filter(
    (lesson) =>
      lesson.status === "scheduled" &&
      new Date(lesson.startTime) >= new Date()
  );
  const pastLessons = lessons.filter(
    (lesson) =>
      lesson.status === "completed" ||
      (lesson.status === "scheduled" && new Date(lesson.startTime) < new Date())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>

      {upcomingLessons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Предстоящие уроки</h3>
          <div className="space-y-4">
            {upcomingLessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {format(new Date(lesson.startTime), "EEEE, d MMMM yyyy", {
                          locale: ru,
                        })}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(lesson.startTime), "HH:mm")} -{" "}
                        {format(new Date(lesson.endTime), "HH:mm")}
                      </CardDescription>
                    </div>
                    <Badge
                      className={statusColors[lesson.status]}
                    >
                      {statusLabels[lesson.status]}
                    </Badge>
                  </div>
                </CardHeader>
                {lesson.notes && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{lesson.notes}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastLessons.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Прошедшие уроки</h3>
          <div className="space-y-4">
            {pastLessons.map((lesson) => (
              <Card key={lesson.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        {format(new Date(lesson.startTime), "EEEE, d MMMM yyyy", {
                          locale: ru,
                        })}
                      </CardTitle>
                      <CardDescription>
                        {format(new Date(lesson.startTime), "HH:mm")} -{" "}
                        {format(new Date(lesson.endTime), "HH:mm")}
                      </CardDescription>
                    </div>
                    <Badge
                      className={statusColors[lesson.status]}
                    >
                      {statusLabels[lesson.status]}
                    </Badge>
                  </div>
                </CardHeader>
                {lesson.notes && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{lesson.notes}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {lessons.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Нет запланированных уроков
          </CardContent>
        </Card>
      )}
    </div>
  );
}

