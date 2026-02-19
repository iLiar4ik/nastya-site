'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { format, startOfWeek, addDays, setHours, setMinutes, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'

const SUBJECTS = ['Алгебра', 'Геометрия', 'Математика', 'ОГЭ', 'ЕГЭ']

type ScheduleItem = {
  id: number
  studentId: number
  subject: string
  scheduledAt: string
  durationMinutes: number | null
  notes: string | null
}

type Student = { id: number; name: string }

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

function getItemsForDay(items: ScheduleItem[], day: Date): ScheduleItem[] {
  const dayStr = format(day, 'yyyy-MM-dd')
  return items
    .filter((item) => format(new Date(item.scheduledAt), 'yyyy-MM-dd') === dayStr)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
}

export function ScheduleAdmin() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [form, setForm] = useState({
    studentId: '',
    subject: SUBJECTS[0],
    scheduledAt: '',
    durationMinutes: '60',
    notes: '',
    extraDates: [] as Array<{ date: string; time: string }>,
  })
  const [loading, setLoading] = useState(true)

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])
  const today = new Date()

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

  function handleDragStart(e: React.DragEvent, id: number) {
    setDraggingId(id)
    e.dataTransfer.setData('application/json', JSON.stringify({ id }))
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  async function handleDrop(e: React.DragEvent, day: Date) {
    e.preventDefault()
    setDraggingId(null)
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    const { id } = JSON.parse(raw) as { id: number }
    const item = items.find((i) => i.id === id)
    if (!item) return
    const start = new Date(item.scheduledAt)
    const newStart = setMinutes(
      setHours(day, start.getHours()),
      start.getMinutes()
    )
    const scheduledAt = newStart.toISOString().slice(0, 19)
    const res = await fetch(`/api/admin/schedule/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledAt }),
    })
    if (res.ok) load()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const duration = Number(form.durationMinutes) || 60
    const baseBody = {
      studentId: Number(form.studentId),
      subject: form.subject,
      durationMinutes: duration,
      notes: form.notes || null,
    }

    if (editing) {
      const res = await fetch(`/api/admin/schedule/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...baseBody, scheduledAt: form.scheduledAt.slice(0, 19) }),
      })
      if (res.ok) {
        setOpen(false)
        setEditing(null)
        resetForm()
        load()
      }
      return
    }

    const mainTime = form.scheduledAt.slice(11, 16)
    const mainDate = form.scheduledAt.slice(0, 10)
    const lessonsToCreate: Array<{ date: string; time: string }> = [
      { date: mainDate, time: mainTime },
      ...form.extraDates,
    ]

    for (const { date, time } of lessonsToCreate) {
      const scheduledAt = `${date}T${time}:00`
      await fetch('/api/admin/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...baseBody, scheduledAt }),
      })
    }
    setOpen(false)
    setEditing(null)
    resetForm()
    load()
  }

  function resetForm() {
    setForm({
      studentId: '',
      subject: SUBJECTS[0],
      scheduledAt: '',
      durationMinutes: '60',
      notes: '',
      extraDates: [] as Array<{ date: string; time: string }>,
    })
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
      subject: SUBJECTS.includes(item.subject) ? item.subject : SUBJECTS[0],
      scheduledAt: item.scheduledAt.slice(0, 16),
      durationMinutes: String(item.durationMinutes ?? 60),
      notes: item.notes ?? '',
      extraDates: [] as Array<{ date: string; time: string }>,
    })
    setOpen(true)
  }

  function openAdd(day?: Date) {
    setEditing(null)
    const d = day ?? today
    const h = 10
    const base = setMinutes(setHours(d, h), 0)
    setForm({
      studentId: students[0]?.id ? String(students[0].id) : '',
      subject: SUBJECTS[0],
      scheduledAt: format(base, "yyyy-MM-dd'T'HH:mm"),
      durationMinutes: '60',
      notes: '',
      extraDates: [] as Array<{ date: string; time: string }>,
    })
    setOpen(true)
  }

  function addExtraDate() {
    const defaultTime = form.scheduledAt.slice(11, 16) || '10:00'
    setForm((f) => ({
      ...f,
      extraDates: [...f.extraDates, { date: format(weekStart, 'yyyy-MM-dd'), time: defaultTime }],
    }))
  }

  function removeExtraDate(index: number) {
    setForm((f) => ({
      ...f,
      extraDates: f.extraDates.filter((_, i) => i !== index),
    }))
  }

  function updateExtraDate(index: number, field: 'date' | 'time', value: string) {
    setForm((f) => {
      const next = [...f.extraDates]
      next[index] = { ...next[index], [field]: value }
      return { ...f, extraDates: next }
    })
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[220px] text-center">
            {format(weekDays[0], 'd MMM', { locale: ru })} – {format(weekDays[6], 'd MMM yyyy', { locale: ru })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openAdd()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Добавить занятие
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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
                <select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
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
              {!editing && (
                <div>
                  <Label>Добавить на другие даты</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Создать такое же занятие на выбранные дни и время
                  </p>
                  {form.extraDates.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center mt-1">
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateExtraDate(i, 'date', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="time"
                        value={item.time}
                        onChange={(e) => updateExtraDate(i, 'time', e.target.value)}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExtraDate(i)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addExtraDate}>
                    + Ещё дата
                  </Button>
                </div>
              )}
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

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b bg-muted/50">
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`p-2 text-center text-xs font-medium min-w-[140px] ${
                      isSameDay(day, today)
                        ? 'bg-primary/15 text-primary font-semibold'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div>{format(day, 'EEE', { locale: ru })}</div>
                    <div>{format(day, 'd')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {weekDays.map((day) => {
                  const dayItems = getItemsForDay(items, day)
                  const isToday = isSameDay(day, today)
                  return (
                    <td
                      key={day.toISOString()}
                      className={`align-top p-2 min-h-[200px] ${
                        isToday ? 'bg-primary/5' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day)}
                    >
                      <div className="flex flex-col gap-1.5">
                        {dayItems.map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onDragEnd={() => setDraggingId(null)}
                            className={`group flex items-center justify-between gap-1 rounded border bg-card px-2 py-1.5 text-xs shadow-sm cursor-grab active:cursor-grabbing hover:shadow ${
                              draggingId === item.id ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-muted-foreground font-mono text-[10px]">
                                {format(new Date(item.scheduledAt), 'HH:mm', { locale: ru })}
                              </div>
                              <div className="font-medium truncate">{item.subject}</div>
                              <div className="text-muted-foreground truncate">
                                {studentName(item.studentId)}
                              </div>
                              {(item.durationMinutes ?? 60) !== 60 && (
                                <div className="text-[10px] text-muted-foreground">
                                  {item.durationMinutes} мин
                                </div>
                              )}
                            </div>
                            <div className="flex shrink-0 opacity-0 group-hover:opacity-100">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEdit(item)
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDelete(item.id)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="flex items-center justify-center rounded border border-dashed py-2 text-xs text-muted-foreground hover:bg-muted/50 hover:border-primary/50 min-h-[40px]"
                          onClick={() => openAdd(day)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
