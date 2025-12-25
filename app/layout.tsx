import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChunkErrorHandler } from "./chunk-error-handler";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

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
      <body className={inter.className}>
        <ChunkErrorHandler />
        {children}
      </body>
    </html>
  );
}
