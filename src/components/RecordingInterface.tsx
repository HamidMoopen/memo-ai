"use client"

import { Conversation } from "@/components/Conversation"
import { questions, type QuestionCategory } from "@/lib/questions"

interface RecordingInterfaceProps {
  category: string;
}

export function RecordingInterface({ category }: RecordingInterfaceProps) {
  const categoryAsType = category.toLowerCase().replace(/-/g, ' ') as QuestionCategory;
  const categoryQuestions = questions[categoryAsType];

  if (!categoryQuestions) {
    return <div>Invalid category</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recording: {category}</h1>
      <Conversation category={categoryAsType} />
    </div>
  );
} 