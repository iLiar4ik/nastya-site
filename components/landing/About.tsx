import Image from "next/image";

export function About() {
  return (
    <section id="about" className="container py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Обо мне
          </h2>
          <p className="text-muted-foreground text-lg">
            Опытный репетитор по математике с многолетним стажем работы. 
            Специализируюсь на подготовке учащихся к ОГЭ по математике.
          </p>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Квалификация:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Высшее математическое образование</li>
              <li>Опыт работы более 5 лет</li>
              <li>Специализация на подготовке к ОГЭ</li>
              <li>Индивидуальный подход к каждому ученику</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Опыт:</h3>
            <p className="text-muted-foreground">
              Более 100 успешно подготовленных учеников. Средний балл моих 
              учеников на ОГЭ составляет 4.5+. Работаю как с сильными, так и 
              со слабыми учениками, помогая каждому достичь максимального результата.
            </p>
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src="/image/teacher-photo.jpg"
            alt="Фото репетитора"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}


