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
  BookMarked,
  FolderInputIcon,
  CalendarDays,
  User,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@/lib/supabase/client';

const sidebarItems = [
  { icon: Home, label: "Overview", href: "/dashboard" },
  { icon: Mic, label: "Record", href: "/call" },
  { icon: BookMarked, label: "Stories", href: "/dashboard/stories" },
  { icon: CalendarDays, label: "Schedule", href: "/scheduled-calls" },
  { icon: FolderInputIcon, label: "Publish", href: "/dashboard/publish" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

            <div className="flex items-center space-x-4">
              {/* Account Button - Desktop */}
              <div className="hidden lg:block relative" ref={accountDropdownRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-[#3c4f76] hover:text-[#2a3b5a]"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                >
                  <div className="w-8 h-8 bg-[#3c4f76]/10 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{user?.user_metadata?.full_name || 'Account'}</span>
                </Button>

                {/* Account Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                    <Link href="/dashboard/account">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-[#383f51] hover:text-[#3c4f76] hover:bg-[#faf9f6] px-4"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-4"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.href = '/';
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>

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
            </div>
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
                {/* Add Account Settings to mobile menu */}
                <li>
                  <Link
                    href="/dashboard/account"
                    className="flex items-center gap-3 px-4 py-3 text-[#383f51] rounded-2xl hover:bg-[#faf9f6] hover:text-[#3c4f76] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </Link>
                </li>
                <li className="mt-4 pt-4 border-t">
                  <Button
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:text-red-700 w-full justify-start"
                    variant="ghost"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = '/';
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Button>
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