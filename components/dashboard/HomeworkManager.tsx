// components/dashboard/HomeworkManager.tsx
"use client";

import { useState, ReactNode } from 'react';
import { homeworks, Homework, HomeworkStatus } from '@/lib/mock-data/homework';
import { students } from '@/lib/mock-data/students';
import { materials } from '@/lib/mock-data/materials';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, FileQuestion, PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';

// ... (statusMap and HomeworkCard remain the same)

const statusMap: { [key in HomeworkStatus]: { icon: ReactNode; color: string; label: string } } = {
  'Активные': { icon: <Clock className="h-4 w-4" />, color: 'text-blue-500', label: 'Активные' },
  'На проверке': { icon: <FileQuestion className="h-4 w-4" />, color: 'text-yellow-500', label: 'На проверке' },
  'Проверенные': { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-500', label: 'Проверенные' },
  'Просроченные': { icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-500', label: 'Просроченные' },
};

const HomeworkCard = ({ hw }: { hw: Homework }) => {
  const statusInfo = statusMap[hw.status];
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{hw.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={hw.studentAvatar} alt={hw.studentName} />
                <AvatarFallback>{hw.studentName.charAt(0)}</AvatarFallback>
              </Avatar>
              {hw.studentName}
            </CardDescription>
          </div>
          <Badge variant="outline" className={statusInfo.color}>
            {statusInfo.icon}
            <span className="ml-2">{statusInfo.label}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
            <span>Срок сдачи:</span>
            <span>{hw.dueDate}</span>
        </div>
        {hw.submittedDate && (
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Сдано:</span>
                <span>{hw.submittedDate}</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-lg font-bold">
            {hw.grade ? `Оценка: ${hw.grade}/10` : ''}
        </div>
        <Button asChild>
          <Link href="/dashboard/homework/review">{hw.status === 'На проверке' ? 'Проверить' : 'Подробнее'}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};


function DatePicker({ date, setDate }: { date?: Date, setDate: (date?: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Выберите дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}


export function HomeworkManager() {
  const statuses: HomeworkStatus[] = ['Активные', 'На проверке', 'Проверенные', 'Просроченные'];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHw, setNewHw] = useState<{studentId?: string, materialId?: string, deadline?: Date, instructions?: string}>({});

  const handleCreateHomework = () => {
    console.log("Creating new homework:", newHw);
    // Here you would typically handle form submission, e.g., call an API
    setIsDialogOpen(false); // Close dialog on save
    setNewHw({}); // Reset form
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Создать ДЗ
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                <DialogTitle>Новое домашнее задание</DialogTitle>
                <DialogDescription>
                    Выберите ученика, материал и установите срок сдачи.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="student" className="text-right">Ученик</Label>
                        <Select onValueChange={(value) => setNewHw(p => ({ ...p, studentId: value }))}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Выберите ученика" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="material" className="text-right">Материал</Label>
                        <Select onValueChange={(value) => setNewHw(p => ({ ...p, materialId: value }))}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Выберите материал из библиотеки" />
                            </SelectTrigger>
                            <SelectContent>
                                {materials.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">Срок сдачи</Label>
                        <div className="col-span-3">
                            <DatePicker date={newHw.deadline} setDate={(date) => setNewHw(p => ({ ...p, deadline: date }))} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="instructions" className="text-right">Инструкции</Label>
                        <Textarea 
                            id="instructions" 
                            className="col-span-3" 
                            placeholder="Например: 'Решить все четные номера'"
                            onChange={(e) => setNewHw(p => ({ ...p, instructions: e.target.value }))}
                        />
                    </div>
                </div>
                <DialogFooter>
                <Button type="submit" onClick={handleCreateHomework}>Сохранить и отправить</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
        <Tabs defaultValue="Активные" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            {statuses.map(status => (
            <TabsTrigger key={status} value={status}>
                {statusMap[status].icon}
                <span className="ml-2">{status}</span>
            </TabsTrigger>
            ))}
        </TabsList>
        
        {statuses.map(status => (
            <TabsContent key={status} value={status}>
                <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                    {homeworks.filter(hw => hw.status === status).map(hw => (
                        <HomeworkCard key={hw.id} hw={hw} />
                    ))}
                </div>
                {homeworks.filter(hw => hw.status === status).length === 0 && (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>Нет домашних заданий в этом статусе.</p>
                    </div>
                )}
            </TabsContent>
        ))}
        </Tabs>
    </div>
  );
}
