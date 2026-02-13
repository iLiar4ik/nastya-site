// app/student/materials/page.tsx
import { StudentMaterials } from '@/components/student/StudentMaterials';

export default function MaterialsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">📚 Мои материалы</h1>
      <StudentMaterials />
    </div>
  );
}
