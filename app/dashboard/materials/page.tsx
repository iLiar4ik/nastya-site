// app/dashboard/materials/page.tsx
import { MaterialsLibrary } from '@/components/dashboard/MaterialsLibrary';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';

export default function MaterialsPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📚 Библиотека материалов</h1>
          <p className="text-muted-foreground">
            Управляйте вашими учебными материалами, домашними заданиями и тестами.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
              <PlusCircle className="h-4 w-4 mr-2" />
              Создать тему
            </Button>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Загрузить файл
            </Button>
        </div>
      </div>
      <MaterialsLibrary />
    </div>
  );
}
