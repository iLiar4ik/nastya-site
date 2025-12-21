"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"

export default function MaterialsPage() {
  const { data: session } = useSession()
  const [materials, setMaterials] = useState<any[]>([])

  useEffect(() => {
    if (session) {
      fetchMaterials()
    }
  }, [session])

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/materials")
      if (res.ok) {
        const data = await res.json()
        setMaterials(data)
      }
    } catch (error) {
      console.error("Error fetching materials:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Папка материалы</h2>

      <Card>
        <CardHeader>
          <CardTitle>Учебные материалы</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Дата добавления</TableHead>
                <TableHead>Файл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Нет материалов
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell>{material.description || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(material.createdAt), "d MMM yyyy", { locale: ru })}
                    </TableCell>
                    <TableCell>
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        Открыть <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

