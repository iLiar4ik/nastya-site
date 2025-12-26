import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Улучшенная обработка статических файлов
  onDemandEntries: {
    // Время удержания страниц в памяти в секундах
    maxInactiveAge: 60 * 1000,
    // Количество страниц, которые нужно держать одновременно
    pagesBufferLength: 5,
  },
  // Настройки для изображений - отключаем оптимизацию для standalone режима
  images: {
    unoptimized: true, // Отключаем оптимизацию, так как она может не работать в standalone
  },
};

export default nextConfig;
