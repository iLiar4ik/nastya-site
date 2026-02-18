/** @type {import('next').NextConfig} */
const nextConfig = {
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
  
  
  // Компилятор оптимизации
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Оптимизация для production
  productionBrowserSourceMaps: false, // Отключаем source maps для браузера в production
  
  // Экспериментальные оптимизации
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-tabs'],
  },
};

export default nextConfig;
