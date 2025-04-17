'use client';

import { useState } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, Mic, Mail, ArrowRight, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PublishPage() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const publishOptions = [
        {
            id: "printed",
            title: "Printed Memoir",
            description: "Transform your stories into a beautiful printed book",
            icon: BookText,
            image: "/images/book-sample.jpg",
            details: [
                "Professional book layout and design",
                "Choose from multiple font styles and formatting options",
                "Hardcover or softcover options available",
                "Include photos and memorabilia"
            ]
        },
        {
            id: "podcast",
            title: "Podcast Series",
            description: "Share your stories as audio episodes with your own voice",
            icon: Mic,
            image: "/images/podcast-sample.jpg",
            details: [
                "Professional audio editing",
                "Custom intro music and sound design",
                "Episodes up to 30 minutes each",
                "Distribution to major podcast platforms"
            ]
        },
        {
            id: "newsletter",
            title: "Email Newsletter",
            description: "Send your stories directly to friends and family",
            icon: Mail,
            image: "/images/newsletter-sample.jpg",
            details: [
                "Beautifully formatted email templates",
                "Automatic sending on your schedule",
                "Easy subscriber management",
                "Track who's reading your stories"
            ]
        }
    ];

    return (
        <div>
            <DashboardHeader
                title="Publish Your Stories"
                description="Share your life stories with the world in multiple formats"
            />

            <div className="container mx-auto px-4 py-8">
                <Alert className="mb-8 border-[#3c4f76]/20 bg-[#3c4f76]/5">
                    <Info className="h-5 w-5 text-[#3c4f76]" />
                    <AlertTitle className="text-[#3c4f76] font-medium text-lg">Coming Soon</AlertTitle>
                    <AlertDescription className="text-[#3c4f76]/80">
                        Our publishing features are currently in development. Select an option below to join the waitlist and be among the first to try it when released.
                    </AlertDescription>
                </Alert>

                {!selectedOption ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {publishOptions.map((option) => (
                            <Card
                                key={option.id}
                                className="rounded-3xl border-2 border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                                onClick={() => setSelectedOption(option.id)}
                            >
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-2xl text-[#3c4f76]">{option.title}</CardTitle>
                                    <CardDescription className="text-[#383f51] text-lg">
                                        {option.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#f5f5f5] flex items-center justify-center mb-4">
                                        {option.id === "printed" && (
                                            <BookText className="w-24 h-24 text-[#3c4f76]/40" />
                                        )}
                                        {option.id === "podcast" && (
                                            <Mic className="w-24 h-24 text-[#3c4f76]/40" />
                                        )}
                                        {option.id === "newsletter" && (
                                            <Mail className="w-24 h-24 text-[#3c4f76]/40" />
                                        )}
                                    </div>
                                    <Button className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white rounded-xl py-6 text-lg mt-auto">
                                        Learn More <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border-2 border-gray-100 p-8">
                        <Button
                            variant="ghost"
                            className="mb-6 text-[#3c4f76] hover:bg-[#3c4f76]/10"
                            onClick={() => setSelectedOption(null)}
                        >
                            ← Back to options
                        </Button>

                        {publishOptions.map(option => option.id === selectedOption && (
                            <div key={option.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div>
                                    <div className="flex items-center mb-6">
                                        <option.icon className="w-8 h-8 text-[#3c4f76] mr-3" />
                                        <h2 className="text-3xl font-bold text-[#3c4f76]">{option.title}</h2>
                                    </div>

                                    <p className="text-xl text-[#383f51] mb-8">{option.description}</p>

                                    <div className="mb-8">
                                        <h3 className="text-xl font-medium text-[#3c4f76] mb-4">Features</h3>
                                        <ul className="space-y-3">
                                            {option.details.map((detail, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="w-2 h-2 rounded-full bg-[#3c4f76] mt-2 mr-3"></div>
                                                    <span className="text-lg text-[#383f51]">{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-[#3c4f76]/5 rounded-2xl p-6 mb-8">
                                        <h3 className="text-xl font-medium text-[#3c4f76] mb-3">Coming Soon</h3>
                                        <p className="text-[#383f51]">
                                            We're currently developing this feature. Join our waitlist to be notified when it's available and receive early access.
                                        </p>
                                    </div>

                                    <Button className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white rounded-xl py-6 px-8 text-lg">
                                        Join Waitlist
                                    </Button>
                                </div>

                                <div className="flex items-center justify-center h-[500px] rounded-2xl overflow-hidden bg-[#f5f5f5]">
                                    {option.id === "printed" && (
                                        <BookText className="w-48 h-48 text-[#3c4f76]/30" />
                                    )}
                                    {option.id === "podcast" && (
                                        <Mic className="w-48 h-48 text-[#3c4f76]/30" />
                                    )}
                                    {option.id === "newsletter" && (
                                        <Mail className="w-48 h-48 text-[#3c4f76]/30" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 