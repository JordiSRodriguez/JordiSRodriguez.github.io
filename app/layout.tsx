import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/react-query/providers";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jordi Sumba - Full Stack Developer",
  description:
    "Personal portfolio of Jordi Sumba - Full Stack Developer specializing in React, Next.js, and modern web technologies",
  generator: "Next.js",
  other: {
    "x-dns-prefetch-control": "on",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Prefetch likely next pages */}
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/about" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ServiceWorkerRegister />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
