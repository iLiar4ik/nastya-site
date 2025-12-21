"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ru } from "date-fns/locale/ru"

export default function PaymentPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    fetchPayments()
  }, [filter])

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/payments?status=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setPayments(data)
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "overdue":
        return "text-red-600"
      default:
        return ""
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Оплачено"
      case "pending":
        return "Ожидает оплаты"
      case "overdue":
        return "Просрочено"
      default:
        return status
    }
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const paidAmount = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Оплата</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="paid">Оплачено</SelectItem>
            <SelectItem value="pending">Ожидает оплаты</SelectItem>
            <SelectItem value="overdue">Просрочено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Всего платежей</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{payments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Общая сумма</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalAmount.toLocaleString()} ₽</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Оплачено</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{paidAmount.toLocaleString()} ₽</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список платежей</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ученик</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Срок оплаты</TableHead>
                <TableHead>Дата оплаты</TableHead>
                <TableHead>Описание</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Нет платежей
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.student?.user?.name || payment.student?.user?.email}</TableCell>
                    <TableCell>{payment.amount.toLocaleString()} ₽</TableCell>
                    <TableCell className={getStatusColor(payment.status)}>
                      {getStatusLabel(payment.status)}
                    </TableCell>
                    <TableCell>
                      {payment.dueDate ? format(new Date(payment.dueDate), "d MMM yyyy", { locale: ru }) : "-"}
                    </TableCell>
                    <TableCell>
                      {payment.paidDate ? format(new Date(payment.paidDate), "d MMM yyyy", { locale: ru }) : "-"}
                    </TableCell>
                    <TableCell>{payment.description || "-"}</TableCell>
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

