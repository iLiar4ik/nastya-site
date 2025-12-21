import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

interface StudentCardProps {
  student: {
    id: string;
    user: {
      name: string | null;
      email: string;
    };
    phone?: string | null;
    telegram?: string | null;
  };
}

export function StudentCard({ student }: StudentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {student.user.name || student.user.email}
        </CardTitle>
        <CardDescription>
          {student.user.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {student.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${student.phone}`} className="hover:underline">
              {student.phone}
            </a>
          </div>
        )}
        {student.telegram && (
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <a
              href={`https://t.me/${student.telegram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {student.telegram}
            </a>
          </div>
        )}
        <Button asChild className="w-full">
          <Link href={`/dashboard/teacher/students/${student.id}`}>
            Подробнее
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

