import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Users, Star } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-memory-cream relative">
      <div className="fixed inset-0 bg-memory-cream -z-10" /> {/* Fixed background */}
      <div className="relative z-0">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link
              href="/"
              className="text-memory-purple text-2xl font-serif font-bold transition-colors hover:text-memory-purple-light"
            >
              Eterna
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {["About", "Team", "Blog", "Testimonials", "FAQ"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-memory-purple hover:text-memory-purple-light transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link href="/topics">
                <Button className="bg-memory-purple hover:bg-memory-purple-light text-white transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full px-6">
                  Try it out now
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="py-24 max-w-3xl animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-memory-purple leading-tight mb-8">
              Family stories and wisdom, captured and saved forever.
            </h1>
            <p className="text-gray-700 text-xl mb-8">
              Eterna helps loved ones capture and preserve stories. Stories are tagged, summarized and searchable –
              at your fingertips - forever.
            </p>
            <Link href="/topics">
              <Button className="bg-memory-orange hover:bg-memory-orange-light text-white px-8 py-6 text-lg transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full">
                Try it out now
              </Button>
            </Link>
          </div>

          {/* Features Section */}
          <div className="py-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Preserve Stories",
                description: "Record and save precious family memories for generations to come",
              },
              {
                icon: Heart,
                title: "Share Love",
                description: "Connect with family members through shared experiences and memories",
              },
              {
                icon: Users,
                title: "Build Community",
                description: "Create a network of storytellers and listeners within your family",
              },
              {
                icon: Star,
                title: "Create Legacy",
                description: "Leave a lasting digital legacy for future generations to discover",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`text-center space-y-4 p-6 rounded-lg shadow-lg bg-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-memory-cream animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-memory-purple rounded-full flex items-center justify-center mx-auto">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif text-memory-purple">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Quote Section */}
          <div className="py-24 text-center max-w-4xl mx-auto animate-fade-in">
            <blockquote className="text-3xl md:text-4xl font-serif text-memory-purple leading-relaxed">
              "Every family has a story that it tells itself, that it passes on to the children and grandchildren. The
              story grows over the years, mutates, some parts are sharpened, others dropped, and there is often debate
              about what really happened."
            </blockquote>
            <p className="mt-6 text-memory-orange font-medium">The Power of Family Stories</p>
          </div>

          {/* CTA Section */}
          <div className="py-24 text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-serif text-memory-purple mb-8">
              Start Preserving Your Family Stories Today
            </h2>
            <Link href="/topics">
              <Button className="bg-memory-orange hover:bg-memory-orange-light text-white px-8 py-6 text-lg transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full">
                Try it out now
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

