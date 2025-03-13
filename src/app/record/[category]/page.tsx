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
    <div className="min-h-screen bg-[#faf9f6]">
      <SidebarProvider>
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
          <div className="container mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="text-2xl font-bold text-[#3c4f76] hover:text-[#2a3b5a] transition-colors"
              >
                Eterna
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/topics"
                  className="text-[#3c4f76] hover:text-[#2a3b5a] transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Topics
                </Link>
                <Link
                  href="/dashboard/stories"
                  className="text-[#3c4f76] hover:text-[#2a3b5a] transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Stories
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with padding for header */}
        <div className="container mx-auto px-8 pt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-4 mb-8">
              <h2 className="text-4xl font-bold text-[#3c4f76]">{formattedCategory}</h2>
              <p className="text-xl text-[#383f51]/80 max-w-2xl mx-auto">
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