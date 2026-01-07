"use client";

import { Button } from "@/components/ui/button";
import { BackgroundCircles } from "@/components/ui/background-circles";
import { SectionDivider } from "@/components/ui/section-divider";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative container py-20 md:py-32 overflow-hidden min-h-screen flex flex-col">
      {/* Фоновое изображение */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 flex items-center justify-end pr-0 md:pr-20 z-10">
          {/* Анимированные круги за изображением - точно под моделью */}
          <div className="relative w-full md:w-3/5 h-full max-w-2xl">
            <BackgroundCircles variant="primary" className="absolute inset-0 z-0" />
            <div className="relative w-full h-full z-10">
              <Image
                src="/image/main.png"
                alt="Репетитор по математике"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
        {/* Overlay для читаемости текста - затемняет только левую часть, правая остается прозрачной */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/25 to-background/0 z-20" />
      </div>
      
      <div className="relative z-10 grid gap-12 md:grid-cols-2 items-center flex-1 justify-center pb-20 md:pb-32">
        {/* Левая колонка - Текст */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent drop-shadow-lg"
          >
            РЕПЕТИТОР ПО МАТЕМАТИКЕ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-foreground sm:text-2xl font-medium drop-shadow-lg"
          >
            Подготовка к экзаменам, улучшение оценок, любовь к предмету.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 mt-6"
          >
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="#contacts">Связаться со мной</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:bg-accent/10 transition-colors bg-background/80 backdrop-blur-sm">
              <Link href="#about">Узнать больше</Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Правая колонка - пустая для баланса или можно оставить пустой */}
        <div className="hidden md:block" />
      </div>
      
      {/* Разделитель */}
      <SectionDivider />
    </section>
  );
}
