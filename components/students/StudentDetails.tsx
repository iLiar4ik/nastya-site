import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MessageSquare, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StudentDetailsProps {
  student: {
    id: string;
    user: {
      name: string | null;
      email: string;
    };
    phone?: string | null;
    telegram?: string | null;
    parentName?: string | null;
    parentPhone?: string | null;
    createdAt: Date;
  };
}

export function StudentDetails({ student }: StudentDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {student.user.name || student.user.email}
          </h1>
          <p className="text-muted-foreground">Информация об ученике</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/teacher/students">Назад к списку</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Имя</p>
              <p className="text-lg">{student.user.name || "Не указано"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </p>
              <a
                href={`mailto:${student.user.email}`}
                className="text-lg hover:underline"
              >
                {student.user.email}
              </a>
            </div>
            {student.phone && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Телефон
                  </p>
                  <a
                    href={`tel:${student.phone}`}
                    className="text-lg hover:underline"
                  >
                    {student.phone}
                  </a>
                </div>
              </>
            )}
            {student.telegram && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Telegram
                  </p>
                  <a
                    href={`https://t.me/${student.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg hover:underline"
                  >
                    {student.telegram}
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Контакты родителей
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.parentName ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Имя родителя
                  </p>
                  <p className="text-lg">{student.parentName}</p>
                </div>
                {student.parentPhone && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Телефон родителя
                      </p>
                      <a
                        href={`tel:${student.parentPhone}`}
                        className="text-lg hover:underline"
                      >
                        {student.parentPhone}
                      </a>
                    </div>
                  </>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">
                Информация о родителях не указана
              </p>
            )}
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Дата регистрации
              </p>
              <p className="text-lg">
                {new Date(student.createdAt).toLocaleDateString("ru-RU")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

