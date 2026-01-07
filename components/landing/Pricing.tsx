"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SectionDivider } from "@/components/ui/section-divider";

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const plans = [
    {
      id: 1,
      title: "Индивидуальное занятие",
      description: "Одно занятие",
      price: "1500₽",
      details: "Разовое занятие продолжительностью 60-90 минут",
      popular: false,
    },
    {
      id: 2,
      title: "Абонемент (4 занятия)",
      description: "Популярный вариант",
      price: "5500₽",
      details: "Экономия 500₽ при покупке абонемента",
      popular: true,
    },
    {
      id: 3,
      title: "Абонемент (8 занятий)",
      description: "Максимальная выгода",
      price: "10000₽",
      details: "Экономия 2000₽ при покупке абонемента",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="container py-20 md:py-32 relative min-h-screen flex flex-col">
      <div ref={ref} className="flex flex-col gap-8 relative z-10 flex-1 justify-center pb-20 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Тарифы
          </h2>
          <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
            Выберите подходящий вариант занятий
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3 mt-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <Card
                className={`relative h-full transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  plan.popular
                    ? "border-primary border-2 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5"
                    : "hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Популярный
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.title}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {plan.price}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.details}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90"
                        : ""
                    }`}
                  >
                    <Link href="#contacts">Записаться</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Разделитель */}
      <SectionDivider />
    </section>
  );
}
