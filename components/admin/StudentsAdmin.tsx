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

type Student = {
  id: number
  name: string
  class: string | null
  email: string | null
  phone: string | null
  attendance: number | null
  avgTestScore: number | null
  courseProgress: number | null
  notes: string | null
  subjects: string[]
}

export function StudentsAdmin() {
  const [students, setStudents] = useState<Student[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form, setForm] = useState({ name: '', class: '', email: '', phone: '', subjects: '' })
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
      name: form.name,
      class: form.class || null,
      email: form.email || null,
      phone: form.phone || null,
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
      setForm({ name: '', class: '', email: '', phone: '', subjects: '' })
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
      name: s.name,
      class: s.class ?? '',
      email: s.email ?? '',
      phone: s.phone ?? '',
      subjects: Array.isArray(s.subjects) ? s.subjects.join(', ') : '',
    })
    setOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setForm({ name: '', class: '', email: '', phone: '', subjects: '' })
    setOpen(true)
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
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <Label>Класс</Label>
              <Input value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} placeholder="9 А" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <Label>Телефон</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
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
                <div>
                  <p className="font-semibold">{s.name}</p>
                  {s.class && <p className="text-sm text-muted-foreground">{s.class}</p>}
                  {s.email && <p className="text-sm text-muted-foreground">{s.email}</p>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
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
