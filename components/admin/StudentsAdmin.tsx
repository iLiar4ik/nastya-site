'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2, Key, Copy, User } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type Student = {
  id: number
  name: string
  firstName: string | null
  lastName: string | null
  class: string | null
  attendance: number | null
  avgTestScore: number | null
  courseProgress: number | null
  notes: string | null
  accessCode: string | null
  subjects: string[]
}

export function StudentsAdmin() {
  const [students, setStudents] = useState<Student[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', class: '', notes: '', subjects: '' })
  const [loading, setLoading] = useState(true)

  async function load() {
    const res = await fetch('/api/admin/students')
    if (res.ok) setStudents(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const url = editing ? `/api/admin/students/${editing.id}` : '/api/admin/students'
    const body = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      class: form.class || null,
      notes: form.notes.trim() || null,
      subjects: form.subjects ? form.subjects.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
    const res = await fetch(url, {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setOpen(false)
      setEditing(null)
      setForm({ firstName: '', lastName: '', class: '', notes: '', subjects: '' })
      load()
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить ученика?')) return
    const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  function openEdit(s: Student) {
    setEditing(s)
    setForm({
      firstName: s.firstName ?? '',
      lastName: s.lastName ?? '',
      class: s.class ?? '',
      notes: s.notes ?? '',
      subjects: Array.isArray(s.subjects) ? s.subjects.join(', ') : '',
    })
    setOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setForm({ firstName: '', lastName: '', class: '', notes: '', subjects: '' })
    setOpen(true)
  }

  async function generateAccessCode(s: Student) {
    const res = await fetch(`/api/admin/students/${s.id}/access-code`, { method: 'POST' })
    if (res.ok) {
      const { accessCode } = await res.json()
      setStudents((prev) => prev.map((x) => (x.id === s.id ? { ...x, accessCode } : x)))
    }
  }

  function copyCode(s: Student) {
    if (s.accessCode) {
      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth`
      navigator.clipboard.writeText(`${url}\nКод доступа: ${s.accessCode}`)
      // could add toast "Скопировано"
    }
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={openAdd}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить ученика
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать' : 'Новый ученик'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Имя *</Label>
              <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Иван" required />
            </div>
            <div>
              <Label>Фамилия *</Label>
              <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Иванов" required />
            </div>
            <div>
              <Label>Класс</Label>
              <Input value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} placeholder="9 А" />
            </div>
            <div>
              <Label>Доп. информация</Label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Контакт, заметки..."
              />
            </div>
            <div>
              <Label>Предметы (через запятую)</Label>
              <Input value={form.subjects} onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))} placeholder="Алгебра, Геометрия" />
            </div>
            <Button type="submit">{editing ? 'Сохранить' : 'Добавить'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((s) => (
          <Card key={s.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/admin/students/${s.id}`} className="hover:underline">
                    <p className="font-semibold">{s.name}</p>
                  </Link>
                  {s.class && <p className="text-sm text-muted-foreground">{s.class}</p>}
                </div>
                <div className="flex gap-1">
                  <Link href={`/admin/students/${s.id}`}>
                    <Button size="icon" variant="ghost" title="Открыть профиль">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Код доступа:</span>
                {s.accessCode ? (
                  <code className="text-xs bg-muted px-2 py-0.5 rounded">{s.accessCode}</code>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
                <Button size="sm" variant="outline" className="h-7 gap-1" onClick={() => generateAccessCode(s)}>
                  <Key className="h-3 w-3" />
                  {s.accessCode ? 'Обновить' : 'Сгенерировать'}
                </Button>
                {s.accessCode && (
                  <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => copyCode(s)}>
                    <Copy className="h-3 w-3" />
                    Копировать ссылку
                  </Button>
                )}
              </div>
              {Array.isArray(s.subjects) && s.subjects.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">{s.subjects.join(', ')}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
