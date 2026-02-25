"use client";

import { useEffect } from "react";

/** Реальная ошибка загрузки чанка (Next.js), а не любое сообщение со словом "chunk". */
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
      // Не перезагружать страницу доски — иначе доска пропадает через пару секунд
      if (typeof window !== "undefined" && window.location.pathname === "/lesson/board") return;
      console.log("ChunkLoadError detected, reloading page in 1 second...");
      setTimeout(() => window.location.reload(), 1000);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = (reason?.message ?? String(reason)) as string;
      if (!isChunkLoadError(message, reason?.name)) return;
      if (typeof window !== "undefined" && window.location.pathname === "/lesson/board") return;
      console.log("ChunkLoadError in promise, reloading page in 1 second...");
      event.preventDefault();
      setTimeout(() => window.location.reload(), 1000);
    };

    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (
        typeof message === "string" &&
        isChunkLoadError(message, error?.name)
      ) {
        if (typeof window !== "undefined" && window.location.pathname === "/lesson/board") return false;
        console.log("ChunkLoadError via window.onerror, reloading page...");
        setTimeout(() => window.location.reload(), 1000);
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
