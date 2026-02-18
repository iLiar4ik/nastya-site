"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function AuthPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/student/login-by-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Неверный код доступа");
        return;
      }
      router.push("/student/dashboard");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Вход в личный кабинет
              </CardTitle>
              <CardDescription className="text-base">
                Введите код доступа, который вам дал учитель
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginByCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access-code">Код доступа</Label>
                  <Input
                    id="access-code"
                    type="text"
                    placeholder="Введите код"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  disabled={loading}
                >
                  {loading ? "Вход..." : "Войти"}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Вернуться на главную
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
