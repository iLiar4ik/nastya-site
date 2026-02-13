// components/dashboard/TestCreator.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Question, QuestionType, Test } from '@/lib/mock-data/tests';

const initialQuestion: Question = {
    id: uuidv4(),
    type: 'single-choice',
    text: '',
    options: [''],
    correctAnswers: [],
};

const QuestionEditor = ({ question, onUpdate, onDelete }: { question: Question, onUpdate: (q: Question) => void, onDelete: (id: string) => void }) => {
    
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...question.options];
        newOptions[index] = value;
        onUpdate({ ...question, options: newOptions });
    };

    const addOption = () => {
        onUpdate({ ...question, options: [...question.options, ''] });
    };

    const removeOption = (index: number) => {
        const newOptions = question.options.filter((_, i) => i !== index);
        onUpdate({ ...question, options: newOptions });
    };

    const handleCorrectAnswerChange = (option: string, type: QuestionType) => {
        if (type === 'single-choice') {
            onUpdate({ ...question, correctAnswers: [option] });
        } else { // multiple-choice
            const newAnswers = question.correctAnswers.includes(option)
                ? question.correctAnswers.filter(a => a !== option)
                : [...question.correctAnswers, option];
            onUpdate({ ...question, correctAnswers: newAnswers });
        }
    };

    return (
        <Card className="bg-muted/50">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Вопрос</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => onDelete(question.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Текст вопроса</Label>
                    <Textarea value={question.text} onChange={e => onUpdate({...question, text: e.target.value})} placeholder="Например: Чему равно 2+2?" />
                </div>
                <div>
                    <Label>Тип вопроса</Label>
                    <Select value={question.type} onValueChange={(value: QuestionType) => onUpdate({...question, type: value, correctAnswers: []})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="single-choice">Одиночный выбор</SelectItem>
                            <SelectItem value="multiple-choice">Множественный выбор</SelectItem>
                            <SelectItem value="text-input">Ввод текста</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {question.type !== 'text-input' && (
                    <div>
                        <Label>Варианты ответов</Label>
                        <div className="space-y-2">
                        {question.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {question.type === 'single-choice' && (
                                    <RadioGroup value={question.correctAnswers[0]} onValueChange={(value) => handleCorrectAnswerChange(value, 'single-choice')}>
                                        <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                                    </RadioGroup>
                                )}
                                {question.type === 'multiple-choice' && (
                                    <Checkbox checked={question.correctAnswers.includes(option)} onCheckedChange={() => handleCorrectAnswerChange(option, 'multiple-choice')} />
                                )}
                                <Input value={option} onChange={e => handleOptionChange(index, e.target.value)} />
                                <Button variant="ghost" size="icon" onClick={() => removeOption(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        </div>
                        <Button variant="outline" size="sm" className="mt-2" onClick={addOption}>Добавить вариант</Button>
                    </div>
                )}
                 {question.type === 'text-input' && (
                    <div>
                        <Label>Правильный ответ (текст)</Label>
                        <Input value={question.correctAnswers[0] || ''} onChange={e => onUpdate({...question, correctAnswers: [e.target.value]})} />
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}

export function TestCreator() {
    const [test, setTest] = useState<Partial<Test>>({
        title: '',
        description: '',
        questions: [initialQuestion],
    });

    const addQuestion = () => {
        setTest(prev => ({ ...prev, questions: [...(prev.questions || []), { ...initialQuestion, id: uuidv4() }] }));
    };

    const updateQuestion = (updatedQ: Question) => {
        setTest(prev => ({
            ...prev,
            questions: (prev.questions || []).map(q => q.id === updatedQ.id ? updatedQ : q),
        }));
    };

    const deleteQuestion = (id: string) => {
        setTest(prev => ({
            ...prev,
            questions: (prev.questions || []).filter(q => q.id !== id),
        }));
    };

    const handleSaveTest = () => {
        console.log("Saving test:", test);
        // Add API call here in the future
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Основная информация</CardTitle>
                    <CardDescription>Задайте название, описание и другие параметры теста.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Название теста</Label>
                        <Input id="title" value={test.title} onChange={e => setTest(p => ({...p, title: e.target.value}))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Описание</Label>
                        <Input id="description" value={test.description} onChange={e => setTest(p => ({...p, description: e.target.value}))} />
                    </div>
                     <div className="space-y-2">
                        <Label>Предмет</Label>
                        <Select onValueChange={(value) => setTest(p => ({...p, subject: value as Test['subject']}))}>
                            <SelectTrigger><SelectValue placeholder="Выберите предмет" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Алгебра">Алгебра</SelectItem>
                                <SelectItem value="Геометрия">Геометрия</SelectItem>
                                <SelectItem value="Математика">Математика</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="topic">Тема</Label>
                        <Input id="topic" value={test.topic} onChange={e => setTest(p => ({...p, topic: e.target.value}))} />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Вопросы</h2>
                {(test.questions || []).map((q) => (
                    <QuestionEditor key={q.id} question={q} onUpdate={updateQuestion} onDelete={deleteQuestion} />
                ))}
            </div>

            <div className="flex justify-between">
                <Button variant="outline" onClick={addQuestion}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Добавить вопрос
                </Button>
                <Button onClick={handleSaveTest}>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить тест
                </Button>
            </div>
        </div>
    );
}
