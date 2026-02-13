// app/student/homework/page.tsx
import { StudentHomework } from '@/components/student/StudentHomework';

export default function HomeworkPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">📝 Мои домашние задания</h1>
      <StudentHomework />
    </div>
  );
}
