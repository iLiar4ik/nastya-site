"use client";

import { useId } from "react";

export function SectionDivider() {
  const gradientId = useId();
  
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none">
      <svg
        className="relative block w-full h-[80px] md:h-[100px]"
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--background))" />
            <stop offset="50%" stopColor="hsl(var(--background))" />
            <stop offset="100%" stopColor="hsl(var(--background))" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 C200,60 400,60 600,30 C800,0 1000,0 1200,30 L1200,120 L0,120 Z"
          fill={`url(#${gradientId})`}
          className="drop-shadow-lg"
        />
      </svg>
      {/* Декоративная линия с градиентом */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 via-accent/30 to-transparent" />
      {/* Дополнительная декоративная линия */}
      <div className="absolute bottom-[2px] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
    </div>
  );
}

