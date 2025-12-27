"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const processSteps = [
    {
      id: "online",
      title: "Онлайн обучение",
      description: "Современные технологии позволяют проводить занятия дистанционно без потери качества. Использую интерактивные доски и материалы для максимальной эффективности.",
    },
    {
      id: "exam",
      title: "Подготовка к экзаменам",
      description: "Систематическая проработка всех тем ОГЭ, регулярные пробные тесты и разбор типовых заданий помогают ученикам чувствовать себя уверенно на экзамене.",
    },
    {
      id: "individual",
      title: "Индивидуальный подход",
      description: "Каждое занятие адаптировано под уровень и потребности конкретного ученика. Учитываю особенности восприятия и темп работы для максимального результата.",
    },
  ];

  return (
    <section id="process" className="container py-20 md:py-32 relative">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 pointer-events-none" />
      
      <div ref={ref} className="grid gap-12 md:grid-cols-2 items-center relative z-10">
        {/* Левая колонка - Текст */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              ПРОЦЕСС ОБУЧЕНИЯ
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Комфортные онлайн или очные уроки с индивидуальным подходом
            </motion.p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <AccordionItem value={step.id} className="border-border/50">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">
                    {step.description}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
        
        {/* Правая колонка - Иллюстрация */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative h-[500px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg blur-2xl" />
          <div className="relative h-full rounded-lg overflow-hidden border border-border/50 shadow-xl">
            <Image
              src="/image/S ykazkoy.png"
              alt="Процесс обучения"
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
