import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
  const plans = [
    {
      name: "Пробный урок",
      price: "Бесплатно",
      description: "Знакомство с форматом занятий",
      features: [
        "Одно занятие 60 минут",
        "Определение уровня знаний",
        "Составление плана обучения",
        "Консультация по подготовке",
      ],
    },
    {
      name: "Стандарт",
      price: "4000₽",
      period: "4 занятия/мес",
      description: "Базовый пакет для регулярной подготовки",
      features: [
        "4 занятия по 60 минут",
        "Домашние задания",
        "Проверка работ",
        "Материалы для подготовки",
        "Отчеты о прогрессе",
      ],
    },
    {
      name: "Интенсив",
      price: "7000₽",
      period: "8 занятий/мес",
      description: "Интенсивная подготовка к экзамену",
      features: [
        "8 занятий по 60 минут",
        "Приоритетная проверка ДЗ",
        "Дополнительные материалы",
        "Пробные тесты ОГЭ",
        "Еженедельные отчеты",
        "Поддержка между занятиями",
      ],
    },
  ];

  return (
    <section id="pricing" className="container py-24 md:py-32">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Тарифы
        </h2>
        <p className="max-w-[700px] text-muted-foreground text-lg">
          Выберите подходящий для вас пакет занятий
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground"> / {plan.period}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="#contacts">Записаться</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

