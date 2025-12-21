import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Репетитор по математике
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Профессиональная подготовка к ОГЭ и повышение успеваемости
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/tariffs">
            <Button size="lg">Узнать тарифы</Button>
          </Link>
          <Link href="/contacts">
            <Button variant="outline" size="lg">Связаться со мной</Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Индивидуальный подход</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Каждое занятие адаптировано под уровень и потребности ученика
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Опыт работы</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Многолетний опыт подготовки учеников к экзаменам
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Award className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Высокие результаты</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Ученики успешно сдают ОГЭ и улучшают оценки в школе
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>Гибкий график</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Удобное расписание занятий, адаптированное под вас
            </CardDescription>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

