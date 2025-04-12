'use client';

import { RecordingInterface } from "@/components/RecordingInterface"
import { SidebarProvider } from "@/contexts/SidebarContext"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"
import { useNavigation } from "@/contexts/NavigationContext"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function Page({ params }: { params: { category: string } }) {
  const pathname = usePathname();
  const { addToHistory } = useNavigation();

  // Extract category from pathname instead of params
  const category = pathname.split('/').pop() || '';

  useEffect(() => {
    // Add current path to navigation history
    addToHistory(pathname);
  }, [pathname, addToHistory]);

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
              <div className="flex items-center">
                <BackButton />
                <Link
                  href="/dashboard"
                  className="text-2xl font-bold text-[#3c4f76] hover:text-[#2a3b5a] transition-colors ml-4"
                >
                  Eterna
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