"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative container py-20 md:py-32 overflow-hidden">
      {/* Градиентный фон с использованием палитры */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-secondary/10 pointer-events-none" />
      
      {/* Декоративные элементы */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      
      <div className="relative grid gap-12 md:grid-cols-2 items-center">
        {/* Левая колонка - Текст */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
          >
            РЕПЕТИТОР ПО МАТЕМАТИКЕ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-muted-foreground sm:text-2xl"
          >
            Подготовка к экзаменам, улучшение оценок, любовь к предмету.
          </motion.p>
          
          {/* Формулы как декоративные элементы */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 text-muted-foreground/30 text-2xl font-mono mt-4"
          >
            <span>f(x) = ∫a √(n²)</span>
            <span>dx/dt = 0</span>
            <span>lim x→∞</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 flex items-center gap-4"
          >
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src="/image/main.png" alt="Анастасия" />
              <AvatarFallback>АН</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">Анастасия</p>
              <p className="text-muted-foreground">Опыт более 10 лет</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-4 mt-6"
          >
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="#contacts">Связаться со мной</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover:bg-accent/10 transition-colors">
              <Link href="#about">Узнать больше</Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Правая колонка - Фотография */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-2xl group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent z-10" />
          <Image
            src="/image/main.png"
            alt="Репетитор по математике"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </div>
    </section>
  );
}
