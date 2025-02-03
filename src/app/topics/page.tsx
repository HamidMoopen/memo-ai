import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const topics = [
  ["Growing Up", "Family", "Love Life"],
  ["Adult Life", "Passions", "World Events"],
  ["Wisdom"]
]

export default function TopicsPage() {
  return (
    <div className="min-h-screen bg-[#461635] text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className="text-white">
            <ChevronLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-2xl font-serif">Memory Lane</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-serif mb-4">Talk about anything you'd like.</h2>
          <p className="text-xl text-gray-200 mb-16 max-w-xl mx-auto">
            Everyone's story is different, so you can always choose which topic you'd like to talk about.
          </p>

          {/* Topics Grid */}
          <div className="flex flex-col items-center gap-4">
            {topics.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap justify-center gap-4">
                {row.map((topic) => (
                  <Link
                    key={topic}
                    href={`/record?category=${topic.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-6 py-3 rounded-full border border-white hover:bg-white/10 transition-colors"
                  >
                    {topic}
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