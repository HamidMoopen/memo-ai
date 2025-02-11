'use client';

import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This would typically come from an API or database
const mockChapters = [
    {
        id: 1,
        title: "Early Childhood",
        date: "1940-1945",
        topics: ["Family", "War", "School"],
        description: "Growing up during wartime in a small town...",
        storiesCount: 5,
        fullStory: "This is where the full story content would go...",
    },
    {
        id: 2,
        title: "College Years",
        date: "1958-1962",
        topics: ["Education", "Friends", "Career"],
        description: "My journey through university and early career choices...",
        storiesCount: 3,
        fullStory: "College years story content...",
    },
    {
        id: 3,
        title: "Family & Career Beginnings",
        date: "1964-1973",
        topics: ["Career", "Marriage", "Family Life"],
        description: "Starting a new chapter with marriage and career growth...",
        storiesCount: 3,
        summary: "The years between 1964 and 1973 marked a transformative period in my life, filled with personal milestones and professional growth. This chapter represents the foundation of both my family life and career, setting the stage for decades to come. From the joy of marriage to the challenges of establishing our first home and achieving career success, each experience shaped our future together.",
        stories: [
            {
                title: "Wedding Day",
                date: "June 1964",
                content: "Our wedding day in June 1964 was a beautiful blend of tradition and personal touches. The ceremony was held in my hometown's historic church, where my parents had also married. I still remember the nervous excitement as I waited to walk down the aisle, and the moment I first saw my soon-to-be wife in her elegant gown. The reception was a joyous celebration with family and friends, complete with my grandmother's secret recipe cake and dancing that lasted well into the evening. It was the perfect start to our life together."
            },
            {
                title: "First Home",
                date: "September 1965",
                content: "After saving for over a year, we purchased our first home in a growing neighborhood just outside the city. It was a modest two-bedroom house with a small garden, but to us, it was perfect. I remember spending weekends painting walls, planting flowers, and slowly furnishing each room. The kitchen became the heart of our home, where we'd share stories about our day over home-cooked meals. Though it needed some work, every repair and improvement made it feel more like ours. That little house taught us the true meaning of building a home together."
            },
            {
                title: "Career Milestone",
                date: "March 1968",
                content: "I remember the morning I got the news about my promotion to department manager. After three years of late nights and dedication, all those extra hours finally paid off. The transition wasn't easy - going from team member to leader brought its own challenges. I was fortunate to have Tom as my mentor, who'd share his wisdom over morning coffee. His advice about good leadership being about lifting others up really stuck with me. We started a training program that brought the team together, and watching my colleagues grow became the most rewarding part of the job. Those early days taught me that leadership isn't about being in charge - it's about helping others succeed."
            }
        ]
    }
];

export default function ChapterPage() {
    const router = useRouter();
    const params = useParams();
    const chapterId = Number(params.id);
    
    const chapter = mockChapters.find(c => c.id === chapterId);

    if (!chapter) {
        return (
            <div className="min-h-screen bg-[#faf9f6] p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-[#3c4f76] mb-4">Chapter not found</h1>
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        className="text-[#3c4f76]"
                    >
                        <ChevronLeft className="w-6 h-6 mr-2" />
                        Back to Chapters
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] p-8">
            <div className="max-w-4xl mx-auto">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    className="text-[#3c4f76] mb-8"
                >
                    <ChevronLeft className="w-6 h-6 mr-2" />
                    Back to Chapters
                </Button>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow">
                        <h1 className="text-4xl font-bold text-[#3c4f76] mb-4">{chapter.title}</h1>
                        <div className="text-lg text-[#383f51]/80 mb-6">{chapter.date}</div>
                        <div className="flex flex-wrap gap-3 mb-8">
                            {chapter.topics.map((topic) => (
                                <span
                                    key={topic}
                                    className="px-6 py-2 rounded-full bg-[#3c4f76]/10 text-[#3c4f76] text-lg font-medium"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                        {chapter.summary && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-[#3c4f76] mb-4">Chapter Summary</h2>
                                <p className="text-xl text-[#383f51] leading-relaxed">
                                    {chapter.summary}
                                </p>
                            </div>
                        )}
                        {chapter.stories && chapter.stories.map((story, index) => (
                            <div key={index} className="mb-12 last:mb-0">
                                <div className="flex items-baseline justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-[#3c4f76]">{story.title}</h2>
                                    <span className="text-lg text-[#383f51]/80">{story.date}</span>
                                </div>
                                <p className="text-xl text-[#383f51] leading-relaxed">
                                    {story.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 