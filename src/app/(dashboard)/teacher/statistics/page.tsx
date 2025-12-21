"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const res = await fetch("/api/statistics")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    }
  }

  if (!stats) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Статистика</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Всего учеников</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalStudents || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Занятий в этом месяце</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.lessonsThisMonth || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Средняя посещаемость</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.avgAttendance || 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ожидающие оплаты</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pendingPayments || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активность по месяцам</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">График активности будет здесь</p>
        </CardContent>
      </Card>
    </div>
  )
}

