"use client"

import { Conversation } from "@/components/Conversation"
import { questions, type QuestionCategory } from "@/lib/questions"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default function Page({ searchParams }: PageProps) {
  const category = searchParams.category as QuestionCategory;

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