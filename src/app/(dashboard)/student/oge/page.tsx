"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"

export default function OGEPage() {
  const { data: session } = useSession()
  const [tests, setTests] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      fetchTests()
      fetchMaterials()
    }
  }, [session])

  const fetchTests = async () => {
    try {
      const res = await fetch("/api/oge/tests?student=true")
      if (res.ok) {
        const data = await res.json()
        setTests(data)
      }
    } catch (error) {
      console.error("Error fetching tests:", error)
    }
  }

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/oge/materials?student=true")
      if (res.ok) {
        const data = await res.json()
        setMaterials(data)
      }
    } catch (error) {
      console.error("Error fetching materials:", error)
    }
  }

  const avgScore = tests.length > 0
    ? tests.filter(t => t.score !== null).reduce((sum, t) => sum + (t.score / t.maxScore) * 100, 0) / tests.filter(t => t.score !== null).length
    : 0

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">ОГЭ</h2>

      <Tabs defaultValue="statistics">
        <TabsList>
          <TabsTrigger value="statistics">Статистика пробников</TabsTrigger>
          <TabsTrigger value="materials">Материалы ОГЭ</TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Всего пробников</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{tests.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Средний балл</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{avgScore.toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Последний пробник</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {tests.length > 0 && tests[tests.length - 1].testDate
                    ? format(new Date(tests[tests.length - 1].testDate), "d MMM yyyy", { locale: ru })
                    : "-"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>История пробников</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Предмет</TableHead>
                    <TableHead>Оценка</TableHead>
                    <TableHead>Процент</TableHead>
                    <TableHead>Примечания</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Нет пробников
                      </TableCell>
                    </TableRow>
                  ) : (
                    tests.map((test) => {
                      const percentage = test.score !== null ? ((test.score / test.maxScore) * 100).toFixed(1) : "-"
                      return (
                        <TableRow key={test.id}>
                          <TableCell>
                            {format(new Date(test.testDate), "d MMM yyyy", { locale: ru })}
                          </TableCell>
                          <TableCell>{test.subject || "-"}</TableCell>
                          <TableCell>
                            {test.score !== null ? `${test.score} / ${test.maxScore}` : "-"}
                          </TableCell>
                          <TableCell>{percentage}%</TableCell>
                          <TableCell>{test.notes || "-"}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Материалы ОГЭ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Дата добавления</TableHead>
                    <TableHead>Файл</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Нет материалов
                      </TableCell>
                    </TableRow>
                  ) : (
                    materials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>{material.description || "-"}</TableCell>
                        <TableCell>
                          {format(new Date(material.createdAt), "d MMM yyyy", { locale: ru })}
                        </TableCell>
                        <TableCell>
                          <a
                            href={material.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            Открыть <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

