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

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

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

function lessonInSlot(item: ScheduleItem, day: Date, hour: number): boolean {
  const start = new Date(item.scheduledAt)
  const startHour = start.getHours()
  const itemDay = format(start, 'yyyy-MM-dd')
  const slotDay = format(day, 'yyyy-MM-dd')
  return itemDay === slotDay && startHour === hour
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
    extraDates: [] as string[],
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

  function getItemsInCell(day: Date, hour: number): ScheduleItem[] {
    return items.filter((item) => lessonInSlot(item, day, hour))
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

  async function handleDrop(
    e: React.DragEvent,
    day: Date,
    hour: number
  ) {
    e.preventDefault()
    setDraggingId(null)
    const raw = e.dataTransfer.getData('application/json')
    if (!raw) return
    const { id } = JSON.parse(raw) as { id: number }
    const newStart = setMinutes(setHours(day, hour), 0)
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
    const timePart = form.scheduledAt.slice(11, 16)
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

    const datesToCreate: string[] = [
      form.scheduledAt.slice(0, 10),
      ...form.extraDates,
    ].filter(Boolean)
    const uniqueDates = Array.from(new Set(datesToCreate))

    for (const dateStr of uniqueDates) {
      const scheduledAt = `${dateStr}T${timePart}:00`
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
      extraDates: [],
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
      extraDates: [],
    })
    setOpen(true)
  }

  function openAdd(day?: Date, hour?: number) {
    setEditing(null)
    const d = day ?? today
    const h = hour ?? 10
    const base = setMinutes(setHours(d, h), 0)
    setForm({
      studentId: students[0]?.id ? String(students[0].id) : '',
      subject: SUBJECTS[0],
      scheduledAt: format(base, "yyyy-MM-dd'T'HH:mm"),
      durationMinutes: '60',
      notes: '',
      extraDates: [],
    })
    setOpen(true)
  }

  function addExtraDate() {
    setForm((f) => ({
      ...f,
      extraDates: [...f.extraDates, format(weekStart, 'yyyy-MM-dd')],
    }))
  }

  function removeExtraDate(index: number) {
    setForm((f) => ({
      ...f,
      extraDates: f.extraDates.filter((_, i) => i !== index),
    }))
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
                    Создать такое же занятие в те же часы на выбранные дни
                  </p>
                  {form.extraDates.map((dateStr, i) => (
                    <div key={i} className="flex gap-2 items-center mt-1">
                      <Input
                        type="date"
                        value={dateStr}
                        onChange={(e) => {
                          const next = [...form.extraDates]
                          next[i] = e.target.value
                          setForm((f) => ({ ...f, extraDates: next }))
                        }}
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
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-14 p-2 text-left text-xs font-medium text-muted-foreground">
                  Время
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.toISOString()}
                    className={`p-2 text-center text-xs font-medium min-w-[120px] ${
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
              {HOURS.map((hour) => (
                <tr key={hour} className="border-b hover:bg-muted/30">
                  <td className="p-1 text-xs text-muted-foreground align-top">
                    {hour.toString().padStart(2, '0')}:00
                  </td>
                  {weekDays.map((day) => {
                    const cellItems = getItemsInCell(day, hour)
                    const isToday = isSameDay(day, today)
                    return (
                      <td
                        key={`${day.toISOString()}-${hour}`}
                        className={`align-top p-1 min-h-[52px] ${
                          isToday ? 'bg-primary/5' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day, hour)}
                      >
                        <div className="flex flex-col gap-1 min-h-[48px]">
                          {cellItems.map((item) => (
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
                            className="flex items-center justify-center rounded border border-dashed py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:border-primary/50 min-h-[32px]"
                            onClick={() => openAdd(day, hour)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
