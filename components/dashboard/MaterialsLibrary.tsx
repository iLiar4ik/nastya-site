// components/dashboard/MaterialsLibrary.tsx
"use client";

import { useState } from 'react';
import { materials, Material } from '@/lib/mock-data/materials';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Video, Image as ImageIcon, File, StickyNote, Link as LinkIcon, MoreVertical, Send, Download, Trash2, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const iconMap = {
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  doc: <File className="h-5 w-5 text-blue-500" />,
  image: <ImageIcon className="h-5 w-5 text-green-500" />,
  video: <Video className="h-5 w-5 text-purple-500" />,
  link: <LinkIcon className="h-5 w-5 text-orange-500" />,
  note: <StickyNote className="h-5 w-5 text-yellow-500" />,
};

const tagColorMap: { [key: string]: string } = {
  домашка: 'bg-blue-100 text-blue-800',
  тест: 'bg-green-100 text-green-800',
  конспект: 'bg-yellow-100 text-yellow-800',
  видео: 'bg-purple-100 text-purple-800',
  формулы: 'bg-indigo-100 text-indigo-800',
  ОГЭ: 'bg-pink-100 text-pink-800',
  ЕГЭ: 'bg-red-100 text-red-800',
};


export function MaterialsLibrary() {
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials);
  
  // Create categories for the filter tree
  const categories = [...new Set(materials.map(m => m.category))];
  const subjectsByCategory: { [key: string]: string[] } = {};
  categories.forEach(cat => {
    subjectsByCategory[cat] = [...new Set(materials.filter(m => m.category === cat).map(m => m.subject))];
  });

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
      {/* Left Sidebar - Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Категории</CardTitle>
          <CardDescription>Фильтр по темам</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['8 класс']}>
            {categories.map(category => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger>{category}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col items-start gap-2 pl-2">
                    {subjectsByCategory[category].map(subject => (
                      <Button key={subject} variant="link" className="p-0 h-auto text-muted-foreground hover:text-primary">
                        {subject}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Right Content - Materials List */}
      <div className="flex flex-col gap-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Поиск по названию и тегам..." className="pl-10" />
        </div>
        
        <div className="flex flex-col gap-4">
            {filteredMaterials.map(material => (
                <Card key={material.id} className="flex items-center p-4 transition-all hover:bg-muted/50">
                    <div className="flex-shrink-0 w-8 mr-4">
                        {iconMap[material.type]}
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-semibold">{material.title}</h3>
                        <p className="text-sm text-muted-foreground">
                            {material.category} / {material.subject} / {material.topic}
                        </p>
                        <div className="flex gap-2 mt-2">
                            {material.tags.map(tag => (
                                <Badge key={tag} className={`text-xs ${tagColorMap[tag]}`}>{tag}</Badge>
                            ))}
                        </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem><Send className="w-4 h-4 mr-2" />Отправить ученику</DropdownMenuItem>
                                <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" />Редактировать</DropdownMenuItem>
                                <DropdownMenuItem><Download className="w-4 h-4 mr-2" />Скачать</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500"><Trash2 className="w-4 h-4 mr-2" />Удалить</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
