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

type TestItem = {
  id: number
  title: string
  description: string | null
  subject: string
  topic: string | null
  timeLimitMinutes: number | null
  passThreshold: number | null
}

export function TestsAdmin() {
  const [items, setItems] = useState<TestItem[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TestItem | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    topic: '',
    timeLimitMinutes: '0',
    passThreshold: '75',
    questions: '[]',
  })
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/admin/tests')
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let questions: unknown[] = []
    try {
      questions = JSON.parse(form.questions || '[]')
    } catch {
      questions = []
    }
    const url = editing ? `/api/admin/tests/${editing.id}` : '/api/admin/tests'
    const body = {
      title: form.title,
      description: form.description || null,
      subject: form.subject,
      topic: form.topic || null,
      timeLimitMinutes: Number(form.timeLimitMinutes) || 0,
      passThreshold: Number(form.passThreshold) || 75,
      questions,
    }
    const res = await fetch(url, {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setOpen(false)
      setEditing(null)
      setForm({
        title: '',
        description: '',
        subject: '',
        topic: '',
        timeLimitMinutes: '0',
        passThreshold: '75',
        questions: '[]',
      })
      load()
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить тест?')) return
    const res = await fetch(`/api/admin/tests/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  function openEdit(item: TestItem) {
    setEditing(item)
    setForm({
      title: item.title,
      description: item.description ?? '',
      subject: item.subject,
      topic: item.topic ?? '',
      timeLimitMinutes: String(item.timeLimitMinutes ?? 0),
      passThreshold: String(item.passThreshold ?? 75),
      questions: '[]',
    })
    setOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setForm({
      title: '',
      description: '',
      subject: '',
      topic: '',
      timeLimitMinutes: '0',
      passThreshold: '75',
      questions: '[]',
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
            Добавить тест
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать' : 'Новый тест'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Название *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Описание</Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2"
              />
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
              <Label>Тема</Label>
              <Input
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Время (мин, 0 = без ограничения)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.timeLimitMinutes}
                  onChange={(e) => setForm((f) => ({ ...f, timeLimitMinutes: e.target.value }))}
                />
              </div>
              <div>
                <Label>Порог сдачи (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.passThreshold}
                  onChange={(e) => setForm((f) => ({ ...f, passThreshold: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Вопросы (JSON-массив)</Label>
              <textarea
                value={form.questions}
                onChange={(e) => setForm((f) => ({ ...f, questions: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                placeholder='[{"question":"...","options":["a","b"],"correct":0}]'
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
                <TableHead>Название</TableHead>
                <TableHead>Предмет</TableHead>
                <TableHead>Тема</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Порог %</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.subject}</TableCell>
                  <TableCell>{item.topic ?? '—'}</TableCell>
                  <TableCell>{item.timeLimitMinutes ? `${item.timeLimitMinutes} мин` : '—'}</TableCell>
                  <TableCell>{item.passThreshold ?? 75}%</TableCell>
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
            <p className="text-center py-8 text-muted-foreground">Нет тестов.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
