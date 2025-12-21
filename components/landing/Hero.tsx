"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container flex flex-col items-center justify-center gap-8 py-24 md:py-32">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Подготовка к ОГЭ по математике
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Индивидуальные занятия с опытным репетитором. Онлайн и оффлайн форматы.
          Гарантированная подготовка к успешной сдаче экзамена.
        </p>
        <div className="flex gap-4 mt-4">
          <Button size="lg" asChild>
            <Link href="#contacts">Записаться на пробный урок</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#about">Узнать больше</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

