"use client"

import { Conversation } from "@/components/Conversation"
import { questions, type QuestionCategory } from "@/lib/questions"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface RecordingInterfaceProps {
  category: string;
}

export function RecordingInterface({ category }: RecordingInterfaceProps) {
  const categoryAsType = category.toLowerCase() as QuestionCategory;
  const categoryQuestions = questions[categoryAsType];
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (!categoryQuestions) {
    return <div>Invalid category</div>;
  }

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % categoryQuestions.length);
  };

  const previousQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + categoryQuestions.length) % categoryQuestions.length);
  };

  return (
    <div className="relative">
      {/* Question Navigation */}
      <div className="space-y-8">
        {/* Question Carousel */}
        <div className="relative py-8">
          <button
            onClick={previousQuestion}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[#3c4f76] flex items-center justify-center transition-all duration-300 hover:bg-[#2a3b5a]"
            aria-label="Previous question"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="text-2xl font-bold text-[#3c4f76] px-16 min-h-[4rem] flex items-center justify-center">
            {categoryQuestions[currentQuestion]}
          </div>

          <button
            onClick={nextQuestion}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[#3c4f76] flex items-center justify-center transition-all duration-300 hover:bg-[#2a3b5a]"
            aria-label="Next question"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 py-4">
          {categoryQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentQuestion ? "bg-[#3c4f76]" : "bg-[#3c4f76]/20 hover:bg-[#3c4f76]/40"
                }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Conversation Interface */}
      <div className="mt-8">
        <Conversation category={categoryAsType} />
      </div>
    </div>
  );
} 