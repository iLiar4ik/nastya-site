"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="container py-20 md:py-32">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Тарифы
          </h2>
          <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
            Выберите подходящий вариант занятий
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Индивидуальное занятие</CardTitle>
              <CardDescription>Одно занятие</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1500₽</div>
              <p className="text-sm text-muted-foreground mt-2">
                Разовое занятие продолжительностью 60-90 минут
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="#contacts">Записаться</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Абонемент (4 занятия)</CardTitle>
              <CardDescription>Популярный вариант</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5500₽</div>
              <p className="text-sm text-muted-foreground mt-2">
                Экономия 500₽ при покупке абонемента
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="#contacts">Записаться</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Абонемент (8 занятий)</CardTitle>
              <CardDescription>Максимальная выгода</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">10000₽</div>
              <p className="text-sm text-muted-foreground mt-2">
                Экономия 2000₽ при покупке абонемента
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="#contacts">Записаться</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
