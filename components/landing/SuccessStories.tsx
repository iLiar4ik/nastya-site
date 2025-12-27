"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function SuccessStories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
    <section id="success" className="container py-20 md:py-32 bg-gradient-to-br from-muted/50 via-accent/10 to-secondary/20 relative overflow-hidden">
      {/* Декоративный фон с изображением */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <Image
            src="/image/65ebeca794ca41b28ab65f645b462427_db16d198-e181-48df-a825-8b63c9408152 (1).png"
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </div>

      <div ref={ref} className="grid gap-12 md:grid-cols-2 relative z-10">
        {/* Левая колонка */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              МОИ УЧЕНИКИ: ИСТОРИИ УСПЕХА
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                За годы работы я имела честь работать с множеством талантливых учеников, каждый из которых 
                прошел свой уникальный путь к успеху. Моя цель — не просто подготовить к экзамену, а помочь 
                ученикам обрести уверенность в своих силах.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Многие мои ученики не только успешно сдают ОГЭ, но и продолжают изучать математику на более 
                глубоком уровне, поступая в профильные классы и вузы. Их успехи — это мой главный результат.
              </motion.p>
            </div>
          </div>
          
          {/* Иллюстрация */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[300px] mt-4 rounded-lg overflow-hidden border border-border/50 shadow-lg"
          >
            <Image
              src="/image/65ebeca794ca41b28ab65f645b462427_db16d198-e181-48df-a825-8b63c9408152 (1).png"
              alt="Истории успеха"
              fill
              className="object-contain hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </motion.div>
        
        {/* Правая колонка - Отзывы */}
        <div className="flex flex-col gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xl">★</span>
                    ))}
                    <Badge variant="secondary" className="ml-auto">
                      {testimonial.rating}.0
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 group-hover:text-foreground transition-colors">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm font-medium">Экзамен:</span>
                    <Badge className="text-lg font-bold bg-primary text-primary-foreground">
                      {testimonial.examScore} баллов
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

