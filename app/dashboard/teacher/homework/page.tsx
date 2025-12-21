"use client";

import { useState, useEffect } from "react";
import { HomeworkManager } from "@/components/homework/HomeworkManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Download } from "lucide-react";

interface Homework {
  id: string;
  title: string;
  description?: string;
  filePath?: string;
  status: string;
  dueDate?: string;
  student: {
    user: {
      name: string | null;
      email: string;
    };
  };
}

export default function TeacherHomeworkPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [homeworksRes, studentsRes] = await Promise.all([
        fetch("/api/homework"),
        fetch("/api/students"),
      ]);

      const homeworksData = await homeworksRes.json();
      const studentsData = await studentsRes.json();

      setHomeworks(homeworksData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Домашние задания</h1>
          <p className="text-muted-foreground">
            Управление домашними заданиями
          </p>
        </div>
        <HomeworkManager students={students} onSave={fetchData} />
      </div>

      {homeworks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Нет домашних заданий
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {homeworks.map((homework) => (
            <Card key={homework.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{homework.title}</CardTitle>
                    <CardDescription>
                      Ученик: {homework.student.user.name || homework.student.user.email}
                    </CardDescription>
                  </div>
                  <Badge>{homework.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {homework.description && (
                  <p className="text-sm">{homework.description}</p>
                )}
                {homework.dueDate && (
                  <p className="text-sm text-muted-foreground">
                    Срок сдачи:{" "}
                    {format(new Date(homework.dueDate), "d MMMM yyyy, HH:mm", {
                      locale: ru,
                    })}
                  </p>
                )}
                {homework.filePath && (
                  <a
                    href={`/api/files/${homework.filePath}`}
                    download
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Download className="h-4 w-4" />
                    Скачать задание
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

