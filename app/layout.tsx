import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { AI } from "./action";
import { Providers } from "@/components/providers";

const meta = {
  title: "Director Assist",
  description: "Director Assist",
};
export const metadata: Metadata = {
  ...meta,
  title: {
    default: "Director Assist",
    template: `%s - Director Assist`,
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
            <div className="flex h-screen bg-muted/50 overflow-hidden dark:bg-background">
              {children}
            </div>
          </Providers>
        </AI>
        <Analytics />
      </body>
    </html>
  );
}

export const runtime = "edge";
