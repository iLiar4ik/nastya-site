"use client";

import { useState, useEffect } from "react";
import { FileManager } from "@/components/materials/FileManager";

export default function StudentOGEMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/oge/materials/student");
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
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
          Учебные материалы для подготовки к ОГЭ
        </p>
      </div>
      <FileManager
        materials={materials}
        isTeacher={false}
        onRefresh={fetchData}
      />
    </div>
  );
}

