'use client';

import { useRouter } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { useEffect } from "react";
import { useNavigation } from "@/contexts/NavigationContext";
import { usePathname } from "next/navigation";

const topics = [
  ["Growing Up", "Family", "Love Life"],
  ["Adult Life", "Passions", "World Events"],
  ["Wisdom", "My Other Stories"],
]

export default function DirectRecordTopicsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { addToHistory } = useNavigation();

  useEffect(() => {
    addToHistory(pathname);
  }, [pathname, addToHistory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto w-full px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <BackButton />
          <h1 className="text-2xl font-bold text-primary">Eterna</h1>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold text-foreground mb-6">Choose a topic to record.</h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-xl mx-auto">
            Select a topic that resonates with you. Your story will be recorded and processed in real-time.
          </p>

          {/* Topics Grid */}
          <div className="flex flex-col items-center gap-12">
            {topics.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap justify-center gap-8">
                {row.map((topic) => (
                  <Link
                    key={topic}
                    href={`/direct-record/${topic.toLowerCase().replace(/\s+/g, "-")}`}
                    className="w-72 h-20 flex items-center justify-center px-8 text-xl font-medium rounded-2xl border border-border bg-accent text-foreground hover:border-primary hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-soft"
                  >
                    <span className="truncate">{topic}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 