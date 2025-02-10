'use client';
import { Plus, ChevronRight, CalendarDays, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/DashboardHeader";

export default function ChaptersPage() {
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
    ];

    return (
        <div className="min-h-screen bg-memory-cream">
            <DashboardHeader title="Life Chapters" description="Organize your life story into chapters" />
            <div className="container mx-auto px-8 py-12">
                <div className="mb-10 flex justify-end">
                    <Button
                        className="bg-memory-purple hover:bg-memory-purple-light text-white text-lg px-8 py-6 rounded-2xl"
                    >
                        <Plus className="mr-3 h-6 w-6" /> Add New Chapter
                    </Button>
                </div>

                <div className="grid gap-8">
                    {mockChapters.map((chapter) => (
                        <Card key={chapter.id} className="hover:shadow-xl transition-shadow p-8 rounded-3xl border-2">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6">
                                <div>
                                    <CardTitle className="text-3xl mb-4 text-memory-purple font-serif">
                                        {chapter.title}
                                    </CardTitle>
                                    <div className="flex items-center text-gray-600 text-lg">
                                        <CalendarDays className="mr-3 h-5 w-5" />
                                        {chapter.date}
                                        <MessageSquare className="ml-6 mr-3 h-5 w-5" />
                                        {chapter.storiesCount} stories
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-memory-purple p-4 hover:bg-memory-cream rounded-xl"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                                    {chapter.description}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {chapter.topics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="px-6 py-2 rounded-full bg-memory-purple/10 text-memory-purple text-lg font-medium"
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