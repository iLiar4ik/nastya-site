'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
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
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

type ScheduleItem = {
  id: number
  studentId: number
  subject: string
  scheduledAt: string
  durationMinutes: number | null
  notes: string | null
}

type Student = { id: number; name: string }

function toDateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

function sameDay(iso: string, date: Date): boolean {
  return toDateKey(new Date(iso)) === toDateKey(date)
}

export function ScheduleAdmin() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
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

  const daysWithLessons = useMemo(() => {
    const set = new Set<string>()
    items.forEach((item) => set.add(toDateKey(new Date(item.scheduledAt))))
    return Array.from(set).map((s) => {
      const [y, m, d] = s.split('-').map(Number)
      return new Date(y, m - 1, d)
    })
  }, [items])

  const lessonsForSelectedDay = useMemo(() => {
    if (!selectedDate) return []
    return items
      .filter((item) => sameDay(item.scheduledAt, selectedDate))
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
  }, [items, selectedDate])

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
    const base = selectedDate
      ? format(selectedDate, "yyyy-MM-dd'T'HH:mm", { locale: ru })
      : new Date().toISOString().slice(0, 16)
    setForm({
      studentId: students[0]?.id ? String(students[0].id) : '',
      subject: '',
      scheduledAt: base,
      durationMinutes: '60',
      notes: '',
    })
    setOpen(true)
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
      <div>
        <Card>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              onMonthChange={() => {}}
              className="w-full"
              locale={ru}
              modifiers={{
                lessonDay: daysWithLessons,
              }}
              modifiersClassNames={{
                lessonDay: 'border-2 border-primary rounded-md font-medium',
              }}
            />
          </CardContent>
        </Card>
        <div className="mt-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="w-full">
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
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? `Занятия на ${format(selectedDate, 'd MMMM yyyy', { locale: ru })}`
              : 'Выберите день в календаре'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDate && (
            <>
              {lessonsForSelectedDay.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Ученик</TableHead>
                      <TableHead>Предмет</TableHead>
                      <TableHead>Длительность</TableHead>
                      <TableHead>Заметки</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessonsForSelectedDay.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {format(new Date(item.scheduledAt), 'HH:mm', { locale: ru })}
                        </TableCell>
                        <TableCell>{studentName(item.studentId)}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.durationMinutes ?? 60} мин</TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          {item.notes ?? '—'}
                        </TableCell>
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
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>В этот день занятий нет.</p>
                  <Button variant="outline" className="mt-4" onClick={openAdd}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Добавить занятие
                  </Button>
                </div>
              )}
            </>
          )}
          {!selectedDate && (
            <p className="py-12 text-center text-muted-foreground">
              Нажмите на день в календаре, чтобы увидеть занятия.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
