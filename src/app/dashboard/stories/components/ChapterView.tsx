'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, CalendarDays, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LifeChapter, CHAPTER_LABELS, CHAPTER_DESCRIPTIONS } from '@/types/story';

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

interface ChapterViewProps {
    stories: Story[];
}

export function ChapterView({ stories }: ChapterViewProps) {
    const router = useRouter();
    const [expandedChapters, setExpandedChapters] = useState<Set<LifeChapter>>(new Set());

    // Group stories by life chapter
    const storiesByChapter = stories.reduce((acc, story) => {
        const chapter = story.life_chapter || 'mid_life';
        if (!acc[chapter]) {
            acc[chapter] = [];
        }
        acc[chapter].push(story);
        return acc;
    }, {} as Record<LifeChapter, Story[]>);

    const toggleChapter = (chapter: LifeChapter) => {
        const newExpanded = new Set(expandedChapters);
        if (newExpanded.has(chapter)) {
            newExpanded.delete(chapter);
        } else {
            newExpanded.add(chapter);
        }
        setExpandedChapters(newExpanded);
    };

    const handleStoryClick = (storyId: string) => {
        router.push(`/dashboard/stories/${storyId}`);
    };

    // Get all chapters in chronological order
    const allChapters: LifeChapter[] = [
        'early_childhood',
        'childhood',
        'teenage_years',
        'young_adult',
        'college',
        'early_career',
        'career_growth',
        'family_life',
        'mid_life',
        'late_career',
        'retirement',
        'legacy'
    ];

    return (
        <div className="space-y-6">
            {allChapters.map((chapter) => {
                const chapterStories = storiesByChapter[chapter] || [];
                if (chapterStories.length === 0) return null;

                return (
                    <Card key={chapter} className="rounded-3xl border-2 border-gray-100">
                        <CardHeader 
                            className="cursor-pointer hover:bg-gray-50 rounded-t-3xl"
                            onClick={() => toggleChapter(chapter)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl text-[#3c4f76]">
                                        {CHAPTER_LABELS[chapter]}
                                    </CardTitle>
                                    <p className="text-[#383f51]">
                                        {CHAPTER_DESCRIPTIONS[chapter]}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-[#3c4f76]">
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
                                            className="hover:shadow-md transition-shadow p-6 rounded-2xl border cursor-pointer"
                                            onClick={() => handleStoryClick(story.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-semibold text-[#3c4f76]">
                                                        {story.title}
                                                    </h3>
                                                    <div className="flex items-center text-[#383f51] text-sm">
                                                        <CalendarDays className="mr-2 h-4 w-4" />
                                                        {new Date(story.created_at).toLocaleDateString()}
                                                    </div>
                                                    <p className="text-[#383f51] line-clamp-2">
                                                        {story.content}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-[#3c4f76]"
                                                >
                                                    <BookOpen className="h-5 w-5" />
                                                </Button>
                                            </div>
                                            {story.chapter_metadata && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <div className="flex flex-wrap gap-2">
                                                        {story.chapter_metadata.key_events.map((event, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 rounded-full bg-[#3c4f76]/10 text-[#3c4f76] text-sm"
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
    );
} 