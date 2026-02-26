"use client";

import { useEffect } from "react";

/**
 * Раньше при любой ошибке с "chunk" в тексте делался window.location.reload() через 1 сек —
 * из-за этого пропадала доска tldraw (в т.ч. в iframe). Перезагрузку отключили полностью:
 * только логируем, reload не вызываем. Если доска перестала пропадать — виноват был этот обработчик.
 */
function isChunkLoadError(message: string, name?: string): boolean {
  if (name === "ChunkLoadError") return true;
  return (
    (message.includes("Loading chunk") && (message.includes("failed") || message.includes("error"))) ||
    message.includes("ChunkLoadError")
  );
}

export function ChunkErrorHandler() {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error;
      const message = (error?.message || event.message || "") as string;
      if (!isChunkLoadError(message, error?.name)) return;
      console.warn("[ChunkErrorHandler] ChunkLoadError (reload disabled):", message);
      // window.location.reload() отключен — из-за него пропадала доска tldraw
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = (reason?.message ?? String(reason)) as string;
      if (!isChunkLoadError(message, reason?.name)) return;
      console.warn("[ChunkErrorHandler] ChunkLoadError in promise (reload disabled):", message);
      event.preventDefault();
    };

    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof message === "string" && isChunkLoadError(message, error?.name)) {
        console.warn("[ChunkErrorHandler] ChunkLoadError via onerror (reload disabled):", message);
        return true;
      }
      return originalError ? originalError(message, source, lineno, colno, error) : false;
    };

    window.addEventListener("error", handleChunkError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleChunkError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.onerror = originalError;
    };
  }, []);

  return null;
}
