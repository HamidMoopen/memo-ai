"use client"

import Link from "next/link"
import { useState } from "react"
import { PhoneCall, Calendar, BookOpen, ChevronLeft, Mic, Plus, Play, Flame, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const recentStories = [
    {
        title: "My First Day at School",
        date: "2 days ago",
        snippet: "It was a bright morning when..."
    },
    {
        title: "Family Vacation",
        date: "1 week ago",
        snippet: "We packed our bags and headed..."
    },
    {
        title: "Grandpa's Advice",
        date: "3 weeks ago",
        snippet: "He always said, 'Be kind...'"
    }
]

export default function StoryJournalPage() {
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [callSuccess, setCallSuccess] = useState(false)

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits
        const value = e.target.value.replace(/\D/g, '')
        setPhoneNumber(value)
        setError("")
    }

    const formatPhoneNumber = (value: string) => {
        if (!value) return value

        // Format as (XXX) XXX-XXXX
        const phoneNumberLength = value.length
        if (phoneNumberLength < 4) return value
        if (phoneNumberLength < 7) {
            return `(${value.slice(0, 3)}) ${value.slice(3)}`
        }
        return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
    }

    const handleSubmit = async () => {
        // Validate US phone number (10 digits)
        if (phoneNumber.replace(/\D/g, '').length !== 10) {
            setError("Please enter a valid 10-digit US phone number")
            return
        }

        setIsSubmitting(true)

        try {
            // Format phone number for API call (E.164 format)
            const formattedNumber = `+1${phoneNumber.replace(/\D/g, '')}`

            // Call the server-side API route that will use the Vapi SDK
            const response = await fetch('/api/initiate-call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: formattedNumber,
                    // You can add additional metadata here if needed
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to initiate call')
            }

            // Call initiated successfully
            setCallSuccess(true)
            setTimeout(() => {
                setIsCallModalOpen(false)
                setPhoneNumber("")
                setCallSuccess(false)
            }, 3000) // Close modal after showing success message

        } catch (err) {
            setIsSubmitting(false)
            setError(err instanceof Error ? err.message : "Failed to initiate call. Please try again.")
            console.error("Call initiation error:", err)
        }
    }

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            {/* Dark Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#10151c] via-[#181f2a] to-[#22304a]" />
            <main className="relative z-10">
                {/* Progress & Encouragement */}
                <div className="max-w-3xl mx-auto w-full px-4 pt-10 pb-4 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-2">
                        <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                        <span className="font-semibold text-lg text-foreground drop-shadow-md">You're building your Storybook!</span>
                        <span className="ml-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {streak} week streak
                        </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-border/60 overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-700"
                            style={{ width: `${(storiesThisWeek / weeklyGoal) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between w-full text-xs text-muted-foreground mb-2">
                        <span>{storiesThisWeek} stories this week</span>
                        <span>Goal: {weeklyGoal}</span>
                    </div>
                    <div className="text-center text-base text-muted-foreground mb-2">
                        {storiesThisWeek < weeklyGoal
                            ? `You're ${weeklyGoal - storiesThisWeek} story away from your weekly goal!`
                            : "Amazing! You've hit your goal this week!"}
                    </div>
                    <div className="text-center text-lg font-medium text-foreground drop-shadow-md mb-4">
                        Ready for your next memory?
                    </div>
                </div>

                {/* Journal-like interface */}
                <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-[#3c4f76]/10">
                    {/* Add a Story by Phone Call */}
                    <button
                        onClick={() => setIsCallModalOpen(true)}
                        className="w-full mb-8 p-6 flex items-center justify-between bg-[#faf9f6] rounded-2xl border-2 border-[#3c4f76]/20 hover:border-[#3c4f76] transition-all duration-300 group"
                    >
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-[#3c4f76] flex items-center justify-center mr-4 group-hover:bg-[#2a3b5a] transition-colors">
                                <PhoneCall className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-[#3c4f76]">Add a Story by Phone Call</h3>
                                <p className="text-[#383f51]/70">Share your memories through a guided conversation</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#3c4f76]/10 flex items-center justify-center group-hover:bg-[#3c4f76]/20 transition-colors">
                            <span className="text-[#3c4f76] font-bold">+</span>
                        </div>
                    </button>

                    {/* Add a Story through our Agent */}
                    <Link
                        href="/topics"
                        className="w-full mb-8 p-6 flex items-center justify-between bg-[#faf9f6] rounded-2xl border-2 border-[#3c4f76]/20 hover:border-[#3c4f76] transition-all duration-300 group"
                    >
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-[#3c4f76] flex items-center justify-center mr-4 group-hover:bg-[#2a3b5a] transition-colors">
                                <Mic className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-[#3c4f76]">Add a Story through our site</h3>
                                <p className="text-[#383f51]/70">Record your story directly on our platform</p>
                            </div>
                        </div>
                    </Link>

                    {/* Set Up Weekly Calls */}
                    <Link
                        href="/schedule"
                        className="w-full p-6 flex items-center justify-between bg-[#faf9f6] rounded-2xl border-2 border-[#3c4f76]/20 hover:border-[#3c4f76] transition-all duration-300 group"
                    >
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-full bg-[#3c4f76] flex items-center justify-center mr-4 group-hover:bg-[#2a3b5a] transition-colors">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-[#3c4f76]">Set Up Weekly Calls</h3>
                                <p className="text-[#383f51]/70">Schedule regular times to capture your stories</p>
                            </div>
                        </div>
                        ))}
                </div>
        </div>
            </main >

        {/* Call Modal with Phone Number Input */ }
    {
        isCallModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                    <h3 className="text-2xl font-bold text-[#3c4f76] mb-4">Start Your Story Call</h3>

                    {callSuccess ? (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-[#3c4f76]">Call initiated!</p>
                            <p className="text-[#383f51]/70">You'll receive a call shortly.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-[#383f51] mb-6">
                                Enter your phone number below and we'll call you right away. Our voice assistant will guide you through sharing your story.
                            </p>

                            <div className="mb-6">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#383f51] mb-2">
                                    Your Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    value={formatPhoneNumber(phoneNumber)}
                                    onChange={handlePhoneNumberChange}
                                    placeholder="(123) 456-7890"
                                    className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-[#3c4f76]/30'} focus:outline-none focus:ring-2 focus:ring-[#3c4f76]/50`}
                                />
                                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setIsCallModalOpen(false)
                                        setPhoneNumber("")
                                        setError("")
                                    }}
                                    className="px-6 py-2 rounded-xl border border-[#3c4f76] text-[#3c4f76]"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !phoneNumber}
                                    className={`px-6 py-2 rounded-xl ${isSubmitting || !phoneNumber ? 'bg-[#3c4f76]/50' : 'bg-[#3c4f76] hover:bg-[#2a3b5a]'} text-white transition-colors`}
                                >
                                    {isSubmitting ? 'Initiating Call...' : 'Call Me Now'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
        </div >
    )
}