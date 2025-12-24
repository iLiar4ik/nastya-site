"use client";

export function Process() {
  return (
    <section id="process" className="container py-20 md:py-32 bg-muted/50">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Как проходят занятия
          </h2>
          <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
            Пошаговый процесс подготовки к экзамену
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Диагностика</h3>
            <p className="text-sm text-muted-foreground">
              Определяю текущий уровень знаний и выявляю пробелы
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">План подготовки</h3>
            <p className="text-sm text-muted-foreground">
              Составляю индивидуальную программу занятий
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Регулярные занятия</h3>
            <p className="text-sm text-muted-foreground">
              Систематическая проработка всех тем экзамена
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-bold">
              4
            </div>
            <h3 className="text-xl font-semibold">Пробные экзамены</h3>
            <p className="text-sm text-muted-foreground">
              Регулярное решение вариантов ОГЭ для закрепления
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
