"use client"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { questions, type QuestionCategory } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { Toaster } from 'sonner'
import type { StoryData } from '@/types/story'
import Conversation from "@/components/Conversation"

interface PageProps {
  searchParams: { category: string };
}

export default function Page({ searchParams }: PageProps) {
  const category = searchParams.category;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (!category) {
    return <div>No category selected</div>;
  }

  const categoryQuestions = questions[category];
  if (!categoryQuestions) {
    return <div>Invalid category</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recording: {category}</h1>
      <Conversation category={category} />
    </div>
  );
}