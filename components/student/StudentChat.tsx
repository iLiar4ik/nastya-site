// components/student/StudentChat.tsx
"use client";

import { useState } from 'react';
import { chatHistory, Message } from '@/lib/mock-data/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StudentChat() {
    const [messages, setMessages] = useState<Message[]>(chatHistory);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message: Message = {
            id: `msg${messages.length + 1}`,
            sender: 'student',
            text: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
        };
        setMessages([...messages, message]);
        setNewMessage('');
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
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                            message.sender === 'student'
                                ? "ml-auto bg-primary text-primary-foreground"
                                : "bg-muted"
                        )}
                    >
                        {message.text}
                        <span className={cn(
                            "text-xs self-end",
                             message.sender === 'student' ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                            {message.timestamp}
                        </span>
                    </div>
                ))}
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
                    <Button>
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Прикрепить</span>
                    </Button>
                    <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Отправить</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
