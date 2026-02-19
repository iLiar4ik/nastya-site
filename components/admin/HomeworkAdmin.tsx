'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const STATUSES = [
  { value: 'active', label: 'Активное' },
  { value: 'review', label: 'На проверке' },
  { value: 'checked', label: 'Проверено' },
  { value: 'overdue', label: 'Просрочено' },
]

type HomeworkItem = {
  id: number
  studentId: number
  title: string
  dueDate: string
  status: string
  grade: number | null
  teacherComment: string | null
  instructions: string | null
}

type Student = { id: number; name: string }

export function HomeworkAdmin() {
  const [items, setItems] = useState<HomeworkItem[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [open, setOpen] = useState(false)
  const [gradeOpen, setGradeOpen] = useState(false)
  const [editing, setEditing] = useState<HomeworkItem | null>(null)
  const [grading, setGrading] = useState<HomeworkItem | null>(null)
  const [form, setForm] = useState({
    studentId: '',
    title: '',
    dueDate: '',
    instructions: '',
  })
  const [gradeForm, setGradeForm] = useState({ grade: '', teacherComment: '' })
  const [loading, setLoading] = useState(true)

  async function load() {
    const [sRes, rRes] = await Promise.all([
      fetch('/api/admin/students'),
      fetch('/api/admin/homework'),
    ])
    if (sRes.ok) setStudents(await sRes.json())
    if (rRes.ok) setItems(await rRes.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function studentName(id: number) {
    return students.find((s) => s.id === id)?.name ?? `#${id}`
  }

  const statusLabel: Record<string, string> = {
    active: 'Активное',
    review: 'На проверке',
    checked: 'Проверено',
    overdue: 'Просрочено',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = editing ? `/api/admin/homework/${editing.id}` : '/api/admin/homework'
    const body = {
      studentId: Number(form.studentId),
      title: form.title,
      dueDate: form.dueDate,
      instructions: form.instructions || null,
    }
    const res = await fetch(url, {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { ...body, status: editing.status } : body),
    })
    if (res.ok) {
      setOpen(false)
      setEditing(null)
      setForm({ studentId: '', title: '', dueDate: '', instructions: '' })
      load()
    }
  }

  async function handleStatusChange(item: HomeworkItem, status: string) {
    const res = await fetch(`/api/admin/homework/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) load()
  }

  async function handleGradeSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!grading) return
    const res = await fetch(`/api/admin/homework/${grading.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'checked',
        grade: gradeForm.grade ? Number(gradeForm.grade) : null,
        teacherComment: gradeForm.teacherComment || null,
      }),
    })
    if (res.ok) {
      setGradeOpen(false)
      setGrading(null)
      setGradeForm({ grade: '', teacherComment: '' })
      load()
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить задание?')) return
    const res = await fetch(`/api/admin/homework/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  function openEdit(item: HomeworkItem) {
    setEditing(item)
    setForm({
      studentId: String(item.studentId),
      title: item.title,
      dueDate: item.dueDate.slice(0, 10),
      instructions: item.instructions ?? '',
    })
    setOpen(true)
  }

  function openGrade(item: HomeworkItem) {
    setGrading(item)
    setGradeForm({ grade: item.grade ? String(item.grade) : '', teacherComment: item.teacherComment ?? '' })
    setGradeOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setForm({
      studentId: students[0]?.id ? String(students[0].id) : '',
      title: '',
      dueDate: new Date().toISOString().slice(0, 10),
      instructions: '',
    })
    setOpen(true)
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={openAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить ДЗ
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать' : 'Новое ДЗ'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Ученик *</Label>
              <select
                value={form.studentId}
                onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Название *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Срок сдачи *</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Инструкция</Label>
              <textarea
                value={form.instructions}
                onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <Button type="submit">{editing ? 'Сохранить' : 'Добавить'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={gradeOpen} onOpenChange={setGradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выставить оценку</DialogTitle>
          </DialogHeader>
          {grading && (
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">{grading.title}</p>
              <div>
                <Label>Оценка</Label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm((f) => ({ ...f, grade: e.target.value }))}
                />
              </div>
              <div>
                <Label>Комментарий</Label>
                <textarea
                  value={gradeForm.teacherComment}
                  onChange={(e) => setGradeForm((f) => ({ ...f, teacherComment: e.target.value }))}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <Button type="submit">Сохранить</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ученик</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Срок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Оценка</TableHead>
                <TableHead className="w-[200px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{studentName(item.studentId)}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item, e.target.value)}
                      className="rounded border bg-background px-2 py-1 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>{item.grade != null ? item.grade : '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(item.status === 'review' || item.status === 'checked') && (
                        <Button size="sm" variant="outline" onClick={() => openGrade(item)}>
                          Оценка
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {items.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">Нет домашних заданий.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
