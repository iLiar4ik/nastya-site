"use client";

import { useState, useEffect } from "react";
import { HomeworkList } from "@/components/homework/HomeworkList";

export default function StudentHomeworkPage() {
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/homework/student");
      const data = await response.json();
      setHomeworks(data);
    } catch (error) {
      console.error("Error fetching homework:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return <HomeworkList homeworks={homeworks} onRefresh={fetchData} />;
}


