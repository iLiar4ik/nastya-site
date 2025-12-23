"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Payment {
  id?: string;
  studentId: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  paidAt?: string | null;
  notes?: string | null;
}

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment | null;
  students: Array<{ id: string; user: { name: string | null; email: string } }>;
  onSave: (payment: Payment) => Promise<void>;
}

export function PaymentModal({
  open,
  onOpenChange,
  payment,
  students,
  onSave,
}: PaymentModalProps) {
  const [formData, setFormData] = useState<Omit<Payment, 'notes'> & { notes: string }>({
    studentId: "",
    amount: 0,
    status: "pending",
    dueDate: "",
    paidAt: null,
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (payment) {
      setFormData({
        studentId: payment.studentId,
        amount: payment.amount,
        status: payment.status,
        dueDate: payment.dueDate
          ? new Date(payment.dueDate).toISOString().slice(0, 16)
          : "",
        paidAt: payment.paidAt
          ? new Date(payment.paidAt).toISOString().slice(0, 16)
          : null,
        notes: payment.notes || "",
      });
    } else {
      setFormData({
        studentId: "",
        amount: 0,
        status: "pending",
        dueDate: "",
        paidAt: null,
        notes: "",
      });
    }
  }, [payment, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const paymentData: Payment = {
        ...(payment?.id && { id: payment.id }),
        studentId: formData.studentId,
        amount: formData.amount,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
        paidAt: formData.paidAt ? new Date(formData.paidAt).toISOString() : null,
        notes: formData.notes || null,
      };

      await onSave(paymentData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {payment?.id ? "Редактировать платеж" : "Создать платеж"}
          </DialogTitle>
          <DialogDescription>
            Заполните информацию о платеже
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Ученик</Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, studentId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ученика" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.user.name || student.user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Сумма (₽)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Срок оплаты</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "paid" | "overdue") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидается</SelectItem>
                  <SelectItem value="paid">Оплачено</SelectItem>
                  <SelectItem value="overdue">Просрочено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.status === "paid" && (
              <div className="grid gap-2">
                <Label htmlFor="paidAt">Дата оплаты</Label>
                <Input
                  id="paidAt"
                  type="datetime-local"
                  value={formData.paidAt || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paidAt: e.target.value || null,
                    })
                  }
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                value={String(formData.notes ?? "")}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


