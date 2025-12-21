"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Download, Trash2, FileText } from "lucide-react";

interface Material {
  id: string;
  title: string;
  description?: string;
  filePath: string;
  type?: string;
  isOGE: boolean;
  createdAt: Date;
  student?: {
    user: {
      name: string | null;
      email: string;
    };
  } | null;
}

interface FileManagerProps {
  materials: Material[];
  students?: Array<{ id: string; user: { name: string | null; email: string } }>;
  isTeacher?: boolean;
  onRefresh: () => void;
}

export function FileManager({
  materials,
  students,
  isTeacher = false,
  onRefresh,
}: FileManagerProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    title: "",
    description: "",
    type: "",
    isOGE: false,
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      if (formData.studentId) {
        formDataToSend.append("studentId", formData.studentId);
      }
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("isOGE", formData.isOGE.toString());
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      const response = await fetch("/api/materials", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setIsUploadOpen(false);
        setFormData({
          studentId: "",
          title: "",
          description: "",
          type: "",
          isOGE: false,
          file: null,
        });
        onRefresh();
      }
    } catch (error) {
      console.error("Error uploading material:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот материал?")) return;

    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Материалы</h2>
        {isTeacher && (
          <Button onClick={() => setIsUploadOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Загрузить материал
          </Button>
        )}
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Нет материалов
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <Card key={material.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {material.title}
                </CardTitle>
                <CardDescription>
                  {material.description || "Без описания"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {material.type && (
                  <p className="text-sm text-muted-foreground">
                    Тип: {material.type}
                  </p>
                )}
                {material.isOGE && (
                  <span className="inline-block px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                    ОГЭ
                  </span>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a href={`/api/files/${material.filePath}`} download>
                      <Download className="mr-2 h-4 w-4" />
                      Скачать
                    </a>
                  </Button>
                  {isTeacher && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isTeacher && (
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Загрузить материал</DialogTitle>
              <DialogDescription>
                Заполните информацию о материале
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {students && students.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="student">Ученик (опционально)</Label>
                  <Select
                    value={formData.studentId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, studentId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Общий материал" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Общий материал</SelectItem>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.user.name || student.user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Тип</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  placeholder="Например: Презентация, PDF, Видео"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOGE"
                  checked={formData.isOGE}
                  onChange={(e) =>
                    setFormData({ ...formData, isOGE: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="isOGE">Материал для ОГЭ</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Файл</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      file: e.target.files?.[0] || null,
                    })
                  }
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
              <Button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? "Загрузка..." : "Загрузить"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

