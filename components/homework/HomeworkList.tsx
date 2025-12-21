"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Upload, FileText, Download } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Homework {
  id: string;
  title: string;
  description?: string;
  filePath?: string;
  status: "assigned" | "submitted" | "graded";
  dueDate?: Date;
  createdAt: Date;
  submissions?: Array<{
    id: string;
    filePath: string;
    submittedAt: Date;
    grade?: number;
    feedback?: string;
  }>;
}

interface HomeworkListProps {
  homeworks: Homework[];
  onRefresh: () => void;
}

const statusLabels = {
  assigned: "Задано",
  submitted: "Сдано",
  graded: "Проверено",
};

const statusColors = {
  assigned: "bg-yellow-500",
  submitted: "bg-blue-500",
  graded: "bg-green-500",
};

export function HomeworkList({ homeworks, onRefresh }: HomeworkListProps) {
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedHomework || !file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("homeworkId", selectedHomework.id);
      formData.append("file", file);

      const response = await fetch("/api/homework/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsUploadOpen(false);
        setFile(null);
        setSelectedHomework(null);
        onRefresh();
      }
    } catch (error) {
      console.error("Error uploading homework:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Домашние задания</h2>
      {homeworks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Нет домашних заданий
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {homeworks.map((homework) => (
            <Card key={homework.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{homework.title}</CardTitle>
                    <CardDescription>
                      {homework.description || "Без описания"}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[homework.status]}>
                    {statusLabels[homework.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {homework.dueDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Срок сдачи:{" "}
                      {format(new Date(homework.dueDate), "d MMMM yyyy, HH:mm", {
                        locale: ru,
                      })}
                    </p>
                  </div>
                )}
                {homework.filePath && (
                  <div>
                    <a
                      href={`/api/files/${homework.filePath}`}
                      download
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      Скачать задание
                    </a>
                  </div>
                )}
                {homework.status === "assigned" && (
                  <Button
                    onClick={() => {
                      setSelectedHomework(homework);
                      setIsUploadOpen(true);
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Загрузить решение
                  </Button>
                )}
                {homework.submissions && homework.submissions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Мои решения:</p>
                    {homework.submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">
                            {format(new Date(submission.submittedAt), "d MMM yyyy, HH:mm", {
                              locale: ru,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.grade && (
                            <Badge variant="outline">
                              Оценка: {submission.grade}
                            </Badge>
                          )}
                          <a
                            href={`/api/files/${submission.filePath}`}
                            download
                            className="text-sm text-primary hover:underline"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Загрузить решение</DialogTitle>
            <DialogDescription>
              Выберите файл с решением домашнего задания
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file">Файл</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadOpen(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
            >
              {isUploading ? "Загрузка..." : "Загрузить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

