// components/student/StudentChat.tsx
"use client";

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isValid } from 'date-fns';
import { ru } from 'date-fns/locale';

type Message = {
  id: number
  fromUserId: number | null
  toStudentId: number
  content: string
  isRead: number
  createdAt: string
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString || dateString.trim() === '') return '—'
  try {
    const date = new Date(dateString)
    if (!isValid(date) || isNaN(date.getTime())) return '—'
    return format(date, 'dd.MM.yyyy HH:mm', { locale: ru })
  } catch {
    return '—'
  }
}

export function StudentChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function loadMessages() {
        try {
          const res = await fetch('/api/student/messages')
          if (res.ok) {
            const data = await res.json()
            setMessages(data)
          }
        } catch (e) {
          console.error('Failed to load messages:', e)
        }
        setLoading(false)
      }
      loadMessages()
    }, [])

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
          const res = await fetch('/api/student/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newMessage.trim() }),
          })
          if (res.ok) {
            const sentMessage = await res.json()
            setMessages([...messages, sentMessage])
            setNewMessage('')
          }
        } catch (e) {
          console.error('Failed to send message:', e)
        }
    };

    return (
        <Card className="h-[calc(100vh-8rem)] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src="/image/main.png" alt="Teacher" />
                        <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium leading-none">Анастасия (Учитель)</p>
                        <p className="text-sm text-muted-foreground">онлайн</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <p className="text-center text-muted-foreground">Загрузка сообщений...</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">Нет сообщений. Начните общение!</p>
                ) : (
                  messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex w-max max-w-[75%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
                            message.fromUserId === null
                                ? "ml-auto bg-primary text-primary-foreground"
                                : "bg-muted"
                        )}
                    >
                        <p>{message.content}</p>
                        <span className={cn(
                            "text-xs",
                             message.fromUserId === null ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                            {formatDate(message.createdAt)}
                        </span>
                    </div>
                  ))
                )}
            </CardContent>
            <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center space-x-2">
                    <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Напишите сообщение..."
                        className="flex-1 resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Отправить</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
