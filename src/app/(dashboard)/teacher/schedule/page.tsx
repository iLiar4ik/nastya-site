"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"
import { Plus } from "lucide-react"

export default function SchedulePage() {
  const { data: session } = useSession()
  const [lessons, setLessons] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
  })

  useEffect(() => {
    fetchLessons()
    fetchStudents()
  }, [])

  const fetchLessons = async () => {
    try {
      const res = await fetch("/api/lessons")
      if (res.ok) {
        const data = await res.json()
        setLessons(data)
      }
    } catch (error) {
      console.error("Error fetching lessons:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/students")
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const handleCreateLesson = async () => {
    if (!selectedDate || !formData.studentId || !formData.startTime || !formData.endTime) {
      return
    }

    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startTime: new Date(`${selectedDate.toISOString().split("T")[0]}T${formData.startTime}`),
          endTime: new Date(`${selectedDate.toISOString().split("T")[0]}T${formData.endTime}`),
        }),
      })

      if (res.ok) {
        setIsDialogOpen(false)
        setFormData({ studentId: "", title: "", description: "", startTime: "", endTime: "" })
        fetchLessons()
      }
    } catch (error) {
      console.error("Error creating lesson:", error)
    }
  }

  const filteredLessons = lessons.filter(lesson => {
    if (!selectedDate) return true
    const lessonDate = new Date(lesson.startTime)
    return lessonDate.toDateString() === selectedDate.toDateString()
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Расписание</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Создать занятие
        </Button>
      </div>

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
                    <TableHead>Ученик</TableHead>
                    <TableHead>Тема</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell>
                        {format(new Date(lesson.startTime), "HH:mm")} - {format(new Date(lesson.endTime), "HH:mm")}
                      </TableCell>
                      <TableCell>{lesson.student?.user?.name || "Не указан"}</TableCell>
                      <TableCell>{lesson.title || "Без темы"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать занятие</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ученик</Label>
              <Select value={formData.studentId} onValueChange={(value) => setFormData({ ...formData, studentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ученика" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.user?.name || student.user?.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Тема</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Тема занятия"
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание (необязательно)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Время начала</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label>Время окончания</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateLesson}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

