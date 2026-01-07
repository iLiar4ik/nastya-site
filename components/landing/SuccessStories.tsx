"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SectionDivider } from "@/components/ui/section-divider";

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
    {
      id: 4,
      text: "Отличный преподаватель! Занятия проходят интересно, материал объясняется на примерах из жизни. Теперь математика стала моим любимым предметом.",
      rating: 5,
      examScore: 168,
    },
  ];

  return (
    <section id="success" className="container bg-gradient-to-br from-muted/50 via-accent/10 to-secondary/20 relative overflow-visible min-h-screen flex flex-col py-20 md:py-32">
      <div ref={ref} className="grid gap-8 md:gap-12 md:grid-cols-3 relative z-10 flex-1 justify-center pb-20 md:pb-32">
        {/* Левая колонка - Текст */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 pl-4 md:pl-8 pt-8 md:pt-12"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              МОИ УЧЕНИКИ: ИСТОРИИ УСПЕХА
            </h2>
            <div className="space-y-4 text-sm md:text-sm lg:text-base xl:text-lg text-muted-foreground">
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
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Каждый отзыв — это история реального человека, который поверил в себя и достиг поставленных целей. 
                Я горжусь тем, что могу быть частью этого пути и помогать ученикам раскрывать их потенциал.
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        {/* Средняя колонка - Модель девушки */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative h-[700px] md:h-[800px] flex items-end justify-center overflow-visible"
        >
          <div className="relative w-full h-full overflow-visible">
            {/* Изображение колпаков сверху */}
            <div className="absolute left-0 w-full h-1/3 z-0">
              <Image
                src="/image/colpacs.png"
                alt=""
                fill
                className="object-contain object-top"
                style={{ 
                  transform: 'scale(1.5)',
                  top: '16px',
                  left: '50px',
                  zIndex: 0
                }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            {/* Модель девушки */}
            <Image
              src="/image/yahoo.png"
              alt="Истории успеха"
              fill
              className="object-contain"
              style={{ 
                objectPosition: 'center bottom', 
                transform: 'scale(0.6)',
                transformOrigin: 'center bottom'
              }}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </motion.div>
        
        {/* Правая колонка - Отзывы (сгруппированы, выровнены по верху) */}
        <div className="flex flex-col gap-3 pr-4 md:pr-8 pt-8 md:pt-12 relative z-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:border-primary/50 cursor-pointer group bg-card/70 backdrop-blur-sm">
                <CardContent className="pt-2.5 pb-2.5 px-3 flex flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-sm">★</span>
                    ))}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {testimonial.rating}.0
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5 group-hover:text-foreground transition-colors">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t">
                    <span className="text-xs font-medium">Экзамен:</span>
                    <Badge className="text-xs font-bold bg-primary text-primary-foreground">
                      {testimonial.examScore} баллов
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Разделитель */}
      <SectionDivider />
    </section>
  );
}

