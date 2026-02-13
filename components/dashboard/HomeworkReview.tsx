// components/dashboard/HomeworkReview.tsx
"use client";

import { useState } from 'react';
import { homeworks, Homework } from '@/lib/mock-data/homework';
import { students } from '@/lib/mock-data/students'; // To get student full details if needed
import { materials } from '@/lib/mock-data/materials'; // To get material details if needed
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, XCircle, Download, FileText, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


// Placeholder for a single homework for review
// In a real app, this would be fetched dynamically by ID
const mockHomeworkId = 'hw-1'; // Example homework to review
const homeworkToReview: Homework | undefined = homeworks.find(hw => hw.id === mockHomeworkId);

export function HomeworkReview() {
  const [grade, setGrade] = useState<number | undefined>(homeworkToReview?.grade);
  const [teacherComment, setTeacherComment] = useState<string>(homeworkToReview?.teacherComment || '');
  const [isGraded, setIsGraded] = useState(false);

  if (!homeworkToReview) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Домашнее задание не найдено.</p>
        <Link href="/dashboard/homework">
          <Button variant="link" className="mt-4">Вернуться к списку ДЗ</Button>
        </Link>
      </div>
    );
  }

  const handleSaveReview = (status: 'accepted' | 'returned') => {
    console.log("Saving homework review:", {
      homeworkId: homeworkToReview.id,
      grade,
      teacherComment,
      status,
    });
    setIsGraded(true); // Simulate grading
    // In a real app, this would update the backend and potentially navigate away
  };

  const renderSubmission = () => {
    if (!homeworkToReview.studentSubmission) {
      return <p className="text-muted-foreground">Ученик еще не сдал работу.</p>;
    }

    switch (homeworkToReview.studentSubmission.type) {
      case 'text':
        return (
          <Textarea 
            value={homeworkToReview.studentSubmission.content} 
            readOnly 
            rows={10} 
            className="w-full bg-background resize-none" 
          />
        );
      case 'image':
        return (
          <div className="relative w-full h-64 overflow-hidden rounded-md border bg-muted">
            <Image 
              src={homeworkToReview.studentSubmission.content} 
              alt="Student submission" 
              fill 
              style={{ objectFit: 'contain' }}
              className="p-2"
            />
          </div>
        );
      case 'file':
        return (
          <a 
            href={homeworkToReview.studentSubmission.content} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <FileText className="h-5 w-5" /> Скачать файл работы
            <Download className="h-4 w-4" />
          </a>
        );
      default:
        return <p className="text-muted-foreground">Тип сдачи работы не поддерживается.</p>;
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className='flex items-center gap-4'>
            <Link href="/dashboard/homework">
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-3xl font-bold">{homeworkToReview.title}</h1>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={homeworkToReview.studentAvatar} alt={homeworkToReview.studentName} />
                        <AvatarFallback>{homeworkToReview.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {homeworkToReview.studentName}
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Срок сдачи: {homeworkToReview.dueDate}</span>
                    {homeworkToReview.submittedDate && <span> | Сдано: {homeworkToReview.submittedDate}</span>}
                </div>
            </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Student Submission */}
        <Card>
          <CardHeader>
            <CardTitle>Работа ученика</CardTitle>
          </CardHeader>
          <CardContent>
            {renderSubmission()}
            {homeworkToReview.studentComment && (
              <div className="mt-4 p-3 border rounded-md bg-muted">
                <p className="text-sm font-semibold mb-1">Комментарий ученика:</p>
                <p className="text-muted-foreground text-sm">{homeworkToReview.studentComment}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Teacher Review */}
        <Card>
          <CardHeader>
            <CardTitle>Ваша проверка</CardTitle>
            {homeworkToReview.status === 'Проверенные' && (
              <CardDescription>Задание уже проверено.</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="grade">Оценка (0-10)</Label>
              <Input 
                id="grade" 
                type="number" 
                min="0" 
                max="10" 
                value={grade || ''} 
                onChange={e => setGrade(parseInt(e.target.value))} 
                disabled={homeworkToReview.status === 'Проверенные' || isGraded}
              />
            </div>
            <div>
              <Label htmlFor="teacherComment">Комментарий учителя</Label>
              <Textarea 
                id="teacherComment" 
                value={teacherComment} 
                onChange={e => setTeacherComment(e.target.value)} 
                placeholder="Оставьте свой комментарий..." 
                rows={5}
                disabled={homeworkToReview.status === 'Проверенные' || isGraded}
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => handleSaveReview('returned')} 
              disabled={homeworkToReview.status === 'Проверенные' || isGraded}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Вернуть на доработку
            </Button>
            <Button 
              onClick={() => handleSaveReview('accepted')} 
              disabled={homeworkToReview.status === 'Проверенные' || isGraded}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Принять
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
