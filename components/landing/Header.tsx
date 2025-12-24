"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Репетитор по математике
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            Обо мне
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Тарифы
          </Link>
          <Link href="#process" className="text-sm font-medium hover:text-primary transition-colors">
            Как проходят занятия
          </Link>
          <Link href="#contacts" className="text-sm font-medium hover:text-primary transition-colors">
            Контакты
          </Link>
        </nav>
      </div>
    </header>
  );
}


