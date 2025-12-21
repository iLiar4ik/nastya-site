"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    phone: "",
    parentName: "",
    parentPhone: "",
  })

  useEffect(() => {
    fetchStudents()
  }, [])

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

  const handleCreateStudent = async () => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsDialogOpen(false)
        setFormData({
          email: "",
          name: "",
          password: "",
          phone: "",
          parentName: "",
          parentPhone: "",
        })
        fetchStudents()
      }
    } catch (error) {
      console.error("Error creating student:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Ученики</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить ученика
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список учеников</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Родитель</TableHead>
                <TableHead>Телефон родителя</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Нет учеников
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.user?.name || "-"}</TableCell>
                    <TableCell>{student.user?.email}</TableCell>
                    <TableCell>{student.phone || "-"}</TableCell>
                    <TableCell>{student.parentName || "-"}</TableCell>
                    <TableCell>{student.parentPhone || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить ученика</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label>Имя</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Имя ученика"
              />
            </div>
            <div>
              <Label>Пароль</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Пароль"
              />
            </div>
            <div>
              <Label>Телефон ученика</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </div>
            <div>
              <Label>Имя родителя</Label>
              <Input
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="Имя родителя"
              />
            </div>
            <div>
              <Label>Телефон родителя</Label>
              <Input
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                placeholder="+7 (XXX) XXX-XX-XX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateStudent}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

