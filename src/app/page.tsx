import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Users, Star } from "lucide-react"

const features = [
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
]

export default function Page() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#383f51]">
      <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-sm">
        <div className="container mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-[#3c4f76]">
            Eterna
          </Link>
          <div className="flex items-center gap-4">

            <Link href="/login">
              <Button className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white text-lg px-8 py-6 rounded-2xl">
                Start Preserving Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-28">
        <section className="container mx-auto px-8 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-[#3c4f76] leading-tight animate-fade-in">
                Preserve and explore your family's legacy with AI-driven storytelling
              </h1>
              <p className="text-2xl mb-12 text-[#383f51]/90 max-w-3xl mx-auto leading-relaxed">
                Eterna helps loved ones capture and preserve stories, using AI to make them searchable,
                organized, and accessible for generations to come.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="container mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-[#faf9f6] p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-20 h-20 bg-[#3c4f76]/10 rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="w-10 h-10 text-[#3c4f76]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#3c4f76]">{feature.title}</h3>
                  <p className="text-lg text-[#383f51]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-white to-[#faf9f6]">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="text-3xl italic mb-12 text-[#3c4f76] leading-relaxed">
                "Every family has a story that it tells itself, that it passes on to the children and grandchildren.
                The story grows over the years, mutates, some parts are sharpened, others dropped, and there is
                often debate about what really happened."
              </blockquote>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-16">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold text-[#3c4f76] mb-6">
            Start preserving your family's legacy today
          </h2>
          <p className="text-xl text-[#383f51] mb-8 max-w-2xl mx-auto">
            Join thousands of families to capture and preserve precious memories
          </p>
          <Link href="/login">
            <Button className="bg-[#3c4f76] hover:bg-[#2a3b5a] text-white text-lg px-10 py-6 rounded-2xl">
              Try it out now
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}

