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
        <div className="min-h-screen bg-[#faf9f6]">
            <div className="container mx-auto px-8 py-8">
                <div className="flex items-center justify-between mb-12">
                    <BackButton />
                    <h1 className="text-2xl font-bold text-[#3c4f76]">Eterna</h1>
                    <div className="w-8" />
                </div>

                <div className="max-w-2xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold text-[#3c4f76]">Schedule Your Story Calls</h2>
                        <p className="text-xl text-[#383f51]/80">Set up regular times for us to call you and capture your stories.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-[#3c4f76]/10">
                        {isSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#3c4f76] mb-2">Call Scheduled!</h3>
                                <p className="text-[#383f51]">We'll call you at the scheduled time.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="block text-[#3c4f76] font-medium">
                                        Phone Number
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-2 border-[#3c4f76]/20 px-4 py-3 focus:border-[#3c4f76] focus:outline-none"
                                            placeholder="(123) 456-7890"
                                            required
                                        />
                                    </label>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="block text-[#3c4f76] font-medium">
                                            Date
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c4f76]/60" size={18} />
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-2 border-[#3c4f76]/20 pl-12 pr-4 py-3 focus:border-[#3c4f76] focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </label>

                                        <label className="block text-[#3c4f76] font-medium">
                                            Time
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c4f76]/60" size={18} />
                                                <input
                                                    type="time"
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-2 border-[#3c4f76]/20 pl-12 pr-4 py-3 focus:border-[#3c4f76] focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </label>
                                    </div>

                                    <label className="block text-[#3c4f76] font-medium">
                                        Frequency
                                        <select
                                            value={frequency}
                                            onChange={(e) => setFrequency(e.target.value)}
                                            className="mt-1 block w-full rounded-xl border-2 border-[#3c4f76]/20 px-4 py-3 focus:border-[#3c4f76] focus:outline-none"
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
                                    className={`w-full py-4 rounded-xl bg-[#3c4f76] text-white font-medium transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#2a3b5a]"
                                        }`}
                                >
                                    {isSubmitting ? "Scheduling..." : "Schedule Call"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Upcoming Scheduled Calls */}
                    <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-[#3c4f76]/10">
                        <h3 className="text-xl font-bold text-[#3c4f76] mb-6">Your Upcoming Calls</h3>

                        <div className="space-y-4">
                            {/* Example scheduled calls - in a real app, these would come from your database */}
                            <div className="p-4 border-2 border-[#3c4f76]/10 rounded-xl flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-[#3c4f76]/10 flex items-center justify-center mr-4">
                                        <Phone className="w-5 h-5 text-[#3c4f76]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[#3c4f76]">Weekly Story Call</h4>
                                        <p className="text-sm text-[#383f51]/70">Sunday, June 12 • 2:00 PM</p>
                                    </div>
                                </div>
                                <button className="text-sm text-red-500 hover:text-red-700">Cancel</button>
                            </div>

                            <div className="p-4 border-2 border-[#3c4f76]/10 rounded-xl flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-[#3c4f76]/10 flex items-center justify-center mr-4">
                                        <Phone className="w-5 h-5 text-[#3c4f76]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-[#3c4f76]">Weekly Story Call</h4>
                                        <p className="text-sm text-[#383f51]/70">Sunday, June 19 • 2:00 PM</p>
                                    </div>
                                </div>
                                <button className="text-sm text-red-500 hover:text-red-700">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 