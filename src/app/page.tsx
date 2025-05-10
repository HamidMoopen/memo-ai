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
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 bg-card z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-secondary">
            Eterna
          </Link>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-4 sm:px-8 py-2 sm:py-6 rounded-xl sm:rounded-2xl">
              Start Preserving Now
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-20 sm:pt-28">
        <section className="container mx-auto px-4 sm:px-8 py-8 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-8 text-secondary leading-tight animate-fade-in">
                Preserve and explore your family's legacy with AI-driven storytelling
              </h1>
              <p className="text-lg sm:text-2xl mb-8 sm:mb-12 text-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Eterna helps loved ones capture and preserve stories, using AI to make them searchable,
                organized, and accessible for generations to come.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-card py-12 sm:py-24">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 sm:w-20 h-16 sm:h-20 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                    <feature.icon className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-secondary">{feature.title}</h3>
                  <p className="text-base sm:text-lg text-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <blockquote className="text-xl sm:text-3xl italic mb-8 sm:mb-12 text-secondary leading-relaxed">
                "Every family has a story that it tells itself, that it passes on to the children and grandchildren.
                The story grows over the years, mutates, some parts are sharpened, others dropped, and there is
                often debate about what really happened."
              </blockquote>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-4 sm:mb-6">
            Start preserving your family's legacy today
          </h2>
          <p className="text-lg sm:text-xl text-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of families to capture and preserve precious memories
          </p>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-6 rounded-xl sm:rounded-2xl">
              Try it out now
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  )
}

