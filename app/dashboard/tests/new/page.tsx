// app/dashboard/tests/new/page.tsx
import { TestCreator } from '@/components/dashboard/TestCreator';

export default function NewTestPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-3xl font-bold">Конструктор тестов</h1>
        <p className="text-muted-foreground">
          Создайте новый тест, добавляя вопросы и настраивая параметры.
        </p>
      </div>
      <TestCreator />
    </div>
  );
}
