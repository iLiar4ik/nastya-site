'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

const TYPES = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'Документ' },
  { value: 'image', label: 'Изображение' },
  { value: 'video', label: 'Видео' },
  { value: 'link', label: 'Ссылка' },
  { value: 'note', label: 'Заметка' },
]

export function MaterialsAdmin() {
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', type: 'pdf', fileUrl: '', content: '' })

  async function load() {
    const res = await fetch('/api/admin/materials')
    if (res.ok) setMaterials(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        type: form.type,
        fileUrl: form.type === 'link' ? form.fileUrl : null,
        content: form.type === 'note' ? form.content : null,
      }),
    })
    if (res.ok) {
      setForm({ title: '', type: 'pdf', fileUrl: '', content: '' })
      load()
    }
  }

  if (loading) return <p>Загрузка...</p>

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <Label>Название *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <Label>Тип</Label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            {form.type === 'link' && (
              <div>
                <Label>URL</Label>
                <Input value={form.fileUrl} onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))} />
              </div>
            )}
            {form.type === 'note' && (
              <div>
                <Label>Содержимое</Label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            )}
            <Button type="submit"><PlusCircle className="h-4 w-4 mr-2" />Добавить</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-2">
        {materials.map((m) => (
          <Card key={m.id}>
            <CardContent className="pt-4">
              <p className="font-semibold">{m.title}</p>
              <p className="text-sm text-muted-foreground">{m.type} • {m.subject || m.category || '—'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
