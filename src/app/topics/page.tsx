'use client';

import { useRouter } from "next/navigation";
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"

const topics = [
  ["Growing Up", "Family", "Love Life"],
  ["Adult Life", "Passions", "World Events"],
  ["Wisdom", "My Other Stories"],
]

export default function TopicsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <BackButton />
          <h1 className="text-2xl font-bold text-[#3c4f76]">Eterna</h1>
          <div className="w-8" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-[#3c4f76] mb-4">Talk about anything you'd like.</h2>
          <p className="text-xl text-[#383f51]/80 mb-16 max-w-xl mx-auto">
            Everyone's story is different, so you can always choose which topic you'd like to talk about.
          </p>

          {/* Topics Grid */}
          <div className="flex flex-col items-center gap-8">
            {topics.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap justify-center gap-6">
                {row.map((topic) => (
                  <Link
                    key={topic}
                    href={`/record/${topic.toLowerCase().replace(/\s+/g, "-")}`}
                    className="w-64 h-16 flex items-center justify-center px-8 text-xl font-medium rounded-2xl border-2 border-[#3c4f76] text-[#3c4f76] hover:bg-[#3c4f76] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
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