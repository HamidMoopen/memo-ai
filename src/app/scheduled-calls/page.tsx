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
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto w-full px-8 py-12">
                <div className="flex items-center justify-between mb-12">
                    <BackButton />
                    <h1 className="text-2xl font-bold text-foreground">Eterna</h1>
                    <div className="w-8" />
                </div>

                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-foreground">Your Scheduled Calls</h2>
                        <p className="text-xl text-muted-foreground">
                            View and manage your upcoming and past story recording sessions.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`px-6 py-3 font-medium text-lg ${activeTab === "upcoming"
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-muted-foreground hover:text-primary/80"
                                }`}
                        >
                            Upcoming ({upcomingCalls.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("completed")}
                            className={`px-6 py-3 font-medium text-lg ${activeTab === "completed"
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-muted-foreground hover:text-primary/80"
                                }`}
                        >
                            Completed ({completedCalls.length})
                        </button>
                    </div>

                    {/* Call List */}
                    <div className="space-y-6">
                        {activeTab === "upcoming" && upcomingCalls.length === 0 && (
                            <div className="text-center py-12 bg-accent rounded-2xl border border-border shadow-soft">
                                <Calendar className="mx-auto h-12 w-12 text-primary/60 mb-4" />
                                <p className="text-xl text-foreground mb-6">You don't have any upcoming calls scheduled.</p>
                                <Button
                                    onClick={() => window.location.href = '/schedule'}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl shadow-soft"
                                >
                                    Schedule a Call
                                </Button>
                            </div>
                        )}

                        {activeTab === "completed" && completedCalls.length === 0 && (
                            <div className="text-center py-12 bg-accent rounded-2xl border border-border shadow-soft">
                                <CheckCircle className="mx-auto h-12 w-12 text-primary/60 mb-4" />
                                <p className="text-xl text-foreground">You don't have any completed calls yet.</p>
                            </div>
                        )}

                        {activeTab === "upcoming" &&
                            upcomingCalls.map((call) => (
                                <div
                                    key={call.id}
                                    className="bg-accent p-8 rounded-2xl border border-border shadow-soft hover:border-primary hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mr-6">
                                                <Phone className="w-7 h-7 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground">{call.title}</h3>
                                                <div className="flex items-center mt-2 text-muted-foreground">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span className="mr-4">{formatDate(call.date)}</span>
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>{formatTime(call.time)}</span>
                                                </div>
                                                <div className="mt-3">
                                                    <span className="text-sm bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                                                        {call.frequency === "once" ? "One-time" :
                                                            call.frequency === "weekly" ? "Weekly" :
                                                                call.frequency === "biweekly" ? "Bi-weekly" : "Monthly"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors"
                                                title="Edit call"
                                            >
                                                <Edit className="w-5 h-5 text-primary" />
                                            </button>
                                            <button
                                                onClick={() => cancelCall(call.id)}
                                                className="p-2.5 rounded-xl hover:bg-destructive/10 transition-colors"
                                                title="Cancel call"
                                            >
                                                <X className="w-5 h-5 text-destructive" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        {activeTab === "completed" &&
                            completedCalls.map((call) => (
                                <div
                                    key={call.id}
                                    className="bg-accent p-8 rounded-2xl border border-border shadow-soft"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mr-6">
                                                <CheckCircle className="w-7 h-7 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground">{call.title}</h3>
                                                <div className="flex items-center mt-2 text-muted-foreground">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    <span className="mr-4">{formatDate(call.date)}</span>
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    <span>{formatTime(call.time)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="text-primary border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
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
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl text-lg shadow-soft"
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