// app/dashboard/students/page.tsx
import { StudentAnalytics } from '@/components/dashboard/StudentAnalytics';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ученики</h1>
          <p className="text-muted-foreground">
            Обзор прогресса и статистики ваших учеников.
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Добавить ученика
        </Button>
      </div>
      <StudentAnalytics />
    </div>
  );
}
