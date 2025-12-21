"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"
import { Plus } from "lucide-react"

export default function OGEPage() {
  const [tests, setTests] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false)
  const [testFormData, setTestFormData] = useState({
    studentId: "",
    testDate: "",
    score: "",
    maxScore: "100",
    subject: "",
    notes: "",
  })
  const [materialFormData, setMaterialFormData] = useState({
    studentId: "",
    title: "",
    description: "",
    fileUrl: "",
    isPublic: false,
  })

  useEffect(() => {
    fetchTests()
    fetchMaterials()
    fetchStudents()
  }, [])

  const fetchTests = async () => {
    try {
      const res = await fetch("/api/oge/tests")
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
      const res = await fetch("/api/oge/materials")
      if (res.ok) {
        const data = await res.json()
        setMaterials(data)
      }
    } catch (error) {
      console.error("Error fetching materials:", error)
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

  const handleCreateTest = async () => {
    try {
      const res = await fetch("/api/oge/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...testFormData,
          score: testFormData.score ? parseInt(testFormData.score) : null,
          maxScore: parseInt(testFormData.maxScore),
          testDate: new Date(testFormData.testDate),
        }),
      })

      if (res.ok) {
        setIsTestDialogOpen(false)
        setTestFormData({
          studentId: "",
          testDate: "",
          score: "",
          maxScore: "100",
          subject: "",
          notes: "",
        })
        fetchTests()
      }
    } catch (error) {
      console.error("Error creating test:", error)
    }
  }

  const handleCreateMaterial = async () => {
    try {
      const res = await fetch("/api/oge/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialFormData),
      })

      if (res.ok) {
        setIsMaterialDialogOpen(false)
        setMaterialFormData({
          studentId: "",
          title: "",
          description: "",
          fileUrl: "",
          isPublic: false,
        })
        fetchMaterials()
      }
    } catch (error) {
      console.error("Error creating material:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">ОГЭ</h2>

      <Tabs defaultValue="tests">
        <TabsList>
          <TabsTrigger value="tests">Пробники</TabsTrigger>
          <TabsTrigger value="materials">Материалы</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsTestDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить пробник
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Пробники ОГЭ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ученик</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Предмет</TableHead>
                    <TableHead>Оценка</TableHead>
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
                    tests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell>{test.student?.user?.name || test.student?.user?.email}</TableCell>
                        <TableCell>
                          {format(new Date(test.testDate), "d MMM yyyy", { locale: ru })}
                        </TableCell>
                        <TableCell>{test.subject || "-"}</TableCell>
                        <TableCell>
                          {test.score !== null ? `${test.score} / ${test.maxScore}` : "-"}
                        </TableCell>
                        <TableCell>{test.notes || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsMaterialDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить материал
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Материалы ОГЭ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Ученик</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Публичный</TableHead>
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
                        <TableCell>{material.title}</TableCell>
                        <TableCell>
                          {material.student ? (material.student.user?.name || material.student.user?.email) : "Все"}
                        </TableCell>
                        <TableCell>{material.description || "-"}</TableCell>
                        <TableCell>{material.isPublic ? "Да" : "Нет"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить пробник</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Ученик</Label>
              <Select value={testFormData.studentId} onValueChange={(value) => setTestFormData({ ...testFormData, studentId: value })}>
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
              <Label>Дата</Label>
              <Input
                type="date"
                value={testFormData.testDate}
                onChange={(e) => setTestFormData({ ...testFormData, testDate: e.target.value })}
              />
            </div>
            <div>
              <Label>Предмет</Label>
              <Input
                value={testFormData.subject}
                onChange={(e) => setTestFormData({ ...testFormData, subject: e.target.value })}
                placeholder="Математика"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Оценка</Label>
                <Input
                  type="number"
                  value={testFormData.score}
                  onChange={(e) => setTestFormData({ ...testFormData, score: e.target.value })}
                  placeholder="0-100"
                />
              </div>
              <div>
                <Label>Максимум</Label>
                <Input
                  type="number"
                  value={testFormData.maxScore}
                  onChange={(e) => setTestFormData({ ...testFormData, maxScore: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Примечания</Label>
              <Input
                value={testFormData.notes}
                onChange={(e) => setTestFormData({ ...testFormData, notes: e.target.value })}
                placeholder="Примечания (необязательно)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateTest}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить материал</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Название</Label>
              <Input
                value={materialFormData.title}
                onChange={(e) => setMaterialFormData({ ...materialFormData, title: e.target.value })}
                placeholder="Название материала"
              />
            </div>
            <div>
              <Label>Ученик (оставьте пустым для всех)</Label>
              <Select value={materialFormData.studentId} onValueChange={(value) => setMaterialFormData({ ...materialFormData, studentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Все ученики" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все ученики</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.user?.name || student.user?.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Описание</Label>
              <Input
                value={materialFormData.description}
                onChange={(e) => setMaterialFormData({ ...materialFormData, description: e.target.value })}
                placeholder="Описание (необязательно)"
              />
            </div>
            <div>
              <Label>Ссылка на файл</Label>
              <Input
                value={materialFormData.fileUrl}
                onChange={(e) => setMaterialFormData({ ...materialFormData, fileUrl: e.target.value })}
                placeholder="URL файла"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaterialDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateMaterial}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

