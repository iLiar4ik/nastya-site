"use client";

import { useState, useMemo } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ru";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

moment.locale("ru");
const localizer = momentLocalizer(moment);

interface Lesson {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  resource?: {
    id: string;
    studentId: string;
    status: string;
    notes?: string;
  };
}

interface CalendarViewProps {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
  onNewLesson: () => void;
}

export function CalendarView({
  lessons,
  onSelectLesson,
  onNewLesson,
}: CalendarViewProps) {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {
    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      start: new Date(lesson.start),
      end: new Date(lesson.end),
      resource: lesson.resource,
    }));
  }, [lessons]);

  const eventStyleGetter = (event: any) => {
    const status = event.resource?.status;
    let backgroundColor = "#3174ad";
    if (status === "completed") backgroundColor = "#28a745";
    if (status === "cancelled") backgroundColor = "#dc3545";

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const handleSelectEvent = (event: any) => {
    // Find original lesson to preserve string dates
    const originalLesson = lessons.find((l) => l.id === event.id);
    if (originalLesson) {
      onSelectLesson(originalLesson);
    }
  };

  return (
    <div className="h-[600px]">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Расписание</h2>
        <Button onClick={onNewLesson}>
          <Plus className="mr-2 h-4 w-4" />
          Новый урок
        </Button>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        messages={{
          next: "Вперед",
          previous: "Назад",
          today: "Сегодня",
          month: "Месяц",
          week: "Неделя",
          day: "День",
          agenda: "Повестка",
        }}
      />
    </div>
  );
}

