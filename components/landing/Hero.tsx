"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative container py-20 md:py-32 overflow-hidden">
      {/* Фон с формулами */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/image/primer.png"
          alt="Math formulas background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      
      <div className="relative grid gap-12 md:grid-cols-2 items-center">
        {/* Левая колонка - Текст */}
        <div className="flex flex-col gap-6 z-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            РЕПЕТИТОР ПО МАТЕМАТИКЕ
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            Подготовка к экзаменам, улучшение оценок, любовь к предмету.
          </p>
          
          {/* Формулы как декоративные элементы */}
          <div className="flex flex-wrap gap-4 text-muted-foreground/30 text-2xl font-mono mt-4">
            <span>f(x) = ∫a √(n²)</span>
            <span>dx/dt = 0</span>
            <span>lim x→∞</span>
          </div>
          
          <div className="mt-4">
            <p className="text-lg font-semibold">Анастасия</p>
            <p className="text-muted-foreground">Опыт более 10 лет</p>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button asChild size="lg">
              <Link href="#contacts">Связаться со мной</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#about">Узнать больше</Link>
            </Button>
          </div>
        </div>
        
        {/* Правая колонка - Фотография */}
        <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="/image/IMG_0959.JPG"
            alt="Репетитор по математике"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
