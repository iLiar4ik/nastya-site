"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Репетитор по математике</h3>
            <p className="text-sm text-muted-foreground">
              Профессиональная подготовка к ОГЭ по математике
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold">Навигация</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground">
                Обо мне
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                Тарифы
              </Link>
              <Link href="#process" className="text-sm text-muted-foreground hover:text-foreground">
                Как проходят занятия
              </Link>
              <Link href="#contacts" className="text-sm text-muted-foreground hover:text-foreground">
                Контакты
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Репетитор по математике. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
