'use client';
import { Plus, ChevronRight, CalendarDays, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/DashboardHeader";
import { useRouter } from "next/navigation";

export default function ChaptersPage() {
    const router = useRouter();
    const mockChapters = [
        {
            id: 1,
            title: "Early Childhood",
            date: "1940-1945",
            topics: ["Family", "War", "School"],
            description: "Growing up during wartime in a small town...",
            storiesCount: 5,
        },
        {
            id: 2,
            title: "College Years",
            date: "1958-1962",
            topics: ["Education", "Friends", "Career"],
            description: "My journey through university and early career choices...",
            storiesCount: 3,
        },
        {
            id: 3,
            title: "Family & Career Beginnings",
            date: "1964-1973",
            topics: ["Career", "Marriage", "Family Life"],
            description: "Starting a new chapter with marriage and career growth...",
            storiesCount: 3,
        },
    ];

    const handleChapterClick = (chapterId: number) => {
        router.push(`/dashboard/chapters/${chapterId}`);
    };

    return (
        <div>
            <DashboardHeader
                title="Life Chapters"
                description="Organize your life story into chapters"
            />
            <div className="container mx-auto px-8 py-8">
                <div className="mb-8 flex justify-end">
                    <Button
                        className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white text-lg px-8 py-6 rounded-2xl"
                    >
                        <Plus className="mr-3 h-6 w-6" /> Add New Chapter
                    </Button>
                </div>

                <div className="grid gap-8">
                    {mockChapters.map((chapter) => (
                        <Card 
                            key={chapter.id}
                            className="hover:shadow-lg transition-shadow p-8 rounded-3xl border-2 border-gray-100 cursor-pointer"
                            onClick={() => handleChapterClick(chapter.id)}
                        >
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
                                <div>
                                    <CardTitle className="text-3xl mb-4 text-[#3c4f76] font-bold">
                                        {chapter.title}
                                    </CardTitle>
                                    <div className="flex items-center text-[#383f51] text-lg">
                                        <CalendarDays className="mr-3 h-5 w-5" />
                                        {chapter.date}
                                        <MessageSquare className="ml-6 mr-3 h-5 w-5" />
                                        {chapter.storiesCount} stories
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
                                <p className="text-xl text-[#383f51]/80 mb-6 leading-relaxed">
                                    {chapter.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {chapter.topics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="px-6 py-2 rounded-full bg-[#3c4f76]/10 text-[#3c4f76] text-lg font-medium"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}