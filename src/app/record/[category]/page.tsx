import { RecordingInterface } from "@/components/RecordingInterface"
import { SidebarProvider } from "@/contexts/SidebarContext"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  const formattedCategory = category.split('-').map((word: string) => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <div className="min-h-screen bg-memory-dark text-memory-cream">
      <SidebarProvider>
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 bg-memory-dark z-50 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/topics" 
                className="text-memory-cream hover:text-memory-orange transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>Back to Topics</span>
              </Link>
              <h1 className="text-2xl font-serif">Eterna</h1>
              <div className="w-24 opacity-0">Back to Topics</div> {/* Invisible spacer for centering */}
            </div>
          </div>
        </div>

        {/* Main Content with padding for header */}
        <div className="container mx-auto px-4 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-4 mb-8">
              <h2 className="text-4xl font-serif">{formattedCategory}</h2>
              <p className="text-xl text-memory-cream/80 max-w-2xl mx-auto">
                Share your memories with us. We'll guide you through the conversation.
              </p>
            </div>

            {/* Recording Interface */}
            <div className="relative py-8">
              <RecordingInterface category={category} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
} 