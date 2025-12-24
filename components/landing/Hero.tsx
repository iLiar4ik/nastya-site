"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="container py-20 md:py-32">
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          Подготовка к ОГЭ по математике
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Профессиональная подготовка к экзамену с индивидуальным подходом к каждому ученику.
          Онлайн и оффлайн занятия.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="#contacts">Связаться со мной</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#about">Узнать больше</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
