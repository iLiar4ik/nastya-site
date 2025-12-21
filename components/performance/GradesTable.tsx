"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Grade {
  id: string;
  topic: string;
  grade: number;
  maxGrade: number;
  date: Date;
  notes?: string;
}

interface GradesTableProps {
  grades: Grade[];
}

export function GradesTable({ grades }: GradesTableProps) {
  if (grades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Нет оценок
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>Тема</TableHead>
          <TableHead>Оценка</TableHead>
          <TableHead>Заметки</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {grades.map((grade) => (
          <TableRow key={grade.id}>
            <TableCell>
              {format(new Date(grade.date), "d MMM yyyy", { locale: ru })}
            </TableCell>
            <TableCell>{grade.topic}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {grade.grade} / {grade.maxGrade}
              </Badge>
            </TableCell>
            <TableCell className="max-w-md">
              {grade.notes || "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

