'use client';

import { useEffect, useState } from 'react';
import { Plus, ChevronRight, CalendarDays, BookMarked, Award, LayoutList, LayoutGrid, Play, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/DashboardHeader";
import { useRouter } from "next/navigation";
import { createClient } from '@/lib/supabase/client';
import { Progress } from "@/components/ui/progress";
import { ChapterView } from './components/ChapterView';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LifeChapter } from '@/types/story';
import { ChaptersPage } from './components/ChaptersPage';
import { Json } from '@/types/types.gen';

const CHAPTER_LABELS: Record<LifeChapter, string> = {
    early_childhood: 'Early Childhood (0-5)',
    childhood: 'Childhood (6-12)',
    teenage_years: 'Teenage Years (13-19)',
    young_adult: 'Young Adult (20-25)',
    college: 'College Years',
    early_career: 'Early Career',
    career_growth: 'Career Growth',
    family_life: 'Family Life',
    mid_life: 'Mid-Life',
    late_career: 'Late Career',
    retirement: 'Retirement',
    legacy: 'Legacy'
};

interface LocalStory {
    id: string;
    title: string;
    content: string;
    created_at: string;
    category: string;
    life_chapter: LifeChapter;
    chapter_metadata: Json | null;
}

type ViewMode = 'list' | 'chapters';

export default function StoriesPage() {
    const router = useRouter();
    const [stories, setStories] = useState<LocalStory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
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

            // Transform the data to ensure it matches the Story interface
            const transformedStories: LocalStory[] = (data || []).map(story => ({
                id: story.id,
                title: story.title,
                content: story.content,
                created_at: story.created_at,
                category: story.category || 'Uncategorized',
                life_chapter: story.life_chapter as LifeChapter,
                chapter_metadata: story.chapter_metadata
            }));

            setStories(transformedStories);
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
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto w-full px-8 py-12">
            <div className="space-y-12">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Your Stories</h1>
                        <p className="text-xl text-muted-foreground">View and manage your life stories</p>
                    </div>
                    <Button
                        onClick={() => router.push('/call')}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-soft"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        New Story
                    </Button>
                </div>

                {stories.length > 0 && (
                    <div className="rounded-2xl border border-border bg-accent p-8 shadow-soft">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-foreground">Story Progress</h2>
                                <p className="text-muted-foreground">Track your storytelling journey</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{currentMilestone?.label || 'Getting Started'}</span>
                                    <span>{nextMilestone?.label}</span>
                                </div>
                                <Progress value={progressPercentage} className="h-2 bg-primary/10" />
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Award className="h-4 w-4 text-primary" />
                                    <span className="text-foreground">{storyCount} {storyCount === 1 ? 'story' : 'stories'} written</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {stories.length > 0 && (
                    <div className="flex justify-end">
                        <ToggleGroup type="single" value={viewMode} onValueChange={(value: string) => setViewMode(value as 'list' | 'chapters')}>
                            <ToggleGroupItem value="list" aria-label="List View" className="rounded-xl">
                                <LayoutList className="h-5 w-5 text-primary" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="chapters" aria-label="Chapter View" className="rounded-xl">
                                <LayoutGrid className="h-5 w-5 text-primary" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                )}

                {stories.length === 0 ? (
                    <div className="text-center py-16 bg-accent rounded-2xl shadow-soft p-8">
                        <BookMarked className="mx-auto h-16 w-16 text-primary/60 mb-6" />
                        <h3 className="text-2xl font-medium text-foreground mb-4">Your Story Journey Begins Here</h3>
                        <p className="text-muted-foreground mb-8 text-lg">Start preserving your memories and experiences for generations to come.</p>
                        <Button
                            onClick={() => router.push('/call')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-soft"
                        >
                            Start Recording
                        </Button>
                    </div>
                ) : viewMode === 'chapters' ? (
                    <ChaptersPage stories={stories as any} />
                ) : (
                    <div className="grid gap-8">
                        {stories.map((story) => (
                            <div
                                key={story.id}
                                className="rounded-2xl border border-border bg-accent overflow-hidden group hover:shadow-lg transition-all duration-300 shadow-soft cursor-pointer"
                                onClick={() => handleStoryClick(story.id)}
                            >
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
                                    <p className="text-muted-foreground mb-6 line-clamp-2">{truncateText(story.content, 120)}</p>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:bg-primary/10"
                                            onClick={e => { e.stopPropagation(); handleStoryClick(story.id); }}
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Listen
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-primary"
                                            onClick={e => { e.stopPropagation(); router.push(`/dashboard/stories/${story.id}/edit`); }}
                                        >
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 