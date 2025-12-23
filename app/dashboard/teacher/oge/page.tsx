import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileText, BarChart3 } from "lucide-react";

export default function OGEPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ОГЭ</h1>
        <p className="text-muted-foreground">
          Управление материалами и статистикой ОГЭ
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Материалы ОГЭ
            </CardTitle>
            <CardDescription>
              Загрузка и управление учебными материалами для подготовки к ОГЭ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/teacher/oge/materials">
                Перейти к материалам
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Статистика пробников
            </CardTitle>
            <CardDescription>
              Просмотр результатов пробных тестов ОГЭ по всем ученикам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/teacher/oge/statistics">
                Перейти к статистике
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


