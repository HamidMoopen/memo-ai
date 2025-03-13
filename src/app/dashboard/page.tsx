'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import {
    BookOpen,
    Mic,
    ChartBarBig,
    CalendarDays,
    ChevronRight
} from "lucide-react";
import { DashboardHeader } from "./components/DashboardHeader";
import { usePathname, useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
    const pathname = usePathname();
    const { addToHistory } = useNavigation();
    const router = useRouter();
    const [userName, setUserName] = useState<string>('');
    const [recentStories, setRecentStories] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        addToHistory(pathname);

        const checkSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUserName(user.user_metadata.full_name);
        };

        checkSession();
    }, [pathname, addToHistory, router]);

    useEffect(() => {
        async function fetchRecentStories() {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) {
                console.error('Error fetching recent stories:', error);
                return;
            }

            setRecentStories(data || []);
        }

        fetchRecentStories();
    }, []);

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
                            href: "/dashboard/stories"
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
                        {recentStories.length === 0 ? (
                            <div className="p-4 sm:p-6 border-2 border-gray-100 rounded-2xl hover:bg-[#faf9f6] transition-colors">
                                <p className="text-lg text-[#3c4f76]">No stories recorded yet</p>
                                <p className="text-[#383f51]">Start by recording your first story!</p>
                            </div>
                        ) : (
                            recentStories.map((story) => (
                                <Link
                                    key={story.id}
                                    href={`/dashboard/stories/${story.id}`}
                                    className="block p-4 sm:p-6 border-2 border-gray-100 rounded-2xl hover:bg-[#faf9f6] transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-[#3c4f76]">{story.title}</h3>
                                            <div className="flex items-center text-[#383f51] mt-2">
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                {new Date(story.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-[#3c4f76]" />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 