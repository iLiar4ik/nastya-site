import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Обо мне</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="/image/teacher-photo.jpg"
              alt="Фото преподавателя"
              width={400}
              height={400}
              className="object-cover rounded-lg"
            />
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Образование и опыт</h2>
              <p className="text-muted-foreground mb-4">
                Я профессиональный репетитор по математике с многолетним опытом работы. 
                Специализируюсь на подготовке учеников к ОГЭ и повышении успеваемости 
                по школьной программе.
              </p>
              <p className="text-muted-foreground mb-4">
                Моя цель - не просто объяснить материал, а помочь ученику понять 
                математику, полюбить этот предмет и достичь высоких результатов.
              </p>
              <p className="text-muted-foreground">
                Использую индивидуальный подход к каждому ученику, учитывая его 
                уровень подготовки, особенности восприятия информации и цели обучения.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Мои принципы работы</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Индивидуальный подход к каждому ученику</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Систематическая работа над пробелами в знаниях</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Регулярный контроль прогресса и обратная связь</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Использование современных методик обучения</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold mr-2">•</span>
                <span>Поддержка и мотивация учеников</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

