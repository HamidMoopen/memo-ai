'use client';

import Link from "next/link";
import {
  Home,
  BookOpen,
  Mic,
  LogOut,
  ChartBarBig,
  Menu,
  X,
  BookMarked
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: Mic, label: "Record", href: "/topics" },
  { icon: BookMarked, label: "Stories", href: "/dashboard/stories" },
  { icon: BookOpen, label: "Chapters", href: "/dashboard/chapters" },
  { icon: ChartBarBig, label: "Insights", href: "/dashboard/insights" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-30">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <nav className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-2xl font-bold text-[#3c4f76]"
            >
              Eterna
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#3c4f76]" />
              ) : (
                <Menu className="h-6 w-6 text-[#3c4f76]" />
              )}
            </Button>

            {/* Desktop Sign Out */}
            <Link
              href="/"
              className="hidden lg:block text-[#3c4f76] hover:text-[#2a3b5a] transition-colors"
            >
              Sign Out
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-[73px] min-h-screen flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r fixed left-0 top-[73px] bottom-0">
          <nav className="p-6">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-[#383f51] rounded-2xl hover:bg-[#faf9f6] hover:text-[#3c4f76] transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="bg-white w-64 h-full p-6 shadow-lg">
              <ul className="space-y-2">
                {sidebarItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-[#383f51] rounded-2xl hover:bg-[#faf9f6] hover:text-[#3c4f76] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-4 pt-4 border-t">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-[#383f51] rounded-2xl hover:bg-[#faf9f6] hover:text-[#3c4f76] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full lg:pl-64">
          <div className="container mx-auto px-4 sm:px-8 py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 