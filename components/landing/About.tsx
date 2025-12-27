"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="container py-20 md:py-32 relative">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div ref={ref} className="grid gap-12 md:grid-cols-2 items-center relative z-10">
        {/* Левая колонка - Иллюстрация */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="relative h-[400px] md:h-[500px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg blur-2xl" />
          <div className="relative h-full rounded-lg overflow-hidden shadow-xl border border-border/50">
            <Image
              src="/image/09321c3e0fe3b765ede62305f0a326cf_1f08550a-a75b-4810-b945-2274129aa05f.png"
              alt="О преподавателе"
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
        
        {/* Правая колонка - Текст */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            ОБО МНЕ
          </h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Меня зовут Анастасия, и я профессиональный репетитор по математике с более чем 10-летним опытом работы. 
              За эти годы я помогла сотням учеников не только успешно сдать экзамены, но и полюбить математику.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Моя методика обучения основана на индивидуальном подходе к каждому ученику. Я тщательно анализирую 
              текущий уровень знаний, выявляю пробелы и строю персональную программу подготовки, которая учитывает 
              особенности восприятия и темп работы каждого студента.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Я специализируюсь на подготовке к ОГЭ по математике, помогаю улучшить оценки в школе и привить 
              настоящую любовь к предмету. Мои ученики не просто заучивают формулы, а понимают логику и красоту 
              математических решений.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Провожу занятия как онлайн, так и оффлайн, что позволяет найти удобный формат для каждого ученика. 
              Гибкий график занятий помогает совмещать обучение с другими важными делами.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
