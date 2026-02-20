'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Clock, CheckCircle, AlertCircle, FileQuestion, Star, Upload } from 'lucide-react'

type HomeworkItem = {
  id: number
  title: string
  dueDate: string
  status: string
  grade?: number | null
  teacherComment?: string | null
  instructions?: string | null
}

const statusMap: Record<string, { icon: React.ReactNode; color: string }> = {
  'Активные': { icon: <Clock className="h-4 w-4" />, color: 'text-blue-500' },
  'На проверке': { icon: <FileQuestion className="h-4 w-4" />, color: 'text-yellow-500' },
  'Проверенные': { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-500' },
  'Просроченные': { icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-500' },
}

const statusOrder = ['Активные', 'На проверке', 'Проверенные', 'Просроченные']

function HomeworkCard({ hw, onRefresh, onOpenSubmit }: { hw: HomeworkItem; onRefresh: () => void; onOpenSubmit: (id: number) => void }) {
  const statusInfo = statusMap[hw.status] ?? { icon: null, color: '' }
  const canSubmit = hw.status === 'Активные' || hw.status === 'Просроченные'
  return (
    <Card className="hover:bg-muted/50 transition-colors flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{hw.title}</CardTitle>
          <Badge variant="outline" className={statusInfo.color}>
            {statusInfo.icon}
            <span className="ml-2">{hw.status}</span>
          </Badge>
        </div>
        <CardDescription>Срок сдачи: {hw.dueDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {hw.instructions && (
          <p className="text-sm text-muted-foreground mb-2">{hw.instructions}</p>
        )}
        {hw.status === 'Проверенные' && hw.grade != null && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200">
            <Star className="h-5 w-5" />
            <div>
              <p className="font-semibold">Оценка: {hw.grade}/10</p>
              {hw.teacherComment && <p className="text-xs">{hw.teacherComment}</p>}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {canSubmit ? (
          <Button className="w-full" onClick={() => onOpenSubmit(hw.id)}>
            <Upload className="h-4 w-4 mr-2" />
            Сдать задание
          </Button>
        ) : (
          <Button variant="outline" className="w-full" asChild>
            <span>Посмотреть</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function StudentHomework() {
  const [list, setList] = useState<HomeworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitId, setSubmitId] = useState<number | null>(null)
  const [submitComment, setSubmitComment] = useState('')
  const [submitFile, setSubmitFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function refresh() {
    fetch('/api/student/homework')
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
  }

  useEffect(() => {
    fetch('/api/student/homework')
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit() {
    if (!submitId) return
    setSubmitting(true)
    let submissionFileId: number | null = null
    if (submitFile) {
      const fd = new FormData()
      fd.append('file', submitFile)
      const up = await fetch('/api/student/upload', { method: 'POST', body: fd })
      if (up.ok) {
        const m = await up.json()
        submissionFileId = m.id
      }
    }
    const res = await fetch(`/api/student/homework/${submitId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionContent: submitComment || null, submissionFileId }),
    })
    setSubmitting(false)
    if (res.ok) {
      setSubmitId(null)
      setSubmitComment('')
      setSubmitFile(null)
      refresh()
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error || 'Ошибка отправки')
    }
  }

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>

  return (
    <>
      <Tabs defaultValue="Активные" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {statusOrder.map((status) => (
            <TabsTrigger key={status} value={status}>
              {statusMap[status]?.icon}
              <span className="ml-2">{status}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {statusOrder.map((status) => {
          const items = list.filter((hw) => hw.status === status)
          return (
            <TabsContent key={status} value={status}>
              <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {items.map((hw) => (
                  <HomeworkCard key={hw.id} hw={hw} onRefresh={refresh} onOpenSubmit={setSubmitId} />
                ))}
              </div>
              {items.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <p>Нет домашних заданий в этом статусе.</p>
                </div>
              )}
            </TabsContent>
          )
        })}
      </Tabs>

      <Dialog open={submitId != null} onOpenChange={(open) => !open && setSubmitId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сдать задание</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Комментарий (необязательно)</Label>
              <Textarea
                value={submitComment}
                onChange={(e) => setSubmitComment(e.target.value)}
                className="mt-1 min-h-[80px]"
                placeholder="Текст ответа или комментарий..."
              />
            </div>
            <div>
              <Label>Файл (необязательно)</Label>
              <Input
                type="file"
                onChange={(e) => setSubmitFile(e.target.files?.[0] ?? null)}
                className="mt-1"
              />
              {submitFile && <p className="text-sm text-muted-foreground mt-1">{submitFile.name}</p>}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Отправка...' : 'Отправить'}
              </Button>
              <Button variant="outline" onClick={() => setSubmitId(null)}>Отмена</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
