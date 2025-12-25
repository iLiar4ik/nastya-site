"use client";

import { useEffect } from "react";

export function ChunkErrorHandler() {
  useEffect(() => {
    // Обработчик для ошибок загрузки чанков
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error;
      const message = error?.message || event.message || "";
      
      // Проверяем, является ли ошибка ChunkLoadError
      if (
        message.includes("Loading chunk") ||
        message.includes("chunk") ||
        error?.name === "ChunkLoadError"
      ) {
        console.log("ChunkLoadError detected, reloading page in 1 second...");
        // Небольшая задержка перед перезагрузкой
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    // Обработчик для необработанных отклонений промисов
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason?.message || String(reason) || "";
      
      if (
        message.includes("Loading chunk") ||
        message.includes("chunk") ||
        reason?.name === "ChunkLoadError"
      ) {
        console.log("ChunkLoadError in promise, reloading page in 1 second...");
        event.preventDefault(); // Предотвращаем вывод ошибки в консоль
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    // Глобальный обработчик ошибок
    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Также перехватываем ошибки через window.onerror для старых браузеров
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        typeof message === "string" &&
        (message.includes("Loading chunk") || message.includes("chunk"))
      ) {
        console.log("ChunkLoadError via window.onerror, reloading page...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return true;
      }
      
      // Вызываем оригинальный обработчик, если он был
      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }
      return false;
    };

    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.onerror = originalError;
    };
  }, []);

  return null;
}
