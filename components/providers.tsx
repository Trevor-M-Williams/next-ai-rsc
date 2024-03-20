"use client";

import * as React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <ClerkProvider>
      <NextThemesProvider {...props}>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </NextThemesProvider>
    </ClerkProvider>
  );
}
