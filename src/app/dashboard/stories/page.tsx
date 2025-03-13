'use client';

import { useEffect, useState } from 'react';
import { Plus, ChevronRight, CalendarDays, BookMarked, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/DashboardHeader";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import { Progress } from "@/components/ui/progress";

export default function StoriesPage() {
    const router = useRouter();
    const [stories, setStories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    // Define milestones for story progress
    const milestones = [
        { count: 1, label: "First Story" },
        { count: 5, label: "Storyteller" },
        { count: 10, label: "Memory Keeper" },
        { count: 25, label: "Legacy Builder" },
        { count: 50, label: "Family Historian" }
    ];

    // Find the next milestone
    const getCurrentMilestone = (count: number) => {
        for (let i = milestones.length - 1; i >= 0; i--) {
            if (count >= milestones[i].count) {
                return milestones[i];
            }
        }
        return null;
    };

    const getNextMilestone = (count: number) => {
        for (let i = 0; i < milestones.length; i++) {
            if (count < milestones[i].count) {
                return milestones[i];
            }
        }
        return milestones[milestones.length - 1];
    };

    useEffect(() => {
        async function fetchStories() {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching stories:', error);
                return;
            }

            setStories(data || []);
            setIsLoading(false);
        }

        fetchStories();
    }, []);

    const handleStoryClick = (storyId: string) => {
        router.push(`/dashboard/stories/${storyId}`);
    };

    // Calculate progress percentage
    const storyCount = stories.length;
    const nextMilestone = getNextMilestone(storyCount);
    const currentMilestone = getCurrentMilestone(storyCount);
    const progressPercentage = nextMilestone
        ? Math.min(100, (storyCount / nextMilestone.count) * 100)
        : 100;

    // Function to truncate text with ellipsis
    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="w-12 h-12 border-4 border-[#3c4f76] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <DashboardHeader
                    title="Your Stories"
                    description="Browse and manage your recorded stories"
                />
                <div className="px-8">
                    <Button
                        onClick={() => router.push('/topics')}
                        className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white text-lg px-8 py-6 rounded-2xl"
                    >
                        <Plus className="mr-3 h-6 w-6" /> Record New Story
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-8 py-8">
                {/* Progress Tracker Card */}
                <Card className="mb-8 p-6 rounded-3xl border-2 border-gray-100">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl text-[#3c4f76]">Your Story Journey</CardTitle>
                            {currentMilestone && (
                                <div className="flex items-center bg-[#3c4f76]/10 text-[#3c4f76] px-4 py-2 rounded-full">
                                    <Award className="mr-2 h-5 w-5" />
                                    <span className="font-medium">{currentMilestone.label}</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[#383f51] font-medium">
                                    {storyCount} {storyCount === 1 ? 'story' : 'stories'} shared
                                </span>
                                {nextMilestone && nextMilestone.count !== currentMilestone?.count && (
                                    <span className="text-[#383f51]">
                                        Next milestone: {nextMilestone.label} ({nextMilestone.count} stories)
                                    </span>
                                )}
                            </div>
                            <Progress value={progressPercentage} className="h-3 bg-gray-100" indicatorClassName="bg-[#3c4f76]" />
                        </div>
                    </CardContent>
                </Card>

                {stories.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-3xl shadow p-8">
                        <BookMarked className="mx-auto h-12 w-12 text-[#3c4f76]/60 mb-4" />
                        <p className="text-xl text-[#383f51] mb-6">You haven't created any stories yet.</p>
                        <Button
                            onClick={() => router.push('/topics')}
                            className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white px-6 py-3 rounded-xl"
                        >
                            Start Recording
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {stories.map((story) => (
                            <Card
                                key={story.id}
                                className="hover:shadow-lg transition-shadow p-8 rounded-3xl border-2 border-gray-100 cursor-pointer"
                                onClick={() => handleStoryClick(story.id)}
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
                                    <div>
                                        <CardTitle className="text-3xl mb-4 text-[#3c4f76] font-bold">
                                            {story.title}
                                        </CardTitle>
                                        <div className="flex items-center text-[#383f51] text-lg">
                                            <CalendarDays className="mr-3 h-5 w-5" />
                                            {new Date(story.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-[#3c4f76] p-4 hover:bg-[#faf9f6] rounded-xl"
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <p className="text-[#383f51] line-clamp-3">
                                            {truncateText(story.content, 200)}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <span
                                            className="px-6 py-2 rounded-full bg-[#3c4f76]/10 text-[#3c4f76] text-lg font-medium"
                                        >
                                            {story.category}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 