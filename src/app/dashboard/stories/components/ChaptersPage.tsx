'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, CalendarDays, Edit, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeChapter, CHAPTER_LABELS, CHAPTER_DESCRIPTIONS } from '@/types/story';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Story {
    id: string;
    title: string;
    content: string;
    created_at: string;
    life_chapter: LifeChapter;
    chapter_metadata?: {
        time_period: string;
        key_events: string[];
        locations: string[];
        people: string[];
        emotions: string[];
        lessons_learned: string[];
    };
}

interface ChaptersPageProps {
    stories: Story[];
}

export function ChaptersPage({ stories }: ChaptersPageProps) {
    const router = useRouter();
    const [expandedChapters, setExpandedChapters] = useState<Set<LifeChapter>>(new Set());
    const [editingStory, setEditingStory] = useState<string | null>(null);

    // Group stories by life chapter
    const storiesByChapter = stories.reduce((acc, story) => {
        const chapter = story.life_chapter || 'mid_life';
        if (!acc[chapter]) {
            acc[chapter] = [];
        }
        acc[chapter].push(story);
        return acc;
    }, {} as Record<LifeChapter, Story[]>);

    // Calculate chapter statistics for the timeline
    const chapterStats = Object.entries(CHAPTER_LABELS).map(([chapter, label]) => ({
        chapter: chapter as LifeChapter,
        label,
        count: storiesByChapter[chapter as LifeChapter]?.length || 0,
        description: CHAPTER_DESCRIPTIONS[chapter as LifeChapter]
    }));

    const handleUpdateChapter = async (storyId: string, newChapter: LifeChapter) => {
        // TODO: Implement chapter update logic with Supabase
        setEditingStory(null);
    };

    return (
        <div className="space-y-8">
            {/* Legacy Timeline Visualization */}
            <Card className="p-6 rounded-2xl border border-border bg-accent shadow-soft">
                <CardHeader>
                    <CardTitle className="text-2xl text-foreground">Legacy Timeline</CardTitle>
                    <p className="text-muted-foreground">Visualizing your life chapters</p>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {chapterStats.map(({ chapter, label, count, description }) => (
                            <div key={chapter} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-primary">{label}</span>
                                    <span className="text-muted-foreground">{count} stories</span>
                                </div>
                                <div className="relative h-8">
                                    <div className="absolute inset-0 bg-muted rounded-full" />
                                    <div 
                                        className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
                                        style={{ 
                                            width: `${count ? Math.max(5, (count / Math.max(...Object.values(storiesByChapter).map(s => s.length))) * 100) : 0}%`,
                                            opacity: count ? 1 : 0.3
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Chapter List */}
            <div className="space-y-6">
                {chapterStats.map(({ chapter, label }) => {
                    const chapterStories = storiesByChapter[chapter] || [];
                    if (chapterStories.length === 0) return null;

                    return (
                        <Card key={chapter} className="rounded-2xl border border-border bg-accent shadow-soft">
                            <CardHeader 
                                className="cursor-pointer hover:bg-primary/5 rounded-t-2xl"
                                onClick={() => {
                                    const newExpanded = new Set(expandedChapters);
                                    if (newExpanded.has(chapter)) {
                                        newExpanded.delete(chapter);
                                    } else {
                                        newExpanded.add(chapter);
                                    }
                                    setExpandedChapters(newExpanded);
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl text-foreground">
                                            {label}
                                        </CardTitle>
                                        <p className="text-muted-foreground">
                                            {CHAPTER_DESCRIPTIONS[chapter]}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                                        {expandedChapters.has(chapter) ? (
                                            <ChevronDown className="h-6 w-6" />
                                        ) : (
                                            <ChevronRight className="h-6 w-6" />
                                        )}
                                    </Button>
                                </div>
                            </CardHeader>
                            {expandedChapters.has(chapter) && (
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {chapterStories.map((story) => (
                                            <Card
                                                key={story.id}
                                                className="hover:shadow-md transition-shadow p-6 rounded-xl border border-border bg-background"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold text-foreground">
                                                            {story.title}
                                                        </h3>
                                                        <div className="flex items-center text-muted-foreground text-sm">
                                                            <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                                                            {new Date(story.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {editingStory === story.id ? (
                                                            <Select
                                                                value={story.life_chapter}
                                                                onValueChange={(value) => handleUpdateChapter(story.id, value as LifeChapter)}
                                                            >
                                                                <SelectTrigger className="w-[180px]">
                                                                    <SelectValue placeholder="Select chapter" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {Object.entries(CHAPTER_LABELS).map(([value, label]) => (
                                                                        <SelectItem key={value} value={value}>
                                                                            {label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-primary hover:bg-primary/10"
                                                                    onClick={() => setEditingStory(story.id)}
                                                                >
                                                                    <Edit className="h-5 w-5" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="text-primary hover:bg-primary/10"
                                                                    onClick={() => router.push(`/dashboard/stories/${story.id}`)}
                                                                >
                                                                    <BookOpen className="h-5 w-5" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {story.chapter_metadata && (
                                                    <div className="mt-4 pt-4 border-t border-border">
                                                        <div className="flex flex-wrap gap-2">
                                                            {story.chapter_metadata.key_events.map((event, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                                                >
                                                                    {event}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
} 