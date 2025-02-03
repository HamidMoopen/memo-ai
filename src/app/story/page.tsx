'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { StoryData } from '@/types/story';

function StoryContent() {
    const searchParams = useSearchParams();
    const storyDataParam = searchParams.get('data');
    let storyData: StoryData | null = null;

    try {
        if (storyDataParam) {
            storyData = JSON.parse(decodeURIComponent(storyDataParam));
        }
    } catch (error) {
        console.error('Failed to parse story data:', error);
    }

    if (!storyData) {
        return (
            <div className="min-h-screen bg-[#461635] text-white p-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-serif mb-4">Error</h1>
                    <p>Failed to load story data.</p>
                    <Link href="/topics" className="text-white mt-4 inline-block">
                        <ChevronLeft className="w-6 h-6 inline-block" /> Back to Topics
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#461635] text-white p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link href="/topics" className="text-white">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-serif ml-4">Your Story</h1>
                </div>

                <div className="space-y-8">
                    {/* Narrative */}
                    <section className="bg-white/10 p-6 rounded-lg">
                        <h2 className="text-xl font-serif mb-4">Story</h2>
                        <p className="text-white/90 leading-relaxed">{storyData.story_narrative}</p>
                    </section>

                    {/* Key Themes */}
                    <section className="bg-white/10 p-6 rounded-lg">
                        <h2 className="text-xl font-serif mb-4">Key Themes</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {storyData.key_themes.map((theme, index) => (
                                <li key={index} className="text-white/90">{theme}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Notable Quotes */}
                    <section className="bg-white/10 p-6 rounded-lg">
                        <h2 className="text-xl font-serif mb-4">Notable Quotes</h2>
                        <ul className="space-y-4">
                            {storyData.notable_quotes.map((quote, index) => (
                                <li key={index} className="text-white/90 italic">"{quote}"</li>
                            ))}
                        </ul>
                    </section>

                    {/* Historical Context */}
                    <section className="bg-white/10 p-6 rounded-lg">
                        <h2 className="text-xl font-serif mb-4">Historical Context</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-2">Time Periods</h3>
                                <ul className="list-disc list-inside">
                                    {storyData.historical_context.time_periods.map((period, index) => (
                                        <li key={index} className="text-white/90">{period}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Events</h3>
                                <ul className="list-disc list-inside">
                                    {storyData.historical_context.events.map((event, index) => (
                                        <li key={index} className="text-white/90">{event}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium mb-2">Cultural Context</h3>
                                <ul className="list-disc list-inside">
                                    {storyData.historical_context.cultural_context.map((context, index) => (
                                        <li key={index} className="text-white/90">{context}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Follow-up Topics */}
                    <section className="bg-white/10 p-6 rounded-lg">
                        <h2 className="text-xl font-serif mb-4">Follow-up Topics</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {storyData.follow_up_topics.map((topic, index) => (
                                <li key={index} className="text-white/90">{topic}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="prose prose-sm mt-4">
                    <p>Here&apos;s what we&apos;ve captured from your conversation.</p>
                </div>
            </div>
        </div>
    );
}

export default function StoryPage() {
    return (
        <Suspense fallback={<div>Loading story...</div>}>
            <StoryContent />
        </Suspense>
    );
} 