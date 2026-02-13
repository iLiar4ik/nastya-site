// components/student/StudentMaterials.tsx
"use client";

import { materials } from '@/lib/mock-data/materials';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Video, Image as ImageIcon, File, StickyNote, Link as LinkIcon, Download } from 'lucide-react';

const iconMap = {
  pdf: <FileText className="h-5 w-5 text-red-500" />,
  doc: <File className="h-5 w-5 text-blue-500" />,
  image: <ImageIcon className="h-5 w-5 text-green-500" />,
  video: <Video className="h-5 w-5 text-purple-500" />,
  link: <LinkIcon className="h-5 w-5 text-orange-500" />,
  note: <StickyNote className="h-5 w-5 text-yellow-500" />,
};

export function StudentMaterials() {
  // Group materials by subject and then by topic for accordion structure
  const materialsBySubject: { [subject: string]: { [topic: string]: typeof materials } } = {};
  materials.forEach(material => {
    if (!materialsBySubject[material.subject]) {
      materialsBySubject[material.subject] = {};
    }
    if (!materialsBySubject[material.subject][material.topic]) {
      materialsBySubject[material.subject][material.topic] = [];
    }
    materialsBySubject[material.subject][material.topic].push(material);
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
                                                        {iconMap[material.type]}
                                                        <span className="font-medium">{material.title}</span>
                                                    </div>
                                                    <a href={material.fileUrl || '#'} download target="_blank" rel="noopener noreferrer">
                                                        <Download className="h-5 w-5 text-muted-foreground hover:text-primary" />
                                                    </a>
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
