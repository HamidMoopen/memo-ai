'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Calendar, Clock, Phone, X, Edit, CheckCircle } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useNavigation } from "@/contexts/NavigationContext";
import { Button } from "@/components/ui/button";

// Dummy data for scheduled calls
const dummyScheduledCalls = [
    {
        id: "1",
        title: "Weekly Story Call",
        date: "2023-06-12",
        time: "14:00",
        frequency: "weekly",
        status: "upcoming"
    },
    {
        id: "2",
        title: "Family Memories",
        date: "2023-06-19",
        time: "15:30",
        frequency: "weekly",
        status: "upcoming"
    },
    {
        id: "3",
        title: "Childhood Stories",
        date: "2023-06-05",
        time: "10:00",
        frequency: "monthly",
        status: "completed"
    },
    {
        id: "4",
        title: "Career Journey",
        date: "2023-05-28",
        time: "16:00",
        frequency: "once",
        status: "completed"
    }
];

export default function ScheduledCallsPage() {
    const [scheduledCalls, setScheduledCalls] = useState(dummyScheduledCalls);
    const [activeTab, setActiveTab] = useState("upcoming");
    const pathname = usePathname();
    const { addToHistory } = useNavigation();

    useEffect(() => {
        // Add current path to navigation history
        addToHistory(pathname);
    }, [pathname, addToHistory]);

    const cancelCall = (id: string) => {
        setScheduledCalls(scheduledCalls.filter(call => call.id !== id));
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const upcomingCalls = scheduledCalls.filter(call => call.status === "upcoming");
    const completedCalls = scheduledCalls.filter(call => call.status === "completed");

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <div className="container mx-auto px-8 py-8">
                <div className="flex items-center justify-between mb-12">
                    <BackButton />
                    <h1 className="text-2xl font-bold text-[#3c4f76]">Eterna</h1>
                    <div className="w-8" />
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-[#3c4f76]">Your Scheduled Calls</h2>
                        <p className="text-xl text-[#383f51]/80">
                            View and manage your upcoming and past story recording sessions.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-[#3c4f76]/20">
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`px-6 py-3 font-medium text-lg ${activeTab === "upcoming"
                                    ? "text-[#3c4f76] border-b-2 border-[#3c4f76]"
                                    : "text-[#383f51]/60 hover:text-[#3c4f76]/80"
                                }`}
                        >
                            Upcoming ({upcomingCalls.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`px-6 py-3 font-medium text-lg ${activeTab === "completed"
                                    ? "text-[#3c4f76] border-b-2 border-[#3c4f76]"
                                    : "text-[#383f51]/60 hover:text-[#3c4f76]/80"
                                }`}
                        >
                            Completed ({completedCalls.length})
                        </button>
                    </div>

                    {/* Call List */}
                    <div className="space-y-4">
                        {activeTab === "upcoming" && upcomingCalls.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-3xl shadow-sm border-2 border-[#3c4f76]/10">
                                <Calendar className="mx-auto h-12 w-12 text-[#3c4f76]/60 mb-4" />
                                <p className="text-xl text-[#383f51] mb-6">You don't have any upcoming calls scheduled.</p>
                                <Button
                                    onClick={() => window.location.href = '/schedule'}
                                    className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white px-6 py-3 rounded-xl"
                                >
                                    Schedule a Call
                                </Button>
                            </div>
                        )}

                        {activeTab === "completed" && completedCalls.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-3xl shadow-sm border-2 border-[#3c4f76]/10">
                                <CheckCircle className="mx-auto h-12 w-12 text-[#3c4f76]/60 mb-4" />
                                <p className="text-xl text-[#383f51]">You don't have any completed calls yet.</p>
                            </div>
                        )}

                        {activeTab === "upcoming" &&
                            upcomingCalls.map((call) => (
                                <div
                                    key={call.id}
                                    className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#3c4f76]/10 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 rounded-2xl bg-[#3c4f76]/10 flex items-center justify-center mr-5">
                                                <Phone className="w-6 h-6 text-[#3c4f76]" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#3c4f76]">{call.title}</h3>
                                                <div className="flex items-center mt-1 text-[#383f51]/80">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span className="mr-4">{formatDate(call.date)}</span>
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>{formatTime(call.time)}</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className="text-sm bg-[#3c4f76]/10 text-[#3c4f76] px-3 py-1 rounded-full">
                                                        {call.frequency === "once" ? "One-time" :
                                                            call.frequency === "weekly" ? "Weekly" :
                                                                call.frequency === "biweekly" ? "Bi-weekly" : "Monthly"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 rounded-full hover:bg-[#3c4f76]/10 transition-colors"
                                                title="Edit call"
                                            >
                                                <Edit className="w-5 h-5 text-[#3c4f76]" />
                                            </button>
                                            <button
                                                onClick={() => cancelCall(call.id)}
                                                className="p-2 rounded-full hover:bg-red-100 transition-colors"
                                                title="Cancel call"
                                            >
                                                <X className="w-5 h-5 text-red-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {activeTab === "completed" &&
                            completedCalls.map((call) => (
                                <div
                                    key={call.id}
                                    className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#3c4f76]/10"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mr-5">
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#3c4f76]">{call.title}</h3>
                                                <div className="flex items-center mt-1 text-[#383f51]/80">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span className="mr-4">{formatDate(call.date)}</span>
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>{formatTime(call.time)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="text-[#3c4f76] border-[#3c4f76]/20 hover:bg-[#3c4f76]/10 hover:text-[#3c4f76]"
                                        >
                                            View Story
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Schedule New Call Button */}
                    {activeTab === "upcoming" && upcomingCalls.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <Button
                                onClick={() => window.location.href = '/schedule'}
                                className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white px-8 py-4 rounded-xl text-lg"
                            >
                                Schedule Another Call
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 