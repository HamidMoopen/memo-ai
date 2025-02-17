'use client';

import Link from "next/link";
import {
    Home,
    BookOpen,
    Mic,
    ChartBarBig,
    Menu,
    X,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading";
import { supabase } from "@/lib/supabase";

const sidebarItems = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: Mic, label: "Record", href: "/topics" },
    { icon: BookOpen, label: "Chapters", href: "/dashboard/chapters" },
    { icon: ChartBarBig, label: "Insights", href: "/dashboard/insights" },
];

import { Session } from '@supabase/supabase-js';

export default function DashboardUI({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null); // Update the type here
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            console.log('Fetched session:', session);
            if (session) {
                setSession(session);
            } else {
                console.log('No session found, redirecting to login');
                router.push('/login');
            }
        };
        fetchSession();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <header className="fixed top-0 left-0 right-0 bg-white border-b z-30">
                <div className="container mx-auto px-4 sm:px-8 py-4">
                    <nav className="flex items-center justify-between">
                        <Link
                            href="/dashboard"
                            className="text-2xl font-bold text-[#3c4f76]"
                        >
                            Eterna
                        </Link>

                        <div className="hidden lg:flex items-center gap-4">
                            {session?.user && (
                                <div className="flex items-center gap-2 text-[#3c4f76]">
                                    <User className="w-5 h-5" />
                                    <span>{session.user.user_metadata.full_name || session.user.email}</span>
                                </div>
                            )}
                            <Button
                                onClick={handleSignOut}
                                variant="ghost"
                                className="text-[#3c4f76] hover:text-[#2a3b5a]"
                            >
                                Sign Out
                            </Button>
                        </div>

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
                    </nav>
                </div>
            </header>
            <main className="pt-16">
                {children}
            </main>
        </div>
    );
} 