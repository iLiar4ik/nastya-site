"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: Date;
  paidAt?: Date | null;
  notes?: string | null;
  student: {
    user: {
      name: string | null;
      email: string;
    };
  };
}

interface PaymentTableProps {
  payments: Payment[];
  onEdit: (payment: Payment) => void;
  onDelete: (id: string) => void;
  onStatusFilterChange: (status: string) => void;
}

const statusLabels = {
  pending: "Ожидается",
  paid: "Оплачено",
  overdue: "Просрочено",
};

const statusColors = {
  pending: "bg-yellow-500",
  paid: "bg-green-500",
  overdue: "bg-red-500",
};

export function PaymentTable({
  payments,
  onEdit,
  onDelete,
  onStatusFilterChange,
}: PaymentTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Платежи</h2>
        <Select onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидается</SelectItem>
            <SelectItem value="paid">Оплачено</SelectItem>
            <SelectItem value="overdue">Просрочено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Нет платежей
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ученик</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Срок оплаты</TableHead>
              <TableHead>Дата оплаты</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Заметки</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {payment.student.user.name || payment.student.user.email}
                </TableCell>
                <TableCell className="font-medium">
                  {payment.amount}₽
                </TableCell>
                <TableCell>
                  {format(new Date(payment.dueDate), "d MMM yyyy", {
                    locale: ru,
                  })}
                </TableCell>
                <TableCell>
                  {payment.paidAt
                    ? format(new Date(payment.paidAt), "d MMM yyyy", {
                        locale: ru,
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[payment.status]}>
                    {statusLabels[payment.status]}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {payment.notes || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(payment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(payment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}


