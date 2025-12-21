"use client";

import { useState, useEffect } from "react";
import { FileManager } from "@/components/materials/FileManager";

export default function OGEMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [materialsRes, studentsRes] = await Promise.all([
        fetch("/api/oge/materials"),
        fetch("/api/students"),
      ]);

      const materialsData = await materialsRes.json();
      const studentsData = await studentsRes.json();

      setMaterials(materialsData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Материалы ОГЭ</h1>
        <p className="text-muted-foreground">
          Управление учебными материалами для подготовки к ОГЭ
        </p>
      </div>
      <FileManager
        materials={materials}
        students={students}
        isTeacher={true}
        onRefresh={fetchData}
      />
    </div>
  );
}

