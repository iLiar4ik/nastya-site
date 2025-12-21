"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CalendarView } from "@/components/schedule/CalendarView";
import { LessonModal } from "@/components/schedule/LessonModal";

interface Lesson {
  id: string;
  title: string;
  start: string;
  end: string;
  resource?: {
    id: string;
    studentId: string;
    status: string;
    notes?: string;
  };
}

interface Student {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function TeacherSchedulePage() {
  const { data: session } = useSession();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [lessonsRes, studentsRes] = await Promise.all([
        fetch("/api/lessons"),
        fetch("/api/students"),
      ]);

      const lessonsData = await lessonsRes.json();
      const studentsData = await studentsRes.json();

      const formattedLessons = lessonsData.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.student?.user?.name || lesson.student?.user?.email || "Урок",
        start: lesson.startTime,
        end: lesson.endTime,
        resource: {
          id: lesson.id,
          studentId: lesson.studentId,
          status: lesson.status,
          notes: lesson.notes,
        },
      }));

      setLessons(formattedLessons);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLesson = async (lessonData: any) => {
    try {
      const url = lessonData.id
        ? `/api/lessons/${lessonData.id}`
        : "/api/lessons";
      const method = lessonData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) {
        throw new Error("Failed to save lesson");
      }

      await fetchData();
    } catch (error) {
      console.error("Error saving lesson:", error);
      throw error;
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const handleNewLesson = () => {
    setSelectedLesson(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <CalendarView
        lessons={lessons}
        onSelectLesson={handleSelectLesson}
        onNewLesson={handleNewLesson}
      />
      <LessonModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lesson={selectedLesson}
        students={students}
        onSave={handleSaveLesson}
      />
    </div>
  );
}

