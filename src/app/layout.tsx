import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import { NavigationProvider } from '@/contexts/NavigationContext';
import { Toaster } from 'sonner';
import ThemeScript from '@/components/ThemeScript';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Eterna',
  description: 'Capture and preserve your stories',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        suppressHydrationWarning 
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          min-h-screen 
          bg-background 
          text-foreground
          selection:bg-primary/20
          selection:text-primary-foreground
        `}
      >
        <ThemeScript />
        <NavigationProvider>
          <div className="relative min-h-screen">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)]" />
            <main className="relative z-10">
              {children}
            </main>
          </div>
        </NavigationProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'bg-background text-foreground border border-border shadow-soft',
            duration: 4000,
          }}
        />
      </body>
    </html>
  )
}
