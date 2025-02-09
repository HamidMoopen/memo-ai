'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Clock,
    Hash,
    MessageCircle,
    Star,
    ChevronRight,
    BarChart as BarChartIcon
} from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TopicChart } from "./components/TopicChart";
import { BackButton } from "@/components/ui/back-button";

// Mock data (in a real app, this would come from your API)
const mockTopicStats = [
    { name: "Family", count: 15 },
    { name: "Career", count: 10 },
    { name: "Education", count: 8 },
    { name: "Travel", count: 6 },
    { name: "Relationships", count: 12 },
];

const mockRecentStories = [
    { id: 1, title: "My First Job", updatedAt: "2024-03-20" },
    { id: 2, title: "College Years", updatedAt: "2024-03-18" },
    { id: 3, title: "Family Vacation", updatedAt: "2024-03-15" },
];

export default function InsightsPage() {
    return (
        <div className="min-h-screen bg-memory-cream">
            <DashboardHeader title="Life Story Insights" description="Track and analyze your life story progress" />

            <div className="container mx-auto px-8 py-12">

                {/* Stats Grid */}
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
                    {[
                        {
                            title: "Total Stories",
                            value: "15",
                            change: "+2 from last week",
                            icon: MessageCircle
                        },
                        {
                            title: "Recording Time",
                            value: "2.5 hours",
                            change: "+30 minutes this week",
                            icon: Clock
                        },
                        {
                            title: "Topics",
                            value: "24",
                            change: "Across all stories",
                            icon: Hash
                        },
                        {
                            title: "Key Memories",
                            value: "12",
                            change: "Important life moments",
                            icon: Star
                        }
                    ].map((stat) => (
                        <div key={stat.title} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
                                <stat.icon className="w-6 h-6 text-memory-purple/60" />
                            </div>
                            <div className="text-3xl font-bold text-memory-purple">{stat.value}</div>
                            <p className="text-base text-gray-500 mt-2">{stat.change}</p>
                        </div>
                    ))}
                </div>

                {/* Charts and Recent Stories */}
                <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                    {/* Topic Distribution */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="mb-6">
                            <h2 className="text-2xl font-serif text-memory-purple">Topic Distribution</h2>
                            <p className="text-lg text-gray-600 mt-2">Most frequently discussed subjects</p>
                        </div>
                        <TopicChart data={mockTopicStats} />
                    </div>

                    {/* Recent Stories */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="mb-6">
                            <h2 className="text-2xl font-serif text-memory-purple">Recent Stories</h2>
                            <p className="text-lg text-gray-600 mt-2">Your latest recorded memories</p>
                        </div>
                        <div className="space-y-6">
                            {mockRecentStories.map((story) => (
                                <div
                                    key={story.id}
                                    className="p-6 rounded-xl border-2 border-gray-200 hover:bg-memory-cream transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-medium text-memory-purple">{story.title}</h3>
                                            <p className="text-base text-gray-500 mt-1">
                                                {new Date(story.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Link href={`/story/${story.id}`}>
                                            <Button
                                                variant="ghost"
                                                className="hover:text-memory-purple p-4"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}