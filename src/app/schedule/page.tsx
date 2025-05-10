'use client';

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Clock, Phone } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { useNavigation } from "@/contexts/NavigationContext"
import { usePathname } from "next/navigation"

export default function SchedulePage() {
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [frequency, setFrequency] = useState("weekly")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const pathname = usePathname();
    const { addToHistory } = useNavigation();

    useEffect(() => {
        // Add current path to navigation history
        addToHistory(pathname);
    }, [pathname, addToHistory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Here you would typically send this data to your API
        // For now, we'll just simulate a successful submission
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)

            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSuccess(false)
                setName("")
                setPhoneNumber("")
                setDate("")
                setTime("")
                setFrequency("weekly")
            }, 3000)
        }, 1500)
    }

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
                        <h2 className="text-4xl font-bold text-foreground">Schedule Your Story Calls</h2>
                        <p className="text-xl text-muted-foreground">Set up regular times for us to call you and capture your stories.</p>
                    </div>

                    <div className="bg-accent rounded-2xl border border-border p-8 shadow-soft">
                        {isSuccess ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-4">Call Scheduled!</h3>
                                <p className="text-muted-foreground text-lg">We'll call you at the scheduled time.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-6">
                                    <label className="block text-foreground font-medium">
                                        Phone Number
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="mt-2 block w-full rounded-xl border border-border px-4 py-3 focus:border-primary focus:outline-none bg-background"
                                            placeholder="(123) 456-7890"
                                            required
                                        />
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <label className="block text-foreground font-medium">
                                            Date
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="mt-2 block w-full rounded-xl border border-border pl-12 pr-4 py-3 focus:border-primary focus:outline-none bg-background"
                                                    required
                                                />
                                            </div>
                                        </label>

                                        <label className="block text-foreground font-medium">
                                            Time
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="time"
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    className="mt-2 block w-full rounded-xl border border-border pl-12 pr-4 py-3 focus:border-primary focus:outline-none bg-background"
                                                    required
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <label className="block text-foreground font-medium">
                                        Frequency
                                        <select
                                            value={frequency}
                                            onChange={(e) => setFrequency(e.target.value)}
                                            className="mt-2 block w-full rounded-xl border border-border px-4 py-3 focus:border-primary focus:outline-none bg-background"
                                            required
                                        >
                                            <option value="once">Just once</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="biweekly">Every two weeks</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-xl bg-primary text-primary-foreground font-medium text-lg shadow-soft transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"}`}
                                >
                                    {isSubmitting ? "Scheduling..." : "Schedule Call"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Upcoming Scheduled Calls */}
                    <div className="bg-accent rounded-2xl border border-border p-8 shadow-soft">
                        <h3 className="text-2xl font-bold text-foreground mb-8">Your Upcoming Calls</h3>

                        <div className="space-y-6">
                            {/* Example scheduled calls - in a real app, these would come from your database */}
                            <div className="p-6 border border-border rounded-xl flex items-center justify-between hover:border-primary hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Phone className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-medium text-foreground">Weekly Story Call</h4>
                                        <p className="text-muted-foreground">Sunday, June 12 • 2:00 PM</p>
                                    </div>
                                </div>
                                <button className="text-primary hover:text-primary/90">Cancel</button>
                            </div>

                            <div className="p-6 border border-border rounded-xl flex items-center justify-between hover:border-primary hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Phone className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-medium text-foreground">Weekly Story Call</h4>
                                        <p className="text-muted-foreground">Sunday, June 19 • 2:00 PM</p>
                                    </div>
                                </div>
                                <button className="text-primary hover:text-primary/90">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 