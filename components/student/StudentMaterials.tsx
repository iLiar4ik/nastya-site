// components/student/StudentMaterials.tsx
"use client";

import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Video, Image as ImageIcon, File, StickyNote, Link as LinkIcon, Download } from 'lucide-react';

type Material = {
  id: number
  title: string
  type: string
  subject: string | null
  topic: string | null
  fileUrl: string | null
  content: string | null
  tags?: string[]
}

function getIcon(type: string) {
  const iconClass = "h-5 w-5"
  switch (type) {
    case 'pdf':
      return <FileText className={`${iconClass} text-red-500`} />
    case 'doc':
      return <File className={`${iconClass} text-blue-500`} />
    case 'image':
      return <ImageIcon className={`${iconClass} text-green-500`} />
    case 'video':
      return <Video className={`${iconClass} text-purple-500`} />
    case 'link':
      return <LinkIcon className={`${iconClass} text-orange-500`} />
    case 'note':
      return <StickyNote className={`${iconClass} text-yellow-500`} />
    default:
      return <FileText className={`${iconClass} text-gray-500`} />
  }
}

export function StudentMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/student/materials')
        if (res.ok) {
          const data = await res.json()
          console.log('Materials loaded:', data)
          setMaterials(Array.isArray(data) ? data : [])
        } else {
          const error = await res.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Failed to load materials:', res.status, error)
        }
      } catch (e) {
        console.error('Failed to load materials:', e)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <Card><CardContent className="p-6">Загрузка материалов...</CardContent></Card>
  }

  if (materials.length === 0) {
    return <Card><CardContent className="p-6 text-center text-muted-foreground">У вас пока нет доступных материалов</CardContent></Card>
  }

  // Group materials by subject and then by topic for accordion structure
  const materialsBySubject: { [subject: string]: { [topic: string]: Material[] } } = {};
  materials.forEach(material => {
    const subject = material.subject || 'Без предмета'
    const topic = material.topic || 'Без темы'
    if (!materialsBySubject[subject]) {
      materialsBySubject[subject] = {};
    }
    if (!materialsBySubject[subject][topic]) {
      materialsBySubject[subject][topic] = [];
    }
    materialsBySubject[subject][topic].push(material);
  });

  return (
    <Card>
        <CardContent className="p-6">
            <Accordion type="multiple" className="w-full">
                {Object.entries(materialsBySubject).map(([subject, topics]) => (
                    <AccordionItem key={subject} value={subject}>
                        <AccordionTrigger className="text-xl font-semibold">{subject}</AccordionTrigger>
                        <AccordionContent>
                            <Accordion type="multiple" className="w-full space-y-2 pl-4">
                                {Object.entries(topics).map(([topic, topicMaterials]) => (
                                    <AccordionItem key={topic} value={topic}>
                                        <AccordionTrigger>{topic}</AccordionTrigger>
                                        <AccordionContent className="space-y-3 pt-3 pl-4">
                                            {topicMaterials.map(material => (
                                                <div key={material.id} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50">
                                                    <div className="flex items-center gap-3">
                                                        {getIcon(material.type)}
                                                        <span className="font-medium">{material.title}</span>
                                                    </div>
                                                    {material.fileUrl && (
                                                      <a href={material.fileUrl} download target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                                      </a>
                                                    )}
                                                    {material.type === 'note' && material.content && (
                                                      <div className="text-sm text-muted-foreground">{material.content}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    </Card>
  );
}
