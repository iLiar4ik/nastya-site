"use client";

import dynamic from "next/dynamic";

export const RevenueChart = dynamic(
  () => import("@/components/statistics/RevenueChart"),
  { ssr: false }
);

export const LessonsChart = dynamic(
  () => import("@/components/statistics/LessonsChart"),
  { ssr: false }
);

