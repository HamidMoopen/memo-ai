import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Users, Star } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#fdf4f0]">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-[#8b2455] text-xl font-medium">
            Memory Lane
          </Link>
          <div className="hidden md:flex items-center">
            <Link href="/topics">
              <Button className="bg-[#8b2455] hover:bg-[#8b2455]/90 text-white">Try it out now</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Section - Exact match to screenshot */}
        <div className="py-24 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#8b2455] leading-tight mb-8">
            Family stories and wisdom, captured and saved forever.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Let&apos;s preserve your memories together. Share your stories, and I&apos;ll help you capture them for generations to come.
          </p>
          <p className="text-sm text-gray-500">
            Don&apos;t worry about getting everything perfect - we&apos;ll help you organize and polish your stories.
          </p>
          <Link href="/topics">
            <Button className="bg-[#c84c30] hover:bg-[#c84c30]/90 text-white px-8 py-6 text-lg">Try it out now</Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="py-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#8b2455] rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-[#8b2455]">Preserve Stories</h3>
            <p className="text-gray-600">Record and save precious family memories for generations to come</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#8b2455] rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-[#8b2455]">Share Love</h3>
            <p className="text-gray-600">Connect with family members through shared experiences and memories</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#8b2455] rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-[#8b2455]">Build Community</h3>
            <p className="text-gray-600">Create a network of storytellers and listeners within your family</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-[#8b2455] rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif text-[#8b2455]">Create Legacy</h3>
            <p className="text-gray-600">Leave a lasting digital legacy for future generations to discover</p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="py-24 text-center max-w-4xl mx-auto">
          <blockquote className="text-3xl md:text-4xl font-serif text-[#8b2455] leading-relaxed">
            "Every family has a story that it tells itself, that it passes on to the children and grandchildren. The
            story grows over the years, mutates, some parts are sharpened, others dropped, and there is often debate
            about what really happened."
          </blockquote>
          <p className="mt-6 text-[#c84c30] font-medium">The Power of Family Stories</p>
        </div>

        {/* CTA Section */}
        <div className="py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#8b2455] mb-8">
            Start Preserving Your Family Stories Today
          </h2>
          <Link href="/topics">
            <Button className="bg-[#c84c30] hover:bg-[#c84c30]/90 text-white px-8 py-6 text-lg">Try it out now</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

