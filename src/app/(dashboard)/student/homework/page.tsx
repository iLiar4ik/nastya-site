"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"
import { ExternalLink } from "lucide-react"

export default function HomeworkPage() {
  const { data: session } = useSession()
  const [homework, setHomework] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      fetchHomework()
    }
  }, [session])

  const fetchHomework = async () => {
    try {
      const res = await fetch("/api/homework")
      if (res.ok) {
        const data = await res.json()
        setHomework(data)
      }
    } catch (error) {
      console.error("Error fetching homework:", error)
    }
  }

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/homework/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      })

      if (res.ok) {
        fetchHomework()
      }
    } catch (error) {
      console.error("Error updating homework:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Папка д/з</h2>

      <Card>
        <CardHeader>
          <CardTitle>Домашние задания</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Срок сдачи</TableHead>
                <TableHead>Файл</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homework.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Нет домашних заданий
                  </TableCell>
                </TableRow>
              ) : (
                homework.map((hw) => (
                  <TableRow key={hw.id}>
                    <TableCell className="font-medium">{hw.title}</TableCell>
                    <TableCell>{hw.description || "-"}</TableCell>
                    <TableCell>
                      {hw.dueDate ? format(new Date(hw.dueDate), "d MMM yyyy", { locale: ru }) : "-"}
                    </TableCell>
                    <TableCell>
                      {hw.fileUrl ? (
                        <a
                          href={hw.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          Открыть <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={hw.completed ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleComplete(hw.id, hw.completed)}
                      >
                        {hw.completed ? "Выполнено" : "Не выполнено"}
                      </Badge>
                    </TableCell>
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

