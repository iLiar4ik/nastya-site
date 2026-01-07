"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundCirclesProps {
  className?: string;
  variant?: keyof typeof COLOR_VARIANTS;
}

const COLOR_VARIANTS = {
  primary: {
    border: [
      "border-accent/60",
      "border-primary/50",
      "border-secondary/30",
    ],
    gradient: "from-accent/30",
  },
  secondary: {
    border: [
      "border-primary/60",
      "border-accent/50",
      "border-secondary/30",
    ],
    gradient: "from-primary/30",
  },
  tertiary: {
    border: [
      "border-secondary/60",
      "border-accent/50",
      "border-primary/30",
    ],
    gradient: "from-secondary/30",
  },
} as const;

const AnimatedGrid = () => (
  <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]">
    <motion.div
      className="h-full w-full [background-image:repeating-linear-gradient(100deg,#64748B_0%,#64748B_1px,transparent_1px,transparent_4%)] opacity-10"
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{
        duration: 40,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
    />
  </div>
);

export function BackgroundCircles({
  className,
  variant = "primary",
}: BackgroundCirclesProps) {
  const variantStyles = COLOR_VARIANTS[variant];

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        className
      )}
    >
      <AnimatedGrid />
      {/* Круги точно по центру контейнера - под моделью девушки */}
      <motion.div className="absolute h-[500px] w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute inset-0 rounded-full",
              "border-2 bg-gradient-to-br to-transparent",
              variantStyles.border[i],
              variantStyles.gradient
            )}
            animate={{
              rotate: 360,
              scale: [1, 1.05 + i * 0.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full mix-blend-screen",
                `bg-[radial-gradient(ellipse_at_center,${variantStyles.gradient.replace(
                  "from-",
                  ""
                )}/10%,transparent_70%)]`
              )}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary))/20%,transparent_70%)] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent))/10%,transparent)] blur-[80px]" />
      </div>
    </div>
  );
}

