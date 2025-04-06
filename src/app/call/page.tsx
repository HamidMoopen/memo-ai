"use client"

import Link from "next/link"
import { useState } from "react"
import { PhoneCall, Calendar, BookOpen, ChevronLeft, Mic } from "lucide-react"

export default function StoryJournalPage() {
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <div className="container mx-auto px-8 py-8">
                <div className="flex items-center justify-between mb-12">
                    <Link href="/dashboard" className="text-[#3c4f76] hover:text-[#2a3b5a] transition-colors">
                        <ChevronLeft className="w-8 h-8" />
                    </Link>
                    <h1 className="text-2xl font-bold text-[#3c4f76]">Eterna</h1>
                    <div className="w-8" />
                </div>

                <div className="max-w-2xl mx-auto text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-[#3c4f76]">Your Living Storybook</h2>
                        <p className="text-xl text-[#383f51]/80">Each week, we'll add a new story to your book.</p>
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

                        {/* Hear What I Shared Last Time */}
                        <Link
                            href="/dashboard/stories"
                            className="w-full mb-8 p-6 flex items-center justify-between bg-[#faf9f6] rounded-2xl border-2 border-[#3c4f76]/20 hover:border-[#3c4f76] transition-all duration-300 group"
                        >
                            <div className="flex items-center">
                                <div className="w-14 h-14 rounded-full bg-[#3c4f76] flex items-center justify-center mr-4 group-hover:bg-[#2a3b5a] transition-colors">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-[#3c4f76]">Hear What I Shared Last Time</h3>
                                    <p className="text-[#383f51]/70">Review your previous stories and memories</p>
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
                        </Link>
                    </div>

                </div>
            </div>

            {/* Call Modal (placeholder) */}
            {isCallModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-[#3c4f76] mb-4">Start Your Story Call</h3>
                        <p className="text-[#383f51] mb-6">
                            We'll call you and guide you through sharing your story. Our voice assistant will ask you questions about topics you're interested in.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsCallModalOpen(false)}
                                className="px-6 py-2 rounded-xl border border-[#3c4f76] text-[#3c4f76]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Call initiation logic would go here
                                    setIsCallModalOpen(false)
                                }}
                                className="px-6 py-2 rounded-xl bg-[#3c4f76] text-white"
                            >
                                Call Me Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}