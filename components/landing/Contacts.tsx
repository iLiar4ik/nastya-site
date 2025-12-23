"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacts" className="container py-24 md:py-32">
      <div className="flex flex-col items-center space-y-4 text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Контакты
        </h2>
        <p className="max-w-[700px] text-muted-foreground text-lg">
          Свяжитесь со мной для записи на пробный урок или задайте вопрос
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Форма обратной связи</CardTitle>
            <CardDescription>
              Заполните форму, и я свяжусь с вами в ближайшее время
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  placeholder="Ваше сообщение"
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>
              {submitStatus === "success" && (
                <p className="text-sm text-green-600">
                  Сообщение отправлено! Я свяжусь с вами в ближайшее время.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-sm text-red-600">
                  Произошла ошибка. Попробуйте еще раз или свяжитесь напрямую.
                </p>
              )}
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Отправка..." : "Отправить"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
            <CardDescription>
              Свяжитесь со мной удобным для вас способом
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <a
                href="mailto:teacher@example.com"
                className="text-primary hover:underline"
              >
                teacher@example.com
              </a>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Телефон</h3>
              <a
                href="tel:+79991234567"
                className="text-primary hover:underline"
              >
                +7 (999) 123-45-67
              </a>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Telegram</h3>
              <a
                href="https://t.me/teacher_math"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @teacher_math
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


