'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Mic,
    Clock,
    PlusCircle,
    ChartBarBig
} from "lucide-react";
import { DashboardHeader } from "./components/DashboardHeader";
import { usePathname, useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
    const pathname = usePathname();
    const { addToHistory } = useNavigation();
    const router = useRouter();
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        addToHistory(pathname);

        const checkSession = async () => {
            // Get current session
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
            } else {
                // Get user's name from metadata
                const fullName = user.user_metadata.full_name;
                const firstName = fullName?.split(' ')[0] || 'there';
                setUserName(firstName);
            }
        };

        checkSession();
    }, [pathname, addToHistory, router]);

    return (
        <div>
            <DashboardHeader
                title={`Welcome, ${userName}!`}
                description="Your life story, recorded and preserved"
            />
            <div className="py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {[
                        {
                            icon: BookOpen,
                            title: "Browse Stories",
                            description: "View all your recorded stories",
                            href: "/dashboard/chapters"
                        },
                        {
                            icon: Mic,
                            title: "Record Story",
                            description: "Start recording a new story",
                            href: "/topics"
                        },
                        {
                            icon: ChartBarBig,
                            title: "Insights",
                            description: "See your story insights",
                            href: "/dashboard/insights"
                        }
                    ].map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="bg-white p-6 sm:p-8 rounded-3xl shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-[#3c4f76]/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                                <action.icon className="w-8 sm:w-10 h-8 sm:h-10 text-[#3c4f76]" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-[#3c4f76] mb-2 sm:mb-3">{action.title}</h3>
                            <p className="text-base sm:text-lg text-[#383f51]">{action.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Stories */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#3c4f76] mb-4 sm:mb-6">Recent Stories</h2>
                    <div className="space-y-4">
                        <div className="p-4 sm:p-6 border-2 border-gray-100 rounded-2xl hover:bg-[#faf9f6] transition-colors">
                            <p className="text-lg text-[#3c4f76]">No stories recorded yet</p>
                            <p className="text-[#383f51]">Start by recording your first story!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 