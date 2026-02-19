'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Pencil, Trash2, Check } from 'lucide-react'
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
  { value: 'pending', label: 'Ожидает' },
  { value: 'paid', label: 'Оплачено' },
  { value: 'overdue', label: 'Просрочено' },
]

type PaymentItem = {
  id: number
  studentId: number
  tariff: string
  amount: number
  status: string
  dueDate: string | null
  paidDate: string | null
  notes: string | null
}

type Student = { id: number; name: string }

export function PaymentsAdmin() {
  const [items, setItems] = useState<PaymentItem[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentItem | null>(null)
  const [form, setForm] = useState({
    studentId: '',
    tariff: '',
    amount: '',
    dueDate: '',
    notes: '',
  })
  const [loading, setLoading] = useState(true)

  async function load() {
    const [sRes, rRes] = await Promise.all([
      fetch('/api/admin/students'),
      fetch('/api/admin/payments'),
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
    const url = editing ? `/api/admin/payments/${editing.id}` : '/api/admin/payments'
    const body = {
      studentId: Number(form.studentId),
      tariff: form.tariff,
      amount: Number(form.amount),
      status: editing?.status ?? 'pending',
      dueDate: form.dueDate || null,
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
      setForm({ studentId: '', tariff: '', amount: '', dueDate: '', notes: '' })
      load()
    }
  }

  async function markPaid(item: PaymentItem) {
    const res = await fetch(`/api/admin/payments/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'paid',
        paidDate: new Date().toISOString().slice(0, 10),
      }),
    })
    if (res.ok) load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Удалить платёж?')) return
    const res = await fetch(`/api/admin/payments/${id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  function openEdit(item: PaymentItem) {
    setEditing(item)
    setForm({
      studentId: String(item.studentId),
      tariff: item.tariff,
      amount: String(item.amount),
      dueDate: item.dueDate?.slice(0, 10) ?? '',
      notes: item.notes ?? '',
    })
    setOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setForm({
      studentId: students[0]?.id ? String(students[0].id) : '',
      tariff: '',
      amount: '',
      dueDate: '',
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
            Добавить платёж
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Редактировать' : 'Новый платёж'}</DialogTitle>
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
              <Label>Тариф *</Label>
              <Input
                value={form.tariff}
                onChange={(e) => setForm((f) => ({ ...f, tariff: e.target.value }))}
                placeholder="Абонемент 8 занятий"
                required
              />
            </div>
            <div>
              <Label>Сумма (₽) *</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label>Срок оплаты</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
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
                <TableHead>Тариф</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Срок</TableHead>
                <TableHead>Оплачено</TableHead>
                <TableHead className="w-[140px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{studentName(item.studentId)}</TableCell>
                  <TableCell>{item.tariff}</TableCell>
                  <TableCell>{item.amount.toLocaleString('ru-RU')} ₽</TableCell>
                  <TableCell>
                    <select
                      value={item.status}
                      onChange={async (e) => {
                        const status = e.target.value
                        await fetch(`/api/admin/payments/${item.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            status,
                            ...(status === 'paid' ? { paidDate: new Date().toISOString().slice(0, 10) } : {}),
                          }),
                        })
                        load()
                      }}
                      className="rounded border bg-background px-2 py-1 text-sm"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>{item.dueDate ?? '—'}</TableCell>
                  <TableCell>{item.paidDate ?? '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {item.status !== 'paid' && (
                        <Button size="sm" variant="outline" onClick={() => markPaid(item)}>
                          <Check className="h-4 w-4 mr-1" />
                          Оплачено
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
            <p className="text-center py-8 text-muted-foreground">Нет платежей.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
