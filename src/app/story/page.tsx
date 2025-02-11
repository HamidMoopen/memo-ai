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
            <div className="min-h-screen bg-[#faf9f6] p-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-[#3c4f76] mb-4">Error</h1>
                    <p className="text-[#383f51]">Failed to load story data.</p>
                    <Link href="/topics" className="text-[#3c4f76] mt-4 inline-block">
                        <ChevronLeft className="w-6 h-6 inline-block" /> Back to Topics
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link href="/topics" className="text-[#3c4f76]">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#3c4f76] ml-4">Your Story</h1>
                </div>

                <div className="space-y-8">
                    {/* Narrative */}
                    <section className="bg-white p-8 rounded-3xl shadow">
                        <h2 className="text-xl font-bold text-[#3c4f76] mb-4">Story</h2>
                        <p className="text-[#383f51] leading-relaxed">{storyData.story_narrative}</p>
                    </section>

                    {/* Key Themes */}
                    <section className="bg-white p-8 rounded-3xl shadow">
                        <h2 className="text-xl font-bold text-[#3c4f76] mb-4">Key Themes</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {storyData.key_themes.map((theme, index) => (
                                <li key={index} className="text-[#383f51]">{theme}</li>
                            ))}
                        </ul>
                    </section>

                    {/* Notable Quotes */}
                    <section className="bg-white p-8 rounded-3xl shadow">
                        <h2 className="text-xl font-bold text-[#3c4f76] mb-4">Notable Quotes</h2>
                        <ul className="space-y-4">
                            {storyData.notable_quotes.map((quote, index) => (
                                <li key={index} className="text-[#383f51] italic">"{quote}"</li>
                            ))}
                        </ul>
                    </section>

                    {/* Historical Context */}
                    <section className="bg-white p-8 rounded-3xl shadow">
                        <h2 className="text-xl font-bold text-[#3c4f76] mb-4">Historical Context</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-[#3c4f76] mb-2">Time Periods</h3>
                                <ul className="list-disc list-inside text-[#383f51]">
                                    {storyData.historical_context.time_periods.map((period, index) => (
                                        <li key={index}>{period}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-[#3c4f76] mb-2">Events</h3>
                                <ul className="list-disc list-inside text-[#383f51]">
                                    {storyData.historical_context.events.map((event, index) => (
                                        <li key={index}>{event}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium text-[#3c4f76] mb-2">Cultural Context</h3>
                                <ul className="list-disc list-inside text-[#383f51]">
                                    {storyData.historical_context.cultural_context.map((context, index) => (
                                        <li key={index}>{context}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Follow-up Topics */}
                    <section className="bg-white p-8 rounded-3xl shadow">
                        <h2 className="text-xl font-bold text-[#3c4f76] mb-4">Follow-up Topics</h2>
                        <ul className="list-disc list-inside space-y-2">
                            {storyData.follow_up_topics.map((topic, index) => (
                                <li key={index} className="text-[#383f51]">{topic}</li>
                            ))}
                        </ul>
                    </section>
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