"use client";

import { useState, useEffect } from "react";
import { FileManager } from "@/components/materials/FileManager";

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/materials/student");
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
    <FileManager
      materials={materials}
      isTeacher={false}
      onRefresh={fetchData}
    />
  );
}

