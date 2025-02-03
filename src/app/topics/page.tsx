import Link from "next/link"

const topics = [
  ["Growing Up", "Family", "Love Life"],
  ["Adult Life", "Passions", "World Events"],
  ["Wisdom"]
]

export default function TopicsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Choose a Topic</h1>
      <p className="text-gray-600 mb-8">
        Select a topic to start sharing your memories. We&apos;ll guide you through the conversation with thoughtful questions.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
  )
}