import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Process() {
  return (
    <section id="process" className="container py-24 md:py-32">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Как проходят занятия
        </h2>
        <p className="max-w-[700px] text-muted-foreground text-lg">
          Современный подход к обучению с использованием интерактивных инструментов
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Формат занятий</CardTitle>
            <CardDescription>
              Онлайн и оффлайн
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Занятия проводятся онлайн через Zoom или оффлайн по договоренности. 
              Выбирайте удобный для вас формат обучения.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Длительность</CardTitle>
            <CardDescription>
              60-90 минут
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Стандартная длительность занятия 60 минут. Для интенсивной подготовки 
              возможны занятия по 90 минут.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Инструменты</CardTitle>
            <CardDescription>
              Интерактивная доска
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Использую интерактивную доску, Zoom для видеосвязи, цифровые материалы 
              и презентации для максимальной эффективности обучения.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Индивидуальный подход</CardTitle>
            <CardDescription>
              Персональная программа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Для каждого ученика составляется индивидуальная программа обучения 
              с учетом его уровня знаний и целей.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Домашние задания</CardTitle>
            <CardDescription>
              Регулярная практика
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              После каждого занятия выдаются домашние задания для закрепления материала. 
              Все задания проверяются и разбираются на следующем уроке.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Отслеживание прогресса</CardTitle>
            <CardDescription>
              Регулярные отчеты
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ведется постоянный мониторинг успеваемости ученика. Родители получают 
              регулярные отчеты о прогрессе обучения.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

