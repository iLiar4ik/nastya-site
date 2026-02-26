import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const nunito = Nunito({ 
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Репетитор по математике - Подготовка к ОГЭ",
  description: "Профессиональная подготовка к ОГЭ по математике. Индивидуальные и групповые занятия онлайн и оффлайн.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={nunito.className}>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
