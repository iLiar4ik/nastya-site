'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, Send, Plus, Trash2, FileText, MessageSquare, BookOpen, PlusCircle, Video, Link2, Check } from 'lucide-react'
import Link from 'next/link'
import { format, isValid } from 'date-fns'
import { ru } from 'date-fns/locale'

function formatDate(dateString: string | null | undefined, formatStr: string): string {
  if (!dateString || dateString.trim() === '') return '—'
  try {
    const date = new Date(dateString)
    if (!isValid(date) || isNaN(date.getTime())) return '—'
    return format(date, formatStr, { locale: ru })
  } catch {
    return '—'
  }
}

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

type Material = {
  id: number
  title: string
  type: string
  category: string | null
  subject: string | null
  topic: string | null
  fileUrl: string | null
  content: string | null
  tags?: string[]
}

type Message = {
  id: number
  fromUserId: number | null
  toStudentId: number
  content: string
  isRead: number
  createdAt: string
}

type Homework = {
  id: number
  title: string
  dueDate: string
  status: string
  grade: number | null
  teacherComment: string | null
  instructions: string | null
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Активное',
  review: 'На проверке',
  checked: 'Проверено',
  overdue: 'Просрочено',
}

export function StudentProfile({ studentId }: { studentId: number }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [allMaterials, setAllMaterials] = useState<Material[]>([])
  const [studentMaterials, setStudentMaterials] = useState<Material[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [homework, setHomework] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('')
  const [activeTab, setActiveTab] = useState('info')
  const chatBottomRef = useRef<HTMLDivElement>(null)
  const [homeworkFormOpen, setHomeworkFormOpen] = useState(false)
  const [homeworkForm, setHomeworkForm] = useState({ title: '', dueDate: '', instructions: '' })
  const [homeworkAttachmentFile, setHomeworkAttachmentFile] = useState<File | null>(null)
  const [homeworkUploading, setHomeworkUploading] = useState(false)
  const [lessonLinkCopied, setLessonLinkCopied] = useState(false)

  useEffect(() => {
    loadData()
  }, [studentId])

  useEffect(() => {
    if (activeTab === 'chat' && messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeTab, messages.length])

  async function loadData() {
    setLoading(true)
    try {
      const [studentRes, materialsRes, studentMaterialsRes, messagesRes, homeworkRes] = await Promise.allSettled([
        fetch(`/api/admin/students/${studentId}`),
        fetch('/api/admin/materials'),
        fetch(`/api/admin/students/${studentId}/materials`),
        fetch(`/api/admin/students/${studentId}/messages`),
        fetch(`/api/admin/students/${studentId}/homework`),
      ])

      // Handle student data
      if (studentRes.status === 'fulfilled' && studentRes.value.ok) {
        const data = await studentRes.value.json()
        setStudent(data)
        console.log('Student loaded:', data)
      } else {
        console.error('Failed to load student:', studentRes)
      }

      // Handle all materials
      if (materialsRes.status === 'fulfilled' && materialsRes.value.ok) {
        const data = await materialsRes.value.json()
        setAllMaterials(Array.isArray(data) ? data : [])
        console.log('All materials loaded:', data.length)
      } else {
        console.error('Failed to load all materials:', materialsRes)
      }

      // Handle student materials
      if (studentMaterialsRes.status === 'fulfilled' && studentMaterialsRes.value.ok) {
        const data = await studentMaterialsRes.value.json()
        setStudentMaterials(Array.isArray(data) ? data : [])
        console.log('Student materials loaded:', data.length)
      } else {
        console.error('Failed to load student materials:', studentMaterialsRes)
        setStudentMaterials([])
      }

      // Handle messages (API normalizes createdAt; show all messages, formatDate handles invalid dates)
      if (messagesRes.status === 'fulfilled' && messagesRes.value.ok) {
        const msgs = await messagesRes.value.json()
        const list = Array.isArray(msgs) ? msgs : []
        setMessages(list.reverse()) // API returns desc, reverse to show oldest first
      } else {
        console.error('Failed to load messages:', messagesRes)
        setMessages([])
      }

      // Handle homework
      if (homeworkRes.status === 'fulfilled' && homeworkRes.value.ok) {
        const hw = await homeworkRes.value.json()
        // Filter out homework with invalid dates
        const validHw = Array.isArray(hw) ? hw.filter((h: Homework) => {
          if (!h.dueDate) return false
          const date = new Date(h.dueDate)
          return isValid(date) && !isNaN(date.getTime())
        }) : []
        setHomework(validHw)
        console.log('Homework loaded:', validHw.length)
      } else {
        console.error('Failed to load homework:', homeworkRes)
        setHomework([])
      }
    } catch (e) {
      console.error('Load error:', e)
    }
    setLoading(false)
  }

  async function handleAddHomework(e: React.FormEvent) {
    e.preventDefault()
    if (!homeworkForm.title.trim() || !homeworkForm.dueDate) return
    let attachmentFileId: number | null = null
    if (homeworkAttachmentFile) {
      setHomeworkUploading(true)
      const fd = new FormData()
      fd.append('file', homeworkAttachmentFile)
      const up = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      setHomeworkUploading(false)
      if (up.ok) {
        const m = await up.json()
        attachmentFileId = m.id
      }
    }
    const res = await fetch('/api/admin/homework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        title: homeworkForm.title.trim(),
        dueDate: homeworkForm.dueDate,
        instructions: homeworkForm.instructions || null,
        attachmentFileId,
      }),
    })
    if (res.ok) {
      setHomeworkFormOpen(false)
      setHomeworkForm({ title: '', dueDate: '', instructions: '' })
      setHomeworkAttachmentFile(null)
      loadData()
    }
  }

  async function handleAddMaterial() {
    if (!selectedMaterialId) return
    try {
      const res = await fetch(`/api/admin/students/${studentId}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: parseInt(selectedMaterialId, 10) }),
      })
      if (res.ok) {
        setSelectedMaterialId('')
        await loadData()
      } else {
        const err = await res.json().catch(() => ({ error: 'Неизвестная ошибка' }))
        console.error('Failed to add material:', res.status, err)
        alert(err.error || 'Ошибка добавления материала')
      }
    } catch (e) {
      console.error('Error adding material:', e)
      alert('Ошибка при добавлении материала. Проверьте подключение.')
    }
  }

  async function handleRemoveMaterial(materialId: number) {
    if (!confirm('Удалить доступ к этому материалу?')) return
    try {
      const res = await fetch(`/api/admin/students/${studentId}/materials?materialId=${materialId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await loadData()
      } else {
        const err = await res.json().catch(() => ({ error: 'Неизвестная ошибка' }))
        console.error('Failed to remove material:', res.status, err)
        alert(err.error || 'Ошибка удаления материала')
      }
    } catch (e) {
      console.error('Error removing material:', e)
      alert('Ошибка при удалении материала. Проверьте подключение.')
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim()) return
    const messageContent = newMessage.trim()
    setNewMessage('') // Clear immediately for better UX
    
    try {
      const res = await fetch(`/api/admin/students/${studentId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageContent }),
      })
      if (res.ok) {
        const sentMessage = await res.json()
        console.log('Message sent:', sentMessage)
        // Reload all messages to ensure consistency and proper ordering
        try {
          const messagesRes = await fetch(`/api/admin/students/${studentId}/messages`)
          if (messagesRes.ok) {
            const msgs = await messagesRes.json()
            const list = Array.isArray(msgs) ? msgs : []
            setMessages(list.reverse())
            setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
          } else {
            console.error('Failed to reload messages:', messagesRes.status)
            // Fallback: add message manually if reload fails
            setMessages((prev) => [...prev, sentMessage])
          }
        } catch (e) {
          console.error('Failed to reload messages:', e)
          // Fallback: add message manually if reload fails
          setMessages((prev) => [...prev, sentMessage])
        }
      } else {
        const err = await res.json().catch(() => ({ error: 'Неизвестная ошибка' }))
        console.error('Failed to send message:', res.status, err)
        setNewMessage(messageContent) // Restore on error
        alert(err.error || 'Ошибка отправки сообщения')
      }
    } catch (e) {
      console.error('Error sending message:', e)
      setNewMessage(messageContent) // Restore on error
      alert('Ошибка при отправке сообщения. Проверьте подключение.')
    }
  }

  if (loading) return <p className="p-4">Загрузка...</p>
  if (!student) return <p className="p-4">Ученик не найден</p>

  const availableMaterials = allMaterials.filter(
    (m) => !studentMaterials.some((sm) => sm.id === m.id)
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link href="/admin/students">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold">{student.name}</h1>
          {student.class && <p className="text-muted-foreground">{student.class}</p>}
          {student.subjects && student.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {student.subjects.map((subject) => (
                <Badge key={subject} variant="secondary">
                  {subject}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="default" className="gap-2" onClick={() => {
            const url = typeof window !== 'undefined' ? `${window.location.origin}/lesson/room/${studentId}` : ''
            if (url) {
              navigator.clipboard.writeText(url).then(() => {
                setLessonLinkCopied(true)
                setTimeout(() => setLessonLinkCopied(false), 2000)
              }, () => {})
            }
          }}>
            {lessonLinkCopied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
            {lessonLinkCopied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
          </Button>
          <Button asChild size="default" className="gap-2">
            <Link href={`/lesson/room/${studentId}`}>
              <Video className="h-4 w-4" />
              Войти в урок
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="materials">Материалы</TabsTrigger>
          <TabsTrigger value="chat">Чат</TabsTrigger>
          <TabsTrigger value="homework">Домашние задания</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Посещаемость</Label>
                  <p className="text-2xl font-bold">{student.attendance ?? 0}%</p>
                </div>
                <div>
                  <Label>Средний балл</Label>
                  <p className="text-2xl font-bold">
                    {student.avgTestScore ? student.avgTestScore.toFixed(1) : '—'}
                  </p>
                </div>
                <div>
                  <Label>Прогресс курса</Label>
                  <p className="text-2xl font-bold">{student.courseProgress ?? 0}%</p>
                </div>
                <div>
                  <Label>Код доступа</Label>
                  <p className="text-lg font-mono">{student.accessCode || 'Не установлен'}</p>
                </div>
              </div>
              {student.notes && (
                <div>
                  <Label>Заметки</Label>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{student.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Доступные материалы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {availableMaterials.length === 0 ? (
                  <div className="flex-1 p-2 text-sm text-muted-foreground border rounded-md">
                    Нет доступных материалов для добавления
                  </div>
                ) : (
                  <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Выберите материал" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMaterials.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.title} {m.subject && `(${m.subject})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button onClick={handleAddMaterial} disabled={!selectedMaterialId || availableMaterials.length === 0}>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              </div>

              {studentMaterials.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  У ученика нет доступа к материалам
                </p>
              ) : (
                <div className="space-y-2">
                  {studentMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{material.title}</span>
                          {material.subject && (
                            <Badge variant="outline">{material.subject}</Badge>
                          )}
                          {material.type && (
                            <Badge variant="secondary" className="text-xs">
                              {material.type}
                            </Badge>
                          )}
                        </div>
                        {material.topic && (
                          <p className="text-sm text-muted-foreground mt-1">{material.topic}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMaterial(material.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card className="flex flex-col h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Чат с учеником
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Нет сообщений. Начните общение!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm ${
                          msg.fromUserId
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span
                          className={`text-xs ${
                            msg.fromUserId
                              ? 'text-primary-foreground/80'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {formatDate(msg.createdAt, 'dd.MM.yyyy HH:mm')}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={chatBottomRef} />
                </div>
              </ScrollArea>
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1 min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Домашние задания
              </CardTitle>
              <Button size="sm" onClick={() => setHomeworkFormOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Добавить ДЗ
              </Button>
            </CardHeader>
            <CardContent>
              <Dialog open={homeworkFormOpen} onOpenChange={setHomeworkFormOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новое домашнее задание</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddHomework} className="space-y-4 pt-2">
                    <div>
                      <Label>Название *</Label>
                      <Input
                        value={homeworkForm.title}
                        onChange={(e) => setHomeworkForm((f) => ({ ...f, title: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Срок сдачи *</Label>
                      <Input
                        type="date"
                        value={homeworkForm.dueDate}
                        onChange={(e) => setHomeworkForm((f) => ({ ...f, dueDate: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Инструкция</Label>
                      <Textarea
                        value={homeworkForm.instructions}
                        onChange={(e) => setHomeworkForm((f) => ({ ...f, instructions: e.target.value }))}
                        className="mt-1 min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label>Файл задания</Label>
                      <Input
                        type="file"
                        onChange={(e) => setHomeworkAttachmentFile(e.target.files?.[0] ?? null)}
                        className="mt-1"
                      />
                      {homeworkAttachmentFile && (
                        <p className="text-sm text-muted-foreground mt-1">{homeworkAttachmentFile.name}</p>
                      )}
                      {homeworkUploading && <p className="text-sm text-muted-foreground">загрузка...</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={homeworkUploading}>Добавить</Button>
                      <Button type="button" variant="outline" onClick={() => setHomeworkFormOpen(false)}>Отмена</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              {homework.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  У ученика нет домашних заданий
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Срок сдачи</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Оценка</TableHead>
                      <TableHead>Комментарий</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {homework.map((hw) => (
                      <TableRow key={hw.id}>
                        <TableCell className="font-medium">{hw.title}</TableCell>
                        <TableCell>
                          {formatDate(hw.dueDate, 'dd.MM.yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{STATUS_LABELS[hw.status] || hw.status}</Badge>
                        </TableCell>
                        <TableCell>{hw.grade ?? '—'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {hw.teacherComment || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
