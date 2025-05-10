'use client';

import { useState } from "react";
import { BookText, Mic, Mail, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const publishOptions = [
  {
    id: "printed",
    title: "Printed Memoir",
    description: "Transform your stories into a beautiful printed book.",
    icon: BookText,
    stats: "2,500+ books published",
    color: "text-purple-500",
    pathColor: "bg-purple-200",
    details: (
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Printed Memoir</h2>
        <p className="text-muted-foreground mb-4">Create a stunning, tangible keepsake for your family. Choose your style, upload photos, and personalize your book.</p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>Premium hardcover & softcover options</li>
          <li>Custom layouts and fonts</li>
          <li>Photo and story integration</li>
        </ul>
      </div>
    )
  },
  {
    id: "podcast",
    title: "Podcast Series",
    description: "Share your stories as audio episodes with your own voice.",
    icon: Mic,
    stats: "1,200+ episodes created",
    color: "text-emerald-500",
    pathColor: "bg-emerald-200",
    details: (
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Podcast Series</h2>
        <p className="text-muted-foreground mb-4">Record your stories and share them as a podcast. Add music, invite guests, and publish to your private feed.</p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>Studio-quality audio tools</li>
          <li>Private or public sharing</li>
          <li>Episode scheduling</li>
        </ul>
      </div>
    )
  },
  {
    id: "newsletter",
    title: "Email Newsletter",
    description: "Send your stories directly to friends and family.",
    icon: Mail,
    stats: "5,000+ subscribers",
    color: "text-rose-500",
    pathColor: "bg-rose-200",
    details: (
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Email Newsletter</h2>
        <p className="text-muted-foreground mb-4">Deliver your stories to inboxes with beautiful formatting. Track opens, add photos, and schedule sends.</p>
        <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
          <li>Customizable templates</li>
          <li>Subscriber management</li>
          <li>Analytics & scheduling</li>
        </ul>
      </div>
    )
  }
];

export default function PublishPage() {
  const [selected, setSelected] = useState("printed");
  const selectedIndex = publishOptions.findIndex(opt => opt.id === selected);
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Hero Section */}
      <div className="relative h-[28vh] flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm mt-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Publishing Features</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mt-4">
          Share Your Story
        </h1>
        <p className="text-base text-muted-foreground mt-2 max-w-md">
          Choose how you want to share your journey with loved ones
        </p>
      </div>

      {/* Timeline Selector */}
      <div className="w-full flex flex-col items-center mt-2">
        <div className="relative flex items-center justify-center w-full max-w-2xl">
          {/* Path */}
          <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 z-0">
            <div className="w-full h-full bg-border rounded-full" />
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${publishOptions[selectedIndex].pathColor}`}
              style={{ width: `${(selectedIndex) / (publishOptions.length - 1) * 100}%` }}
            />
          </div>
          {/* Nodes */}
          {publishOptions.map((option, idx) => {
            const Icon = option.icon;
            const isActive = selected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelected(option.id)}
                className={`relative z-10 flex flex-col items-center group transition-all duration-300 focus:outline-none mx-0 flex-1`}
                style={{ minWidth: 0 }}
              >
                <div className={`transition-all duration-300 flex items-center justify-center rounded-full border-4 ${isActive ? option.color + ' border-background bg-background shadow-lg scale-125' : 'border-border bg-background/80'} w-16 h-16`}>
                  <Icon className={`w-7 h-7 ${isActive ? option.color : 'text-muted-foreground'}`} />
                </div>
                <span className={`mt-2 text-sm font-medium transition-all duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{option.title}</span>
                <span className={`text-xs mt-0.5 ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{option.stats}</span>
                {/* Animated dot below active node */}
                {isActive && <span className={`block w-2 h-2 rounded-full ${option.color} bg-opacity-80 mt-2 animate-bounce`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Section (not a card) */}
      <div className="max-w-2xl mx-auto px-4 mt-8">
        {publishOptions[selectedIndex].details}
        <button
          className="mt-8 w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-200"
          onClick={() => router.push(`/dashboard/publish/${selected}`)}
        >
          {`Start ${publishOptions[selectedIndex].title}`}
        </button>
      </div>

      {/* Coming Soon Alert (optional, can remove if not needed) */}
      {/* <div className="max-w-2xl mx-auto mt-8 px-4">
        <Alert className="border border-border/50 bg-accent/50 backdrop-blur-sm">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-foreground font-medium text-sm">Coming Soon</AlertTitle>
          <AlertDescription className="text-muted-foreground text-xs">
            Our publishing features are currently in development. Select an option above to join the waitlist.
          </AlertDescription>
        </Alert>
      </div> */}
    </div>
  );
} 