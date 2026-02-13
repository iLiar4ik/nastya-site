"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionDivider } from "@/components/ui/section-divider";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, Presentation, BookOpen, ClipboardCheck, Video, Pencil, Book, MessageSquare } from "lucide-react";

export function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const learningSteps = [
    {
      icon: <LogIn className="w-6 h-6" />,
      title: "Знакомство и подключение",
      description: "Пробное занятие для определения уровня и постановки целей. Подключаемся к видеоконференции (Zoom, Skype).",
    },
    {
      icon: <Presentation className="w-6 h-6" />,
      title: "Интерактивное занятие",
      description: "Работа на виртуальной доске (Miro). Решаем задачи, разбираем теорию и устраняем пробелы в знаниях.",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Домашнее задание",
      description: "Получение и отправка заданий через удобный мессенджер (Telegram). Задания подбираются индивидуально.",
    },
    {
      icon: <ClipboardCheck className="w-6 h-6" />,
      title: "Проверка и обратная связь",
      description: "Подробный разбор выполненных заданий, работа над ошибками и закрепление материала на следующем уроке.",
    },
  ];

  const onlineTools = [
    {
      icon: <Video className="w-8 h-8 mx-auto text-primary" />,
      title: "Видеосвязь",
      description: "Zoom, Skype",
    },
    {
      icon: <Pencil className="w-8 h-8 mx-auto text-primary" />,
      title: "Интерактивная доска",
      description: "Miro",
    },
    {
      icon: <Book className="w-8 h-8 mx-auto text-primary" />,
      title: "Учебные материалы",
      description: "Презентации, тесты",
    },
    {
      icon: <MessageSquare className="w-8 h-8 mx-auto text-primary" />,
      title: "Мессенджеры",
      description: "Telegram",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    },
  };

  const itemVariants = (fromLeft: boolean) => ({
    hidden: { opacity: 0, x: fromLeft ? -50 : 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  });

  return (
    <section id="process" className="container py-20 md:py-32 relative flex flex-col items-center">
      <div ref={ref} className="w-full max-w-4xl flex flex-col items-center">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            ПРОЦЕСС ОБУЧЕНИЯ
          </h2>
          <p className="mt-4 max-w-[700px] mx-auto text-lg text-muted-foreground">
            Комфортные онлайн-уроки с индивидуальным подходом к каждому ученику.
          </p>
        </motion.div>

        {/* Вертикальный степпер */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative w-full space-y-8"
        >
          {/* Центральная линия */}
          <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2 hidden md:block"></div>

          {learningSteps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                variants={itemVariants(isLeft)}
                className="relative w-full"
              >
                <div className={
                  "md:flex items-center w-full " + 
                  (isLeft ? "justify-start" : "justify-end")
                }>
                  {/* Контент карточки */}
                  <div className="md:w-[calc(50%-2.5rem)]">
                    <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                          <p className="text-muted-foreground text-sm">{step.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Точка на линии */}
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 hidden md:flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-background border-2 border-primary shadow-md"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Инструменты */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 w-full"
        >
          <h3 className="text-2xl font-semibold text-center mb-8">Используемые инструменты</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {onlineTools.map(tool => (
              <Card key={tool.title} className="text-center p-4 hover:border-primary/50 transition-colors">
                {tool.icon}
                <h4 className="font-semibold mt-2">{tool.title}</h4>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
      
      <SectionDivider />
    </section>
  );
}
