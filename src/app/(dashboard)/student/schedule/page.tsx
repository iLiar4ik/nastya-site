"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"

export default function StudentSchedulePage() {
  const { data: session } = useSession()
  const [lessons, setLessons] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    if (session) {
      fetchLessons()
    }
  }, [session])

  const fetchLessons = async () => {
    try {
      const res = await fetch("/api/lessons?student=true")
      if (res.ok) {
        const data = await res.json()
        setLessons(data)
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
    }
  }

  const filteredLessons = lessons.filter(lesson => {
    if (!selectedDate) return true
    const lessonDate = new Date(lesson.startTime)
    return lessonDate.toDateString() === selectedDate.toDateString()
  })

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Расписание</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Календарь</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar value={selectedDate} onValueChange={setSelectedDate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Занятия {selectedDate && format(selectedDate, "d MMMM yyyy", { locale: ru })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredLessons.length === 0 ? (
              <p className="text-muted-foreground">Нет занятий на выбранную дату</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Время</TableHead>
                    <TableHead>Тема</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        {format(new Date(lesson.startTime), "HH:mm")} - {format(new Date(lesson.endTime), "HH:mm")}
                      </TableCell>
                      <TableCell>{lesson.title || "Без темы"}</TableCell>
                      <TableCell>
                        {lesson.status === "completed" ? "Завершено" : 
                         lesson.status === "cancelled" ? "Отменено" : "Запланировано"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

