'use client';
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
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

export default function DashboardPage() {
    const pathname = usePathname();
    const { addToHistory } = useNavigation();

    useEffect(() => {
        addToHistory(pathname);
    }, [pathname, addToHistory]);

    return (
        <div>
            <DashboardHeader
                title="Welcome to Your Stories"
                description="Your life story, recorded and preserved"
            />
            <div className="container mx-auto px-8 py-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                            className="bg-white p-8 rounded-3xl shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="w-16 h-16 bg-[#3c4f76] rounded-2xl flex items-center justify-center mb-6">
                                <action.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#3c4f76] mb-3">{action.title}</h3>
                            <p className="text-[#383f51]">{action.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Stories */}
                <div className="bg-white rounded-3xl shadow p-8">
                    <h2 className="text-2xl font-bold text-[#3c4f76] mb-6">Recent Stories</h2>
                    <div className="space-y-4">
                        <div className="p-6 border-2 border-gray-100 rounded-2xl hover:bg-[#faf9f6] transition-colors">
                            <p className="text-lg text-[#3c4f76]">No stories recorded yet</p>
                            <p className="text-[#383f51]">Start by recording your first story!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 