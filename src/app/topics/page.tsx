import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const topics = [
  ["Growing Up", "Family", "Love Life"],
  ["Adult Life", "Passions", "World Events"],
  ["Wisdom", "My Other Stories"],
]

export default function TopicsPage() {
  return (
    <div className="min-h-screen bg-memory-dark relative">
      <div className="fixed inset-0 bg-memory-dark -z-10" /> {/* Fixed background */}
      <div className="relative z-0 text-memory-cream">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <Link href="/" className="text-memory-cream hover:text-memory-orange transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </Link>
            <h1 className="text-2xl font-serif">Eterna</h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <h2 className="text-4xl font-serif mb-4">Talk about anything you'd like.</h2>
            <p className="text-xl text-memory-cream/80 mb-16 max-w-xl mx-auto">
              Everyone's story is different, so you can always choose which topic you'd like to talk about.
            </p>

            {/* Topics Grid */}
            <div className="flex flex-col items-center gap-8">
              {topics.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap justify-center gap-6">
                  {row.map((topic, index) => (
                    <Link
                      key={topic}
                      href={`/record/${topic.toLowerCase().replace(/\s+/g, "-")}`}
                      className="w-64 h-16 flex items-center justify-center px-8 text-xl font-medium rounded-full border-2 border-memory-orange text-memory-cream hover:bg-memory-purple transition-all duration-300 ease-in-out transform hover:scale-105 animate-fade-in-up shadow-lg"
                      style={{ animationDelay: `${(rowIndex * 3 + index) * 100}ms` }}
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
    </div>
  )
}