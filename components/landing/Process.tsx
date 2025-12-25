"use client";

import Image from "next/image";

export function Process() {
  return (
    <section id="process" className="container py-20 md:py-32">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        {/* Левая колонка - Текст */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              ПРОЦЕСС ОБУЧЕНИЯ
            </h2>
            <p className="text-lg text-muted-foreground">
              Комфортные онлайн или очные уроки с индивидуальным подходом
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">Онлайн обучение</h3>
              <p className="text-muted-foreground">
                Современные технологии позволяют проводить занятия дистанционно без потери качества. 
                Использую интерактивные доски и материалы для максимальной эффективности.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">Подготовка к экзаменам</h3>
              <p className="text-muted-foreground">
                Систематическая проработка всех тем ОГЭ, регулярные пробные тесты и разбор типовых 
                заданий помогают ученикам чувствовать себя уверенно на экзамене.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold">Индивидуальный подход</h3>
              <p className="text-muted-foreground">
                Каждое занятие адаптировано под уровень и потребности конкретного ученика. 
                Учитываю особенности восприятия и темп работы для максимального результата.
              </p>
            </div>
          </div>
        </div>
        
        {/* Правая колонка - Иллюстрация */}
        <div className="relative h-[500px]">
          <Image
            src="/image/30070552ff9d13479f9b7f44a3062113_fbf3323c-259c-4a26-8d77-9f03e43252e0.png"
            alt="Процесс обучения"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
