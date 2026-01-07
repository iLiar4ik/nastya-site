"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const links = [
    { href: "#about", label: "Обо мне" },
    { href: "#success", label: "Истории успеха" },
    { href: "#process", label: "Процесс обучения" },
    { href: "#pricing", label: "Тарифы" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <footer className="border-t bg-gradient-to-br from-background to-muted/30">
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Репетитор по математике
            </h3>
            <p className="text-sm text-muted-foreground">
              Профессиональная подготовка к ОГЭ по математике
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <h4 className="text-sm font-semibold">Навигация</h4>
            <nav className="flex flex-col gap-2">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      const targetId = link.href.substring(1);
                      const element = document.getElementById(targetId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground"
        >
          <p>© {new Date().getFullYear()} Репетитор по математике. Все права защищены.</p>
        </motion.div>
      </div>
    </footer>
  );
}
