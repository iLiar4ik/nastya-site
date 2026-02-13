"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { SectionDivider } from "@/components/ui/section-divider";
import { pricingData } from "@/lib/pricing-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check } from "lucide-react";

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  const renderPrice = (plan: any) => {
    if (plan.pricePerMonth) {
      return (
        <>
          <span className="text-3xl font-bold text-primary">{plan.pricePerMonth}</span>
          {plan.pricePerLesson && <span className="text-sm text-muted-foreground">({plan.pricePerLesson} / занятие)</span>}
        </>
      );
    }
    if (plan.pricePerLesson) {
      return <span className="text-3xl font-bold text-primary">{plan.pricePerLesson}</span>;
    }
    return null;
  };

  return (
    <section id="pricing" className="container py-20 md:py-32 relative flex flex-col">
      <div ref={ref} className="flex flex-col gap-8 relative z-10 flex-1 justify-center pb-12">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex flex-col gap-4 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            {pricingData.title}
          </h2>
          <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
            {pricingData.subtitle}
          </p>
        </motion.div>

        {pricingData.categories.map((category) => (
          <motion.div
            key={category.id}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold sm:text-3xl">{category.title}</h3>
              <p className="text-muted-foreground">{category.duration}</p>
            </div>
            <div className={`grid gap-8 md:grid-cols-${category.plans.length > 2 ? '3' : '2'} items-start`}>
              {category.plans.map((plan:any) => (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  className="w-full h-full"
                >
                  <Card
                    className={`relative h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                      plan.popular
                        ? "border-primary border-2 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          ★ ПОПУЛЯРНО
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-xl">{plan.title}</CardTitle>
                      {plan.subtitle && <CardDescription>{plan.subtitle}</CardDescription>}
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <div className="flex-grow">
                        <div className="text-center mb-4 flex flex-col items-center gap-1">
                          {renderPrice(plan)}
                          {plan.priceDetails && (
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{plan.priceDetails}</p>
                          )}
                          {plan.priceCalculation && (
                            <p className="text-xs text-muted-foreground">{plan.priceCalculation}</p>
                          )}
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                          {plan.features.map((feature: string, i:number) => (
                            <li key={i} className="flex items-start">
                              <Check className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="payment-terms">
                          <AccordionTrigger className="text-sm font-semibold">{pricingData.paymentTerms.title}</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 pl-4 mt-2 text-xs">
                              {pricingData.paymentTerms.terms.map((term, index) => (
                                <li key={index} className="text-muted-foreground whitespace-pre-line list-disc list-outside">
                                  {term}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
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
                        <Link href="#contacts">{plan.buttonText}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      <SectionDivider />
    </section>
  );
}
