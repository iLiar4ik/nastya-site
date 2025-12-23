"use client";

import { useState, useEffect } from "react";
import { PaymentTable } from "@/components/payments/PaymentTable";
import { PaymentModal } from "@/components/payments/PaymentModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
  dueDate: string;
  paidAt?: string | null;
  notes?: string | null;
  student: {
    user: {
      name: string | null;
      email: string;
    };
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredPayments(payments);
  }, [payments]);

  const fetchData = async () => {
    try {
      const [paymentsRes, studentsRes] = await Promise.all([
        fetch("/api/payments"),
        fetch("/api/students"),
      ]);

      const paymentsData = await paymentsRes.json();
      const studentsData = await studentsRes.json();

      setPayments(paymentsData);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(
        payments.filter((p) => p.status === status)
      );
    }
  };

  const handleSavePayment = async (paymentData: any) => {
    try {
      const url = paymentData.id
        ? `/api/payments/${paymentData.id}`
        : "/api/payments";
      const method = paymentData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Failed to save payment");
      }

      await fetchData();
    } catch (error) {
      console.error("Error saving payment:", error);
      throw error;
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот платеж?")) return;

    try {
      const response = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Оплата</h1>
          <p className="text-muted-foreground">
            Управление платежами учеников
          </p>
        </div>
        <Button onClick={() => {
          setSelectedPayment(null);
          setIsModalOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Новый платеж
        </Button>
      </div>

      <PaymentTable
        payments={filteredPayments}
        onEdit={(payment) => {
          setSelectedPayment(payment);
          setIsModalOpen(true);
        }}
        onDelete={handleDeletePayment}
        onStatusFilterChange={handleStatusFilter}
      />

      <PaymentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        payment={selectedPayment}
        students={students}
        onSave={handleSavePayment}
      />
    </div>
  );
}


