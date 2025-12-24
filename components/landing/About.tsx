"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function About() {
  return (
    <section id="about" className="container py-20 md:py-32">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Обо мне
          </h2>
          <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
            Опытный репетитор по математике с многолетним стажем подготовки к ОГЭ
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Опыт работы</CardTitle>
              <CardDescription>
                Более 10 лет успешной подготовки учеников к экзаменам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                За годы работы помогла сотням учеников успешно сдать ОГЭ по математике
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Индивидуальный подход</CardTitle>
              <CardDescription>
                Каждое занятие адаптировано под уровень и потребности ученика
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Составляю индивидуальную программу подготовки для каждого ученика
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Гибкий график</CardTitle>
              <CardDescription>
                Онлайн и оффлайн занятия в удобное для вас время
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Возможность заниматься как очно, так и дистанционно
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
