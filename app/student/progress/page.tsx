// app/student/progress/page.tsx
import { ProgressTracker } from '@/components/student/ProgressTracker';

export default function ProgressPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">📊 Мой прогресс</h1>
      <ProgressTracker />
    </div>
  );
}
