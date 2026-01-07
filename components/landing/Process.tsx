"use client";

import Image from "next/image";
import { ShineBorder } from "@/components/ui/shine-border";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SectionDivider } from "@/components/ui/section-divider";
import { Card, CardContent } from "@/components/ui/card";

export function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const onlineTools = [
    {
      icon: "💻",
      title: "Видеосвязь",
      description: "Zoom, Skype или другие платформы для живого общения",
    },
    {
      icon: "📝",
      title: "Интерактивная доска",
      description: "Miro, Jamboard для совместной работы над задачами",
    },
    {
      icon: "📚",
      title: "Учебные материалы",
      description: "Электронные учебники, презентации, тесты",
    },
    {
      icon: "📱",
      title: "Мессенджеры",
      description: "Telegram для связи и отправки домашних заданий",
    },
  ];

  const learningSteps = [
    {
      step: "1",
      title: "Подключение",
      description: "Ученик подключается к видеоконференции",
    },
    {
      step: "2",
      title: "Занятие",
      description: "Работа на интерактивной доске, решение задач",
    },
    {
      step: "3",
      title: "Домашнее задание",
      description: "Получение и отправка заданий через мессенджер",
    },
    {
      step: "4",
      title: "Проверка",
      description: "Разбор выполненных заданий на следующем занятии",
    },
  ];

  return (
    <section id="process" className="container py-16 md:py-24 relative flex flex-col">
      {/* Декоративный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 pointer-events-none" />
      
      <div ref={ref} className="grid gap-8 md:gap-12 md:grid-cols-[3fr_2fr] items-start relative z-10 pb-16 md:pb-24">
        {/* Левая колонка - Текст */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <ShineBorder
            borderRadius={6}
            borderWidth={4}
            duration={14}
            color={[
              "hsl(var(--primary))",
              "hsl(var(--secondary))",
              "hsl(var(--accent))",
              "hsl(var(--secondary))",
              "hsl(var(--primary))"
            ]}
            className="bg-card p-0"
          >
            <div className="flex flex-col gap-6 relative z-10 p-5 md:p-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
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
              
              {/* Схема онлайн обучения */}
              <div className="space-y-5 relative z-10">
                {/* Инструменты */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Используемые инструменты</h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {onlineTools.map((tool, index) => (
                      <motion.div
                        key={tool.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      >
                        <Card className="hover:border-primary/50 transition-colors h-full">
                          <CardContent className="p-3 md:p-4">
                            <div className="text-2xl md:text-3xl mb-1 md:mb-2">{tool.icon}</div>
                            <h4 className="font-semibold text-xs md:text-sm mb-0.5 md:mb-1">{tool.title}</h4>
                            <p className="text-xs text-muted-foreground leading-tight">{tool.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Процесс обучения */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3">Как происходит обучение</h3>
                  <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 items-start">
                      {learningSteps.map((step, index) => (
                        <div key={step.step} className="relative flex flex-col items-center">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                            className="flex flex-col items-center w-full relative"
                          >
                            {/* Соединительная линия между этапами (только для десктопа) */}
                            {index < learningSteps.length - 1 && (
                              <div className="hidden sm:block absolute left-full top-6 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20 z-0" style={{ width: 'calc(100% - 1rem)' }} />
                            )}
                            {/* Вертикальная линия для мобильных */}
                            {index < learningSteps.length - 1 && (
                              <div className="block sm:hidden absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b from-primary/60 to-primary/20 z-0" />
                            )}
                            
                            <div className="relative flex-shrink-0 mb-2 sm:mb-3 z-10">
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-base md:text-lg shadow-lg">
                                {step.step}
                              </div>
                            </div>
                            <div className="text-center flex-1 px-1">
                              <h4 className="font-semibold text-sm md:text-base text-foreground mb-1">{step.title}</h4>
                              <p className="text-xs md:text-sm text-muted-foreground leading-tight">{step.description}</p>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ShineBorder>
        </motion.div>
        
        {/* Правая колонка - Иллюстрация */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative h-full mt-8 md:mt-12 z-50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg blur-2xl" />
          <div className="relative h-full rounded-lg overflow-visible flex items-center justify-start ml-1 z-50">
            {/* Размытый фон - изображение класса */}
            <Image
              src="/image/class.png"
              alt=""
              fill
              className="object-cover blur-3xl opacity-40 z-0"
              style={{ 
                zIndex: 0
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Основное изображение */}
            <Image
              src="/image/Ykazka.png"
              alt="Процесс обучения"
              fill
              className="object-contain z-50"
              style={{ 
                transform: 'scale(0.85) translateX(-15%)', 
                objectPosition: 'left center',
                top: '104px',
                left: '-98px',
                zIndex: 50
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Разделитель */}
      <SectionDivider />
    </section>
  );
}
