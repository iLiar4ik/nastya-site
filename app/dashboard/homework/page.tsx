// app/dashboard/homework/page.tsx
import { HomeworkManager } from '@/components/dashboard/HomeworkManager';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function HomeworkPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📝 Управление ДЗ</h1>
          <p className="text-muted-foreground">
            Создание, проверка и отслеживание статуса домашних заданий.
          </p>
        </div>
      </div>
      <HomeworkManager />
    </div>
  );
}
