"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"

export default function PerformancePage() {
  const [performance, setPerformance] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("all")

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    fetchPerformance()
  }, [selectedStudent])

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

  const fetchPerformance = async () => {
    try {
      const url = selectedStudent === "all" 
        ? "/api/performance" 
        : `/api/performance?studentId=${selectedStudent}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setPerformance(data)
      }
    } catch (error) {
      console.error("Error fetching performance:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Успеваемость</h2>
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Выберите ученика" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все ученики</SelectItem>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.user?.name || student.user?.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Записи успеваемости</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Ученик</TableHead>
                <TableHead>Предмет</TableHead>
                <TableHead>Оценка</TableHead>
                <TableHead>Примечания</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Нет записей
                  </TableCell>
                </TableRow>
              ) : (
                performance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.date), "d MMM yyyy", { locale: ru })}
                    </TableCell>
                    <TableCell>{record.student?.user?.name || record.student?.user?.email}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>
                      {record.score !== null ? `${record.score}${record.maxScore ? ` / ${record.maxScore}` : ""}` : "-"}
                    </TableCell>
                    <TableCell>{record.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

