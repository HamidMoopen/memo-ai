"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { PhoneCall, Calendar, BookOpen, ChevronLeft, Mic, Plus, Play, Flame, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { supabase } from '@/lib/supabaseBrowserClient'
import { useToast } from "@/components/ui/use-toast"
import Vapi from '@vapi-ai/web'

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

// Types for VAPI events
interface ConversationUpdate {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

interface ConversationSummary {
    transcript: string;
    duration: number;
    metadata: {
        topics: string[];
        sentiment: string;
    };
}

// Initialize VAPI client
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || '')

// Helper function to format phone number to E.164
function formatToE164(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '')
    
    // If number starts with '1', remove it
    const withoutCountryCode = digits.startsWith('1') ? digits.slice(1) : digits
    
    // Ensure 10 digits
    if (withoutCountryCode.length !== 10) {
        throw new Error('Phone number must be exactly 10 digits')
    }
    
    return `+1${withoutCountryCode}`
}

export default function StoryJournalPage() {
    const [isCallModalOpen, setIsCallModalOpen] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [hoveredStory, setHoveredStory] = useState<number | null>(null)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [isLoadingProfile, setIsLoadingProfile] = useState(true)
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationStep, setVerificationStep] = useState<'input' | 'verify' | 'confirmed'>('input')
    const { toast } = useToast()
    const storiesThisWeek = 2
    const weeklyGoal = 3
    const streak = 4

    // Load user's profile and phone number
    useEffect(() => {
        async function loadProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('phone_number, phone_number_verified')
                        .eq('id', user.id)
                        .single()
                    
                    if (profile?.phone_number) {
                        setPhoneNumber(profile.phone_number)
                        setVerificationStep(profile.phone_number_verified ? 'confirmed' : 'verify')
                    }
                }
            } catch (error) {
                console.error('Error loading profile:', error)
            } finally {
                setIsLoadingProfile(false)
            }
        }
        loadProfile()
    }, [])

    // Function to save phone number to profile
    const savePhoneNumber = async (number: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) {
                throw new Error('Not authenticated')
            }

            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    phoneNumber: number,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to save phone number')
            }

            console.log('Profile saved successfully')
        } catch (error) {
            console.error('Error saving phone number:', error)
            throw error
        }
    }

    // Function to handle phone calls
    const startPhoneCall = async () => {
        try {
            if (!phoneNumber) {
                toast({
                    title: "Phone number required",
                    description: "Please enter your phone number to receive the call.",
                    variant: "destructive"
                })
                return
            }

            // Format phone number to E.164
            let formattedPhoneNumber: string
            try {
                formattedPhoneNumber = formatToE164(phoneNumber)
            } catch (error) {
                toast({
                    title: "Invalid phone number",
                    description: "Please enter a valid 10-digit US phone number.",
                    variant: "destructive"
                })
                return
            }

            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) {
                throw new Error('Not authenticated')
            }

            // VAPI configuration
            const assistantId = '8840fd84-49f0-4404-ae3d-3002ee1d2d51'
            const phoneNumberId = '732cec66-0a2f-4d7a-888f-904b88136202'
            const type = 'outbound'

            // Log the call configuration
            console.log('📞 Initiating VAPI call:', {
                assistantId,
                phoneNumberId,
                customerPhoneNumber: formattedPhoneNumber,
                type,
                timestamp: new Date().toISOString()
            })

            const response = await fetch('/api/call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    assistantId,
                    phoneNumberId,
                    customerPhoneNumber: formattedPhoneNumber,
                    type
                }),
            })

            const data = await response.json()
            if (!response.ok) {
                console.error('❌ Call API error:', data)
                throw new Error(data.error || 'Failed to initiate call')
            }
            
            console.log('✅ Call initiated successfully:', data)
            
            setIsCallModalOpen(false)
            toast({
                title: "Call initiated!",
                description: "You will receive a call shortly at " + formattedPhoneNumber,
                duration: 5000,
            })

            // Save the verified phone number to profile
            await savePhoneNumber(formattedPhoneNumber)
        } catch (error) {
            console.error('❌ Error initiating call:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to initiate call. Please try again.",
                variant: "destructive"
            })
        }
    }

    // Function to handle direct web recording
    const startWebRecording = async () => {
        try {
            setIsRecording(true)
            const call = await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '')
            
            // Handle conversation updates
            vapi.on('message', (update: ConversationUpdate) => {
                console.log('Conversation update:', update)
                // TODO: Update UI with real-time transcript
            })

            // Handle conversation end
            vapi.on('call-end', () => {
                console.log('Conversation ended')
                setIsRecording(false)
                // TODO: Save conversation to Supabase
            })

        } catch (error) {
            console.error('Error starting recording:', error)
            setIsRecording(false)
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

                {/* Interactive Recording Choices */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
                    {/* Phone Call Option */}
                    <button
                        onClick={() => setIsCallModalOpen(true)}
                        className="relative group focus:outline-none"
                    >
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-card/90 backdrop-blur-md shadow-xl border-2 border-primary/20 flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:-rotate-2 group-active:scale-95 group-hover:border-primary/60">
                            <PhoneCall className="w-14 h-14 text-primary mb-2 drop-shadow-lg" />
                            <span className="text-xl font-bold text-foreground">Phone Call</span>
                            <span className="text-sm text-muted-foreground mt-1">Guided conversation</span>
                            <span className="absolute -top-3 -right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md animate-bounce">New</span>
                        </div>
                    </button>
                    {/* Direct Recording Option */}
                    <button 
                        onClick={startWebRecording}
                        className="relative group focus:outline-none"
                        disabled={isRecording}
                    >
                        <div className={cn(
                            "w-40 h-40 md:w-48 md:h-48 rounded-full bg-card/90 backdrop-blur-md shadow-xl border-2 border-primary/20 flex flex-col items-center justify-center transition-all duration-300",
                            "group-hover:scale-105 group-hover:shadow-2xl group-hover:rotate-2 group-active:scale-95 group-hover:border-primary/60",
                            isRecording && "border-red-500/60 animate-pulse"
                        )}>
                            <Mic className={cn(
                                "w-14 h-14 mb-2 drop-shadow-lg",
                                isRecording ? "text-red-500" : "text-primary"
                            )} />
                            <span className="text-xl font-bold text-foreground">
                                {isRecording ? "Recording..." : "Direct Recording"}
                            </span>
                            <span className="text-sm text-muted-foreground mt-1">Record instantly</span>
                            <span className="absolute -top-3 -right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md animate-bounce">Popular</span>
                        </div>
                    </button>
                </div>

                {/* Recent Stories - Horizontal Scrollable Animated Stack */}
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-foreground drop-shadow-md">Recent Stories</h3>
                        <Button
                            variant="ghost"
                            className="text-primary hover:text-primary/90 text-lg"
                            asChild
                        >
                            <Link href="/dashboard/stories">View All</Link>
                        </Button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
                        {recentStories.map((story, idx) => (
                            <div
                                key={story.title}
                                className={cn(
                                    "relative min-w-[320px] max-w-xs h-44 rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-lg flex flex-col justify-between p-6 transition-all duration-300 cursor-pointer group",
                                    hoveredStory === idx && "scale-105 shadow-2xl border-primary/60"
                                )}
                                onMouseEnter={() => setHoveredStory(idx)}
                                onMouseLeave={() => setHoveredStory(null)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Play className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-foreground">{story.title}</h4>
                                        <span className="text-xs text-muted-foreground">{story.date}</span>
                                    </div>
                                </div>
                                <div className="flex-1 text-sm text-foreground mb-2">
                                    {story.snippet}
                                </div>
                                <div className="flex items-center justify-between">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-primary hover:bg-primary/10 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200"
                                    >
                                        <Play className="w-4 h-4 mr-1" /> Play Snippet
                                    </Button>
                                    {hoveredStory === idx && (
                                        <span className="text-xs text-emerald-600 font-semibold animate-fade-in">Keep going!</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Floating Record Now Button */}
            <button
                onClick={() => setIsCallModalOpen(true)}
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground px-8 py-4 rounded-full shadow-2xl text-lg font-bold flex items-center gap-3 hover:scale-105 hover:shadow-3xl transition-all duration-300 border-4 border-white/60 backdrop-blur-md"
            >
                <Mic className="w-6 h-6" /> Record Now
            </button>

            {/* Call Modal */}
            {isCallModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-background rounded-3xl p-8 max-w-md w-full shadow-soft border border-border animate-in">
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                    <PhoneCall className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold text-foreground mb-4">Start Your Story Call</h3>
                                <p className="text-muted-foreground text-lg">
                                    We'll call you and guide you through sharing your story. Our voice assistant will ask you questions about topics you're interested in.
                                </p>
                            </div>

                            {isLoadingProfile ? (
                                <div className="text-center">Loading...</div>
                            ) : (
                                <div className="space-y-4">
                                    {verificationStep === 'input' && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">
                                                Your Phone Number
                                            </label>
                                            <Input
                                                type="tel"
                                                placeholder="+1 (555) 555-5555"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Enter your phone number to receive the call
                                            </p>
                                        </div>
                                    )}

                                    {verificationStep === 'verify' && (
                                        <div className="text-center space-y-4">
                                            <div className="flex items-center justify-center gap-2 text-primary">
                                                <Check className="w-5 h-5" />
                                                <span>Number saved: {phoneNumber}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                We'll verify your number with a test call
                                            </p>
                                        </div>
                                    )}

                                    {verificationStep === 'confirmed' && (
                                        <div className="text-center space-y-4">
                                            <div className="flex items-center justify-center gap-2 text-primary">
                                                <Check className="w-5 h-5" />
                                                <span>Verified number: {phoneNumber}</span>
                                            </div>
                                            <button
                                                onClick={() => setVerificationStep('input')}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                Use a different number
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCallModalOpen(false)}
                                    className="border-border hover:border-primary px-6 py-3 text-lg"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={startPhoneCall}
                                    disabled={!phoneNumber || isLoadingProfile}
                                    className="bg-primary hover:bg-primary/90 px-6 py-3 text-lg"
                                >
                                    Call Me Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}