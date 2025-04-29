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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@/lib/supabase/client';
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: Home, label: "Overview", href: "/dashboard", description: "Your story dashboard" },
  { icon: Mic, label: "Record", href: "/call", description: "Record new stories" },
  { icon: BookMarked, label: "Stories", href: "/dashboard/stories", description: "View your stories" },
  { icon: CalendarDays, label: "Schedule", href: "/scheduled-calls", description: "Manage your schedule" },
  { icon: FolderInputIcon, label: "Publish", href: "/dashboard/publish", description: "Share your stories" },
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
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-30">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
              >
                Eterna
              </Link>

              {/* Quick Actions - Desktop */}
              <div className="hidden lg:flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  asChild
                >
                  <Link href="/call">
                    <Mic className="w-4 h-4 mr-2" />
                    New Story
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                  asChild
                >
                  <Link href="/schedule">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    Schedule
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Account Button - Desktop */}
              <div className="hidden lg:block relative" ref={accountDropdownRef}>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-foreground hover:text-primary group"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{user?.user_metadata?.full_name || 'Account'}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    isAccountMenuOpen ? "rotate-90" : ""
                  )} />
                </Button>

                {/* Account Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background rounded-xl shadow-medium border border-border py-2 animate-in">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'Account'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Link href="/dashboard/account">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-foreground hover:text-primary hover:bg-accent px-4"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4"
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
                  <X className="h-6 w-6 text-foreground" />
                ) : (
                  <Menu className="h-6 w-6 text-foreground" />
                )}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-[73px] min-h-screen flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-72 bg-background/80 backdrop-blur-md border-r fixed left-0 top-[73px] bottom-0">
          <nav className="p-6">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-muted-foreground rounded-xl",
                      "hover:bg-accent hover:text-primary transition-colors",
                      "group relative overflow-hidden"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground/70">{item.description}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-md z-40">
            <div className="bg-background w-full h-full p-6 shadow-medium">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <ul className="space-y-1">
                    {sidebarItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 text-muted-foreground rounded-xl",
                            "hover:bg-accent hover:text-primary transition-colors",
                            "group relative overflow-hidden"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-xs text-muted-foreground/70">{item.description}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="px-4 py-2">
                    <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'Account'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/account"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-muted-foreground rounded-xl",
                      "hover:bg-accent hover:text-primary transition-colors"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </Link>
                  <Button
                    className="flex items-center gap-3 px-4 py-3 text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
                    variant="ghost"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = '/';
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full lg:pl-72">
          <div className="container mx-auto px-4 sm:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 