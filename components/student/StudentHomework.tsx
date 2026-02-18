'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, CheckCircle, AlertCircle, FileQuestion, Star } from 'lucide-react'

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

function HomeworkCard({ hw }: { hw: HomeworkItem }) {
  const statusInfo = statusMap[hw.status] ?? { icon: null, color: '' }
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
        <Button variant="outline" className="w-full" asChild>
          <span>{hw.status === 'Активные' ? 'Начать выполнение' : 'Посмотреть'}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function StudentHomework() {
  const [list, setList] = useState<HomeworkItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/homework')
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-muted-foreground">Загрузка...</p>

  return (
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
                <HomeworkCard key={hw.id} hw={hw} />
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
  )
}
