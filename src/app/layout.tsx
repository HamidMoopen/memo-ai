'use client'

import './globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { NavigationProvider } from '@/contexts/NavigationContext';
import { SessionProvider } from "next-auth/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <SessionProvider>
          <NavigationProvider>
            {children}
          </NavigationProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
