import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, FileText, CheckCircle, Clock } from "lucide-react"

export default function LessonsPage() {
  const steps = [
    {
      title: "Знакомство и диагностика",
      description: "На первом занятии определяем текущий уровень знаний и ставим цели обучения"
    },
    {
      title: "Составление плана",
      description: "Разрабатываем индивидуальный план занятий с учетом ваших потребностей"
    },
    {
      title: "Регулярные занятия",
      description: "Проводим занятия по расписанию, разбираем материал и закрепляем знания"
    },
    {
      title: "Контроль прогресса",
      description: "Регулярно отслеживаем успехи и корректируем план при необходимости"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Как проходят занятия</h1>
        <p className="text-xl text-muted-foreground mb-12 text-center">
          Узнайте больше о формате и структуре наших занятий
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Video className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Формат занятий</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Занятия проводятся онлайн через видеосвязь. Это удобно, 
                безопасно и эффективно. Все материалы доступны в личном кабинете.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Длительность</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Стандартное занятие длится 60-90 минут в зависимости от тарифа. 
                Этого времени достаточно для качественного разбора материала.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Материалы</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Все необходимые материалы, домашние задания и дополнительные 
                ресурсы предоставляются в электронном виде.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Обратная связь</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Регулярная обратная связь для родителей о прогрессе ученика 
                и рекомендации по дальнейшему обучению.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Этапы работы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

