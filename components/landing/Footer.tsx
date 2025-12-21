import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">Репетитор по математике</h3>
            <p className="text-sm text-muted-foreground">
              Профессиональная подготовка к ОГЭ по математике. 
              Индивидуальный подход к каждому ученику.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary">
                  Обо мне
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-primary">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link href="#process" className="text-muted-foreground hover:text-primary">
                  Как проходят занятия
                </Link>
              </li>
              <li>
                <Link href="#contacts" className="text-muted-foreground hover:text-primary">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:teacher@example.com" className="hover:text-primary">
                  teacher@example.com
                </a>
              </li>
              <li>
                <a href="tel:+79991234567" className="hover:text-primary">
                  +7 (999) 123-45-67
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/teacher_math"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  Telegram: @teacher_math
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Репетитор по математике. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

