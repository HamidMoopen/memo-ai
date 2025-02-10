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
            <DashboardHeader title="Welcome to Your Stories" description="Your life story, recorded and preserved" />
            <div className="container mx-auto px-8 py-12">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
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
                            className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102"
                        >
                            <div className="w-16 h-16 bg-memory-purple rounded-2xl flex items-center justify-center mb-8">
                                <action.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-serif text-memory-purple mb-4">{action.title}</h3>
                            <p className="text-lg text-gray-600">{action.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Stories */}
                <div className="bg-white rounded-3xl shadow-lg p-10">
                    <h2 className="text-3xl font-serif text-memory-purple mb-8">Recent Stories</h2>
                    <div className="space-y-6">
                        <div className="p-8 border-2 border-gray-200 rounded-2xl hover:bg-memory-cream transition-colors">
                            <p className="text-xl text-memory-purple mb-3">No stories recorded yet</p>
                            <p className="text-lg text-gray-600">Start by recording your first story!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 