"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Репетитор по математике
          </Link>
        </motion.div>
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "#about", label: "Обо мне" },
            { href: "#success", label: "Истории успеха" },
            { href: "#process", label: "Процесс обучения" },
            { href: "#pricing", label: "Тарифы" },
            { href: "#contacts", label: "Контакты" },
          ].map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs md:text-sm px-3 md:px-4"
              >
                Админка
              </Button>
            </Link>
            <Link href="/auth">
              <Button 
                variant="default" 
                size="sm"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-xs md:text-sm px-3 md:px-4"
              >
                Вход
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
