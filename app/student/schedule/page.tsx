// app/student/schedule/page.tsx
import { StudentSchedule } from '@/components/student/StudentSchedule';

export default function SchedulePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">📅 Моё расписание</h1>
      <StudentSchedule />
    </div>
  );
}
