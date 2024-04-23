import React from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  colSpan: number;
  rowSpan: number;
  children?: React.ReactNode;
};

export function DashboardCard({ colSpan, rowSpan, children }: CardProps) {
  return (
    <div
      className={cn("bg-background rounded-md shadow-sm overflow-hidden")}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      {children}
    </div>
  );
}
