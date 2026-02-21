'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, UserPlus, Video } from 'lucide-react'
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
const DURATION_OPTIONS = [45, 60, 90] as const

type ScheduleItem = {
  id: number
  studentId: number | null
  subject: string
  scheduledAt: string
  durationMinutes: number | null
  notes: string | null
}

type Student = { id: number; name: string }

type ScheduleTemplateItem = {
  id: number
  dayOfWeek: number
  time: string
  subject: string
  durationMinutes: number | null
  studentId: number | null
  notes: string | null
}

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

function getItemsForDay(items: ScheduleItem[], day: Date): ScheduleItem[] {
  const dayStr = format(day, 'yyyy-MM-dd')
  return items
    .filter((item) => format(new Date(item.scheduledAt), 'yyyy-MM-dd') === dayStr)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
}

function getTemplatesForDay(templates: ScheduleTemplateItem[], dayOfWeek: number): ScheduleTemplateItem[] {
  return templates
    .filter((t) => t.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.time.localeCompare(b.time))
}

export function ScheduleAdmin() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [templates, setTemplates] = useState<ScheduleTemplateItem[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [draggingId, setDraggingId] = useState<number | null>(null)
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [form, setForm] = useState({
    isFreeSlot: false,
    studentId: '',
    subject: SUBJECTS[0],
    scheduledAt: '',
    durationMinutes: '60',
    notes: '',
    extraDates: [] as Array<{ date: string; time: string }>,
  })
  const [assignSlotId, setAssignSlotId] = useState<number | null>(null)
  const [assignStudentId, setAssignStudentId] = useState('')
  const [showExtraDates, setShowExtraDates] = useState(false)
  const [inlineEditId, setInlineEditId] = useState<number | null>(null)
  const [addingForDay, setAddingForDay] = useState<string | null>(null) // 'yyyy-MM-dd'
  const [loading, setLoading] = useState(true)
  const [templateForm, setTemplateForm] = useState({
    dayOfWeek: 1,
    time: '10:00',
    subject: SUBJECTS[0],
    durationMinutes: '60',
    studentId: '',
    isFreeSlot: true,
  })
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [templateCollapsed, setTemplateCollapsed] = useState(false)

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])
  const today = new Date()

  async function load() {
    const [sRes, rRes, tRes] = await Promise.all([
      fetch('/api/admin/students'),
      fetch('/api/admin/schedule'),
      fetch('/api/admin/schedule/templates'),
    ])
    if (sRes.ok) setStudents(await sRes.json())
    if (rRes.ok) setItems(await rRes.json())
    if (tRes.ok) {
      const raw = (await tRes.json()) as Record<string, unknown>[]
      setTemplates(raw.map((r) => ({
        id: r.id as number,
        dayOfWeek: Number(r.dayOfWeek ?? r.day_of_week ?? 1),
        time: String(r.time ?? ''),
        subject: String(r.subject ?? ''),
        durationMinutes: r.durationMinutes != null ? Number(r.durationMinutes) : r.duration_minutes != null ? Number(r.duration_minutes) : 60,
        studentId: r.studentId != null ? Number(r.studentId) : r.student_id != null ? Number(r.student_id) : null,
        notes: r.notes != null ? String(r.notes) : null,
      })))
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function studentName(id: number | null) {
    if (id == null) return 'Свободное окно'
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
      studentId: form.isFreeSlot ? null : (form.studentId ? Number(form.studentId) : null),
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
    setEditing(null)
    resetForm()
    load()
  }

  async function handleAssignStudent() {
    if (!assignSlotId || !assignStudentId) return
    const res = await fetch(`/api/admin/schedule/${assignSlotId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: Number(assignStudentId) }),
    })
    if (res.ok) {
      setAssignSlotId(null)
      setAssignStudentId('')
      load()
    }
  }

  function resetForm() {
    setForm({
      isFreeSlot: false,
      studentId: '',
      subject: SUBJECTS[0],
      scheduledAt: '',
      durationMinutes: '60',
      notes: '',
      extraDates: [] as Array<{ date: string; time: string }>,
    })
    setShowExtraDates(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить занятие?')) return
    const res = await fetch(`/api/admin/schedule/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  function openEdit(item: ScheduleItem) {
    setEditing(item)
    setForm({
      isFreeSlot: item.studentId == null,
      studentId: item.studentId != null ? String(item.studentId) : '',
      subject: SUBJECTS.includes(item.subject) ? item.subject : SUBJECTS[0],
      scheduledAt: item.scheduledAt.slice(0, 16),
      durationMinutes: String(item.durationMinutes ?? 60),
      notes: item.notes ?? '',
      extraDates: [] as Array<{ date: string; time: string }>,
    })
  }

  function startInlineEdit(item: ScheduleItem) {
    setAddingForDay(null)
    setEditing(item)
    const d = item.durationMinutes ?? 60
    setForm({
      isFreeSlot: item.studentId == null,
      studentId: item.studentId != null ? String(item.studentId) : '',
      subject: SUBJECTS.includes(item.subject) ? item.subject : SUBJECTS[0],
      scheduledAt: item.scheduledAt.slice(0, 16),
      durationMinutes: DURATION_OPTIONS.includes(d as 45 | 60 | 90) ? String(d) : '60',
      notes: item.notes ?? '',
      extraDates: [] as Array<{ date: string; time: string }>,
    })
    setInlineEditId(item.id)
  }

  async function saveInlineEdit() {
    if (!editing) return
    const body = {
      studentId: form.isFreeSlot ? null : (form.studentId ? Number(form.studentId) : null),
      subject: form.subject,
      scheduledAt: form.scheduledAt.slice(0, 19),
      durationMinutes: Number(form.durationMinutes) || 60,
      notes: form.notes || null,
    }
    const res = await fetch(`/api/admin/schedule/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setInlineEditId(null)
      setEditing(null)
      load()
    }
  }

  function startInlineAdd(day: Date) {
    setInlineEditId(null)
    setEditing(null)
    const dayStr = format(day, 'yyyy-MM-dd')
    setAddingForDay(dayStr)
    setForm({
      isFreeSlot: false,
      studentId: students[0]?.id ? String(students[0].id) : '',
      subject: SUBJECTS[0],
      scheduledAt: format(setMinutes(setHours(day, 10), 0), "yyyy-MM-dd'T'HH:mm"),
      durationMinutes: '60',
      notes: '',
      extraDates: [],
    })
  }

  async function saveInlineAdd() {
    const duration = Number(form.durationMinutes) || 60
    const scheduledAt = form.scheduledAt.slice(0, 19)
    const body = {
      studentId: form.isFreeSlot ? null : (form.studentId ? Number(form.studentId) : null),
      subject: form.subject,
      durationMinutes: duration,
      notes: form.notes || null,
    }
    const res = await fetch('/api/admin/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, scheduledAt }),
    })
    if (res.ok) {
      setAddingForDay(null)
      resetForm()
      load()
    }
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

  async function addTemplateSlot(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/schedule/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dayOfWeek: templateForm.dayOfWeek,
        time: templateForm.time.slice(0, 5),
        subject: templateForm.subject,
        durationMinutes: Number(templateForm.durationMinutes) || 60,
        studentId: templateForm.isFreeSlot || !templateForm.studentId ? null : Number(templateForm.studentId),
      }),
    })
    if (res.ok) {
      setShowTemplateForm(false)
      setTemplateForm({ dayOfWeek: 1, time: '10:00', subject: SUBJECTS[0], durationMinutes: '60', studentId: '', isFreeSlot: true })
      load()
    }
  }

  async function deleteTemplate(id: number) {
    if (!confirm('Удалить слот из шаблона?')) return
    const res = await fetch(`/api/admin/schedule/templates/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  async function applyTemplateToWeek() {
    const weekStartStr = format(weekStart, 'yyyy-MM-dd')
    const res = await fetch('/api/admin/schedule/apply-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekStart: weekStartStr }),
    })
    if (res.ok) load()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="animate-pulse rounded-lg bg-muted h-8 w-48" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Шаблон недели — первый блок на странице */}
      <Card id="schedule-template" className="overflow-hidden border-2 border-primary/20 shadow-md bg-card">
        <CardContent className="p-0">
          <button
            type="button"
            onClick={() => setTemplateCollapsed((c) => !c)}
            className="w-full flex items-center justify-between gap-2 p-4 text-left hover:bg-muted/30 transition-colors rounded-t-lg"
          >
            <h2 className="text-xl font-semibold">Шаблон недели</h2>
            <span className="text-sm text-muted-foreground">
              {templates.length > 0 ? `Слотов: ${templates.length}` : 'Нет слотов'}
            </span>
            {templateCollapsed ? (
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
            )}
          </button>
          {!templateCollapsed && (
          <div className="px-4 pb-4 pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            Настройте типовое расписание по дням (Пн–Вс). Ниже — календарь выбранной недели, где можно редактировать конкретные даты и нажать «Применить шаблон к неделе».
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-border/80">
                  {DAY_NAMES.map((_, i) => (
                    <th key={i} className="p-2 text-center min-w-[120px] border-r border-border/60 last:border-r-0 bg-muted/40 text-muted-foreground text-sm font-medium">
                      {DAY_NAMES[i]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[1, 2, 3, 4, 5, 6, 7].map((dow) => {
                    const dayTemplates = getTemplatesForDay(templates, dow)
                    return (
                      <td key={dow} className="align-top p-2 min-h-[100px] border-r border-border/50 last:border-r-0">
                        <div className="flex flex-col gap-1.5">
                          {dayTemplates.map((t) => (
                            <div
                              key={t.id}
                              className="group flex items-start justify-between gap-1 rounded-md border bg-card px-2 py-1.5 text-left shadow-sm"
                            >
                              <div className="min-w-0 flex-1">
                                <span className="font-mono text-xs font-semibold tabular-nums">{t.time}</span>
                                <div className="text-xs font-medium truncate">{t.subject}</div>
                                <div className="text-[11px] text-muted-foreground truncate">
                                  {t.studentId == null ? 'Свободно' : studentName(t.studentId)}
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                                onClick={() => deleteTemplate(t.id)}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          {showTemplateForm ? (
            <form onSubmit={addTemplateSlot} className="mt-4 p-4 rounded-lg border bg-muted/30 space-y-3 max-w-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <Label className="text-xs">День недели</Label>
                  <select
                    value={templateForm.dayOfWeek}
                    onChange={(e) => setTemplateForm((f) => ({ ...f, dayOfWeek: Number(e.target.value) }))}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2"
                  >
                    {DAY_NAMES.map((name, i) => (
                      <option key={i} value={i + 1}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Время</Label>
                  <Input
                    type="time"
                    value={templateForm.time}
                    onChange={(e) => setTemplateForm((f) => ({ ...f, time: e.target.value }))}
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Предмет</Label>
                  <select
                    value={templateForm.subject}
                    onChange={(e) => setTemplateForm((f) => ({ ...f, subject: e.target.value }))}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Длительность</Label>
                  <select
                    value={templateForm.durationMinutes}
                    onChange={(e) => setTemplateForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2"
                  >
                    {DURATION_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m} мин</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="template-free"
                  checked={templateForm.isFreeSlot}
                  onChange={(e) => setTemplateForm((f) => ({ ...f, isFreeSlot: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="template-free" className="text-sm">Свободное окно</label>
              </div>
              {!templateForm.isFreeSlot && (
                <div>
                  <Label className="text-xs">Ученик</Label>
                  <select
                    value={templateForm.studentId}
                    onChange={(e) => setTemplateForm((f) => ({ ...f, studentId: e.target.value }))}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex gap-2">
                <Button type="submit" size="sm">Добавить в шаблон</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowTemplateForm(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          ) : (
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowTemplateForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Добавить слот в шаблон
            </Button>
          )}
          </div>
          )}
        </CardContent>
      </Card>

      {/* Текущая неделя */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Текущая неделя</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center justify-center gap-1 rounded-lg bg-muted/60 p-1 w-fit">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-4 py-2 min-w-[200px] text-center tabular-nums">
            {format(weekDays[0], 'd MMM', { locale: ru })} – {format(weekDays[6], 'd MMM yyyy', { locale: ru })}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-md"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => startInlineAdd(today)} className="shadow-sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить занятие
          </Button>
          <Button variant="outline" onClick={applyTemplateToWeek} disabled={templates.length === 0} title={templates.length === 0 ? 'Сначала добавьте слоты в шаблон недели' : 'Создать занятия на выбранную неделю по шаблону'}>
            Применить шаблон к неделе
          </Button>
        </div>

        <Dialog open={assignSlotId != null} onOpenChange={(open) => !open && setAssignSlotId(null)}>
          <DialogContent className="max-w-sm rounded-xl">
            <DialogHeader>
              <DialogTitle>Назначить ученика на слот</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              <div>
                <Label>Ученик</Label>
                <select
                  value={assignStudentId}
                  onChange={(e) => setAssignStudentId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAssignStudent} disabled={!assignStudentId}>
                  Назначить
                </Button>
                <Button variant="outline" onClick={() => setAssignSlotId(null)}>
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>

        <Card className="overflow-hidden border shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border/80">
                  {weekDays.map((day) => {
                  const isToday = isSameDay(day, today)
                  return (
                    <th
                      key={day.toISOString()}
                      className={`p-3 text-center min-w-[140px] border-r border-border/60 last:border-r-0 ${
                        isToday
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      <div className="text-[11px] font-medium uppercase tracking-wider">
                        {format(day, 'EEE', { locale: ru })}
                      </div>
                      <div
                        className={`mt-0.5 text-base font-semibold tabular-nums ${
                          isToday ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {format(day, 'd')}
                      </div>
                      {isToday && (
                        <div className="text-[10px] text-primary/80 font-medium mt-0.5">сегодня</div>
                      )}
                    </th>
                  )
                })}
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
                      className={`align-top p-2 min-h-[280px] border-r border-border/50 last:border-r-0 transition-colors ${
                        isToday ? 'bg-primary/[0.03]' : 'bg-background'
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, day)}
                    >
                      <div className="flex flex-col gap-2">
                        {dayItems.map((item) => (
                          inlineEditId === item.id ? (
                            <div
                              key={item.id}
                              className="rounded-lg border-2 border-primary/40 bg-card px-3 py-2.5 space-y-2 shadow-sm"
                            >
                              <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 items-center text-sm">
                                <span className="text-muted-foreground">Время</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground text-xs tabular-nums">
                                    {form.scheduledAt ? format(new Date(form.scheduledAt), 'd MMM yyyy', { locale: ru }) : '—'}
                                  </span>
                                  <Input
                                    type="time"
                                    value={(form.scheduledAt && form.scheduledAt.length >= 16) ? form.scheduledAt.slice(11, 16) : '10:00'}
                                    onChange={(e) => setForm((f) => ({ ...f, scheduledAt: (f.scheduledAt?.slice(0, 11) || '1970-01-01T') + e.target.value + ':00' }))}
                                    className="h-8 text-sm w-28"
                                  />
                                </div>
                                <span className="text-muted-foreground">Предмет</span>
                                <select
                                  value={form.subject}
                                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                                >
                                  {SUBJECTS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                <span className="text-muted-foreground">Ученик</span>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`free-${item.id}`}
                                    checked={form.isFreeSlot}
                                    onChange={(e) => setForm((f) => ({ ...f, isFreeSlot: e.target.checked }))}
                                    className="rounded"
                                  />
                                  <label htmlFor={`free-${item.id}`} className="text-xs">Свободно</label>
                                  {!form.isFreeSlot && (
                                    <select
                                      value={form.studentId}
                                      onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                                      className="h-8 flex-1 min-w-0 rounded-md border border-input bg-background px-2 text-sm"
                                    >
                                      {students.map((s) => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                                <span className="text-muted-foreground">Длительность</span>
                                <div className="flex gap-3">
                                  {DURATION_OPTIONS.map((min) => (
                                    <label key={min} className="flex items-center gap-1.5 cursor-pointer text-sm">
                                      <input
                                        type="radio"
                                        name="duration-edit"
                                        checked={form.durationMinutes === String(min)}
                                        onChange={() => setForm((f) => ({ ...f, durationMinutes: String(min) }))}
                                        className="rounded-full"
                                      />
                                      {min} мин
                                    </label>
                                  ))}
                                </div>
                                <span className="text-muted-foreground">Заметки</span>
                                <Input
                                  value={form.notes}
                                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                  className="h-8 text-sm"
                                  placeholder="—"
                                />
                              </div>
                              <div className="flex gap-1.5 pt-1">
                                <Button size="sm" className="h-7 text-xs" onClick={saveInlineEdit}>
                                  Сохранить
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setInlineEditId(null); setEditing(null) }}>
                                  Отмена
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, item.id)}
                              onDragEnd={() => setDraggingId(null)}
                              className={`group flex items-start justify-between gap-2 rounded-lg border bg-card px-3 py-2.5 text-left shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-primary/30 ${
                                item.studentId == null ? 'border-dashed border-emerald-400/50 bg-emerald-50/70 dark:bg-emerald-950/30' : ''
                              } ${draggingId === item.id ? 'opacity-40 scale-[0.98]' : ''}`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="inline-flex items-center rounded-md bg-muted px-2 py-1 font-mono text-base font-semibold text-foreground tabular-nums">
                                  {format(new Date(item.scheduledAt), 'HH:mm', { locale: ru })}
                                </div>
                                <div className="font-semibold text-sm mt-1 truncate">{item.subject}</div>
                                <div className="text-xs text-muted-foreground truncate mt-0.5">
                                  {studentName(item.studentId)}
                                </div>
                                {[45, 90].includes(item.durationMinutes ?? 60) && (
                                  <div className="text-[11px] text-muted-foreground mt-0.5">
                                    {item.durationMinutes} мин
                                  </div>
                                )}
                              </div>
                              <div className="flex shrink-0 gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.studentId != null && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-primary"
                                    title="Войти в урок"
                                    asChild
                                  >
                                    <Link href={`/lesson/room/${item.studentId}`}>
                                      <Video className="h-3.5 w-3.5" />
                                    </Link>
                                  </Button>
                                )}
                                {item.studentId == null && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    title="Назначить ученика"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setAssignSlotId(item.id)
                                      setAssignStudentId(students[0]?.id ? String(students[0].id) : '')
                                    }}
                                  >
                                    <UserPlus className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  title="Редактировать"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startInlineEdit(item)
                                  }}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(item.id)
                                  }}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          )
                        ))}
                        {addingForDay === format(day, 'yyyy-MM-dd') ? (
                          <div className="rounded-lg border-2 border-primary/40 bg-card px-3 py-2.5 space-y-2 shadow-sm">
                            <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1.5 items-center text-sm">
                              <span className="text-muted-foreground">Время</span>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-xs tabular-nums">
                                  {format(day, 'd MMM yyyy', { locale: ru })}
                                </span>
                                <Input
                                  type="time"
                                  value={(form.scheduledAt && form.scheduledAt.length >= 16) ? form.scheduledAt.slice(11, 16) : '10:00'}
                                  onChange={(e) => setForm((f) => ({ ...f, scheduledAt: (f.scheduledAt?.slice(0, 11) || format(day, "yyyy-MM-dd'T")) + e.target.value + ':00' }))}
                                  className="h-8 text-sm w-28"
                                />
                              </div>
                              <span className="text-muted-foreground">Предмет</span>
                              <select
                                value={form.subject}
                                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                              >
                                {SUBJECTS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <span className="text-muted-foreground">Ученик</span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`add-free-${day.toISOString()}`}
                                  checked={form.isFreeSlot}
                                  onChange={(e) => setForm((f) => ({ ...f, isFreeSlot: e.target.checked }))}
                                  className="rounded"
                                />
                                <label htmlFor={`add-free-${day.toISOString()}`} className="text-xs">Свободно</label>
                                {!form.isFreeSlot && (
                                  <select
                                    value={form.studentId}
                                    onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                                    className="h-8 flex-1 min-w-0 rounded-md border border-input bg-background px-2 text-sm"
                                  >
                                    {students.map((s) => (
                                      <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                              <span className="text-muted-foreground">Длительность</span>
                              <div className="flex gap-3">
                                {DURATION_OPTIONS.map((min) => (
                                  <label key={min} className="flex items-center gap-1.5 cursor-pointer text-sm">
                                    <input
                                      type="radio"
                                      name="duration-add"
                                      checked={form.durationMinutes === String(min)}
                                      onChange={() => setForm((f) => ({ ...f, durationMinutes: String(min) }))}
                                      className="rounded-full"
                                    />
                                    {min} мин
                                  </label>
                                ))}
                              </div>
                              <span className="text-muted-foreground">Заметки</span>
                              <Input
                                value={form.notes}
                                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                className="h-8 text-sm"
                                placeholder="—"
                              />
                            </div>
                            <div className="flex gap-1.5 pt-1">
                              <Button size="sm" className="h-7 text-xs" onClick={saveInlineAdd}>
                                Сохранить
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => { setAddingForDay(null); resetForm() }}>
                                Отмена
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="flex items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-muted-foreground/25 py-3 text-sm text-muted-foreground hover:bg-muted/50 hover:border-primary/40 hover:text-primary transition-colors min-h-[52px]"
                            onClick={() => startInlineAdd(day)}
                          >
                            <PlusCircle className="h-4 w-4" />
                            Добавить
                          </button>
                        )}
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
    </div>
  )
}
