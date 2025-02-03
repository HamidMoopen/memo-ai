import { RecordingInterface } from "@/components/RecordingInterface"
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
    <div className="min-h-screen bg-[#461635] text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <Link href="/topics" className="text-white">
            <ChevronLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-2xl font-serif">Memory Lane</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-serif mb-4">{formattedCategory}</h2>
          <p className="text-xl text-gray-200 mb-16">Share your memories with us. We&apos;ll guide you through the conversation.</p>

          {/* Recording Interface */}
          <div className="relative py-8">
            <RecordingInterface category={category} />
          </div>
        </div>
      </div>
    </div>
  );
} 