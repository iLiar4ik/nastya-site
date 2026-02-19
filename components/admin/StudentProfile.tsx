'use client'

import { useEffect, useState } from 'react'
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
import { ArrowLeft, Send, Plus, Trash2, FileText, MessageSquare, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { format, isValid } from 'date-fns'
import { ru } from 'date-fns/locale'

function formatDate(dateString: string | null | undefined, formatStr: string): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (!isValid(date)) return '—'
  try {
    return format(date, formatStr, { locale: ru })
  } catch {
    return '—'
  }
}

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

  useEffect(() => {
    loadData()
  }, [studentId])

  async function loadData() {
    setLoading(true)
    try {
      const [studentRes, materialsRes, studentMaterialsRes, messagesRes, homeworkRes] = await Promise.all([
        fetch(`/api/admin/students/${studentId}`),
        fetch('/api/admin/materials'),
        fetch(`/api/admin/students/${studentId}/materials`),
        fetch(`/api/admin/students/${studentId}/messages`),
        fetch(`/api/admin/students/${studentId}/homework`),
      ])

      if (studentRes.ok) setStudent(await studentRes.json())
      if (materialsRes.ok) setAllMaterials(await materialsRes.json())
      if (studentMaterialsRes.ok) setStudentMaterials(await studentMaterialsRes.json())
      if (messagesRes.ok) {
        const msgs = await messagesRes.json()
        setMessages(msgs.reverse()) // Show oldest first
      }
      if (homeworkRes.ok) setHomework(await homeworkRes.json())
    } catch (e) {
      console.error('Load error:', e)
    }
    setLoading(false)
  }

  async function handleAddMaterial() {
    if (!selectedMaterialId) return
    const res = await fetch(`/api/admin/students/${studentId}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materialId: parseInt(selectedMaterialId, 10) }),
    })
    if (res.ok) {
      setSelectedMaterialId('')
      loadData()
    } else {
      const err = await res.json()
      alert(err.error || 'Ошибка добавления материала')
    }
  }

  async function handleRemoveMaterial(materialId: number) {
    if (!confirm('Удалить доступ к этому материалу?')) return
    const res = await fetch(`/api/admin/students/${studentId}/materials?materialId=${materialId}`, {
      method: 'DELETE',
    })
    if (res.ok) loadData()
  }

  async function handleSendMessage() {
    if (!newMessage.trim()) return
    const res = await fetch(`/api/admin/students/${studentId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage.trim() }),
    })
    if (res.ok) {
      setNewMessage('')
      loadData()
    }
  }

  if (loading) return <p className="p-4">Загрузка...</p>
  if (!student) return <p className="p-4">Ученик не найден</p>

  const availableMaterials = allMaterials.filter(
    (m) => !studentMaterials.some((sm) => sm.id === m.id)
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/students">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{student.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          {student.class && <p className="text-muted-foreground">{student.class}</p>}
          {student.email && <p className="text-sm text-muted-foreground">{student.email}</p>}
          {student.phone && <p className="text-sm text-muted-foreground">{student.phone}</p>}
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
      </div>

      <Tabs defaultValue="info" className="w-full">
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
                <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Выберите материал" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMaterials.length === 0 ? (
                      <SelectItem value="" disabled>
                        Нет доступных материалов
                      </SelectItem>
                    ) : (
                      availableMaterials.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.title} {m.subject && `(${m.subject})`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddMaterial} disabled={!selectedMaterialId}>
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Домашние задания
              </CardTitle>
            </CardHeader>
            <CardContent>
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
