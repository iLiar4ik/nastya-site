// app/dashboard/tests/page.tsx
import { tests } from '@/lib/mock-data/tests';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Clock, Percent } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function TestsPage() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🧪 Тесты</h1>
          <p className="text-muted-foreground">
            Создание, управление и назначение тестов ученикам.
          </p>
        </div>
        <Button asChild>
            <Link href="/dashboard/tests/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                Создать тест
            </Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tests.map(test => (
            <Card key={test.id} className="flex flex-col">
                <CardHeader>
                    <CardTitle>{test.title}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center"><FileText className="w-4 h-4 mr-1"/> Вопросов</span>
                        <span>{test.questions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> Время</span>
                        <span>{test.timeLimitMinutes > 0 ? `${test.timeLimitMinutes} мин` : 'Нет'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center"><Percent className="w-4 h-4 mr-1"/> Проходной балл</span>
                        <span>{test.passThreshold}%</span>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline">{test.subject}</Badge>
                        <Badge variant="secondary">{test.topic}</Badge>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
