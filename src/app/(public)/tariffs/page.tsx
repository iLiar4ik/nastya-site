import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function TariffsPage() {
  const tariffs = [
    {
      title: "Базовый",
      price: "1500",
      period: "за занятие",
      features: [
        "Индивидуальное занятие 60 минут",
        "Разбор домашних заданий",
        "Подготовка к контрольным",
        "Обратная связь родителям"
      ]
    },
    {
      title: "Стандартный",
      price: "2000",
      period: "за занятие",
      features: [
        "Индивидуальное занятие 90 минут",
        "Разбор домашних заданий",
        "Подготовка к контрольным",
        "Дополнительные материалы",
        "Обратная связь родителям",
        "Промежуточные тесты"
      ]
    },
    {
      title: "Премиум",
      price: "2500",
      period: "за занятие",
      features: [
        "Индивидуальное занятие 90 минут",
        "Разбор домашних заданий",
        "Подготовка к контрольным",
        "Дополнительные материалы",
        "Обратная связь родителям",
        "Промежуточные тесты",
        "Подготовка к ОГЭ",
        "Пробные экзамены",
        "Персональный план обучения"
      ]
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Тарифы</h1>
        <p className="text-xl text-muted-foreground">
          Выберите подходящий тариф для ваших целей
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tariffs.map((tariff, index) => (
          <Card key={index} className={index === 1 ? "border-primary border-2" : ""}>
            <CardHeader>
              <CardTitle className="text-2xl">{tariff.title}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{tariff.price} ₽</span>
                <span className="text-muted-foreground ml-2">{tariff.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tariff.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

