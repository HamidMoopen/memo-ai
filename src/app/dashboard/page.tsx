'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import {
    BookOpen,
    Mic,
    CalendarDays,
    ChevronRight,
    Phone,
    Plus,
    Play,
    Clock,
    BookMarked,
    Home,
    BookText,
    Calendar,
    Share2,
    Heart,
    MessageCircle
} from "lucide-react";
import { DashboardHeader } from "./components/DashboardHeader";
import { usePathname, useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { createClient } from '@/lib/supabase/client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Record', href: '/call', icon: Mic },
    { name: 'Stories', href: '/dashboard/stories', icon: BookText },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Share', href: '/publish', icon: Share2 },
];

export default function DashboardPage() {
    const pathname = usePathname();
    const { addToHistory } = useNavigation();
    const router = useRouter();
    const [userName, setUserName] = useState<string>('');
    const [recentStories, setRecentStories] = useState<any[]>([]);
    const [upcomingCalls, setUpcomingCalls] = useState<any[]>([
        { id: 1, title: "Weekly Story Call", date: "Sunday, June 12", time: "2:00 PM" },
        { id: 2, title: "Weekly Story Call", date: "Sunday, June 19", time: "2:00 PM" }
    ]);
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
        <main className="w-full">
            <div className="max-w-5xl mx-auto w-full px-8 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-foreground mb-6">
                        Welcome back, {userName}! 👋
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Your stories are waiting to be told. Let's create something beautiful today.
                    </p>
                    <div className="flex gap-6 justify-center">
                        <Button 
                            size="lg" 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg rounded-xl shadow-soft"
                            onClick={() => router.push('/call')}
                        >
                            <Mic className="w-5 h-5 mr-2" />
                            Record New Story
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="border-primary text-primary hover:bg-accent px-10 py-7 text-lg rounded-xl shadow-soft"
                            onClick={() => router.push('/schedule')}
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Schedule Call
                        </Button>
                    </div>
                </div>

                {/* Featured Stories */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-foreground">Your Stories</h2>
                        <Link
                            href="/dashboard/stories"
                            className="text-primary hover:text-primary/90 flex items-center text-lg"
                        >
                            View All Stories
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentStories.length === 0 ? (
                            <div className="col-span-full p-12 rounded-2xl border border-border bg-accent shadow-soft">
                                <div className="text-center">
                                    <BookOpen className="w-16 h-16 text-primary mx-auto mb-6" />
                                    <h3 className="text-2xl font-medium text-foreground mb-4">Your Story Journey Begins Here</h3>
                                    <p className="text-muted-foreground mb-8 text-lg">Start preserving your memories and experiences for generations to come.</p>
                                    <Button 
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-soft"
                                        onClick={() => router.push('/call')}
                                    >
                                        Record Your First Story
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            recentStories.map((story) => (
                                <div
                                    key={story.id}
                                    className="rounded-2xl border border-border bg-accent overflow-hidden group hover:shadow-lg transition-all duration-300 shadow-soft"
                                >
                                    <div className="aspect-video bg-accent flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        <Play className="w-16 h-16 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(story.created_at).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-medium text-foreground mb-3">{story.title}</h3>
                                        <p className="text-muted-foreground mb-6 line-clamp-2">
                                            {story.description || "A precious memory captured for eternity..."}
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary hover:bg-primary/10"
                                                onClick={() => router.push(`/dashboard/stories/${story.id}`)}
                                            >
                                                <Play className="w-4 h-4 mr-2" />
                                                Listen
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-muted-foreground hover:text-primary"
                                                onClick={() => router.push(`/dashboard/stories/${story.id}/edit`)}
                                            >
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Calls */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-foreground">Upcoming Story Sessions</h2>
                        <Link
                            href="/schedule"
                            className="text-primary hover:text-primary/90 flex items-center text-lg"
                        >
                            Schedule New
                            <Plus className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {upcomingCalls.length === 0 ? (
                            <div className="col-span-full p-12 rounded-2xl border border-border bg-accent shadow-soft">
                                <div className="text-center">
                                    <Calendar className="w-16 h-16 text-primary mx-auto mb-6" />
                                    <h3 className="text-2xl font-medium text-foreground mb-4">No upcoming calls</h3>
                                    <p className="text-muted-foreground mb-8 text-lg">Schedule a call to start sharing your stories!</p>
                                    <Button 
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-soft"
                                        onClick={() => router.push('/schedule')}
                                    >
                                        Schedule Call
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            upcomingCalls.map((call) => (
                                <div
                                    key={call.id}
                                    className="p-8 rounded-2xl border border-border bg-accent hover:shadow-lg transition-all duration-300 shadow-soft"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Phone className="w-7 h-7 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-medium text-foreground mb-2">{call.title}</h3>
                                            <div className="flex items-center text-muted-foreground text-lg">
                                                <CalendarDays className="w-5 h-5 mr-2" />
                                                {call.date} • {call.time}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
} 