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

type ScheduleItem = {
  id: number
  studentId: number
  subject: string
  scheduledAt: string
  durationMinutes: number | null
  notes: string | null
}

type Student = { id: number; name: string }

export function ScheduleAdmin() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [form, setForm] = useState({
    studentId: '',
    subject: '',
    scheduledAt: '',
    durationMinutes: '60',
    notes: '',
  })
  const [loading, setLoading] = useState(true)

  async function load() {
    const [sRes, rRes] = await Promise.all([
      fetch('/api/admin/students'),
      fetch('/api/admin/schedule'),
    ])
    if (sRes.ok) setStudents(await sRes.json())
    if (rRes.ok) setItems(await rRes.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function studentName(id: number) {
    return students.find((s) => s.id === id)?.name ?? `#${id}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = editing ? `/api/admin/schedule/${editing.id}` : '/api/admin/schedule'
    const body = {
      studentId: Number(form.studentId),
      subject: form.subject,
      scheduledAt: form.scheduledAt,
      durationMinutes: Number(form.durationMinutes) || 60,
      notes: form.notes || null,
    }
    const res = await fetch(url, {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setOpen(false)
      setEditing(null)
      setForm({ studentId: '', subject: '', scheduledAt: '', durationMinutes: '60', notes: '' })
      load()
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить занятие?')) return
    const res = await fetch(`/api/admin/schedule/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  function openEdit(item: ScheduleItem) {
    setEditing(item)
    setForm({
      studentId: String(item.studentId),
      subject: item.subject,
      scheduledAt: item.scheduledAt.slice(0, 16),
      durationMinutes: String(item.durationMinutes ?? 60),
      notes: item.notes ?? '',
    })
    setOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setForm({
      studentId: students[0]?.id ? String(students[0].id) : '',
      subject: '',
      scheduledAt: new Date().toISOString().slice(0, 16),
      durationMinutes: '60',
      notes: '',
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
            Добавить занятие
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать' : 'Новое занятие'}</DialogTitle>
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
              <Label>Предмет *</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Математика"
                required
              />
            </div>
            <div>
              <Label>Дата и время *</Label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Длительность (мин)</Label>
              <Input
                type="number"
                min={15}
                value={form.durationMinutes}
                onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
              />
            </div>
            <div>
              <Label>Заметки</Label>
              <Input
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <Button type="submit">{editing ? 'Сохранить' : 'Добавить'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ученик</TableHead>
                <TableHead>Предмет</TableHead>
                <TableHead>Дата и время</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Заметки</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{studentName(item.studentId)}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{new Date(item.scheduledAt).toLocaleString('ru-RU')}</TableCell>
                  <TableCell>{item.durationMinutes ?? 60} мин</TableCell>
                  <TableCell className="text-muted-foreground">{item.notes ?? '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
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
            <p className="text-center py-8 text-muted-foreground">Нет занятий. Добавьте первое.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
