"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function SuccessStories() {
  const testimonials = [
    {
      id: 1,
      text: "Благодаря занятиям с Анастасией я успешно сдал ОГЭ на высокий балл. Объясняет очень понятно и доступно!",
      rating: 5,
      examScore: 170,
    },
    {
      id: 2,
      text: "Математика всегда была сложным предметом для меня, но с помощью индивидуального подхода я значительно улучшила оценки.",
      rating: 5,
      examScore: 165,
    },
    {
      id: 3,
      text: "Занимаюсь уже год, и результаты превзошли все ожидания. Рекомендую всем, кто хочет действительно понять математику!",
      rating: 5,
      examScore: 172,
    },
  ];

  return (
    <section id="success" className="container py-20 md:py-32 bg-muted/50">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Левая колонка */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              МОИ УЧЕНИКИ: ИСТОРИИ УСПЕХА
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                За годы работы я имела честь работать с множеством талантливых учеников, каждый из которых 
                прошел свой уникальный путь к успеху. Моя цель — не просто подготовить к экзамену, а помочь 
                ученикам обрести уверенность в своих силах.
              </p>
              <p>
                Многие мои ученики не только успешно сдают ОГЭ, но и продолжают изучать математику на более 
                глубоком уровне, поступая в профильные классы и вузы. Их успехи — это мой главный результат.
              </p>
            </div>
          </div>
          
          {/* Иллюстрация */}
          <div className="relative h-[300px] mt-4">
            <Image
              src="/image/65ebeca794ca41b28ab65f645b462427_db16d198-e181-48df-a825-8b63c9408152 (1).png"
              alt="Истории успеха"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        
        {/* Правая колонка - Отзывы */}
        <div className="flex flex-col gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-xl">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{testimonial.text}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium">Экзамен:</span>
                  <span className="text-lg font-bold text-primary">{testimonial.examScore} баллов</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

