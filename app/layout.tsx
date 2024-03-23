import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { AI } from "./action";
import { Providers } from "@/components/providers";
import Link from "next/link";

const meta = {
  title: "AI RSC Demo",
  description:
    "Demo of an interactive financial assistant built using Next.js and Vercel AI SDK.",
};
export const metadata: Metadata = {
  ...meta,
  title: {
    default: "AI RSC Demo",
    template: `%s - AI RSC Demo`,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    ...meta,
    card: "summary_large_image",
    site: "@vercel",
  },
  openGraph: {
    ...meta,
    locale: "en-US",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Toaster />
        <AI>
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen bg-muted/50 dark:bg-background">
              <header className="flex justify-end gap-6 p-4 text-xl">
                <Link href="/">Chat</Link>
                <Link href="/charts">Charts</Link>
              </header>

              <main className="flex flex-col flex-1">{children}</main>
            </div>
          </Providers>
        </AI>
        <Analytics />
      </body>
    </html>
  );
}

export const runtime = "edge";
