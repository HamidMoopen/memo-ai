"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Mic, Square, Download } from "lucide-react"

const questions = [
  "What was the best date you've ever been on?",
  "How did you meet your significant other?",
  "What's your favorite romantic memory?",
  "Tell us about your first love.",
  "What's the most romantic thing someone has done for you?",
  "What's your idea of a perfect date?",
  "What's the best relationship advice you've received?",
  "Tell us about a memorable anniversary.",
  "What made you fall in love with your partner?",
  "What's your love story?",
  "What does love mean to you?",
  "How do you keep the romance alive?",
]

export default function RecordPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length)
  }

  const previousQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + questions.length) % questions.length)
  }

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true)
      // Start recording logic here
    } else {
      setIsRecording(false)
      setHasRecording(true)
      // Stop recording logic here
    }
  }

  const generateStory = () => {
    // Generate story logic here
    console.log("Generating story...")
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="container mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          <Link href="/topics" className="text-[#3c4f76] hover:text-[#2a3b5a] transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </Link>
          <h1 className="text-2xl font-bold text-[#3c4f76]">Eterna</h1>
          <div className="w-8" />
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-[#3c4f76] mb-4">Love Life</h2>
          <p className="text-xl text-[#383f51]/80 mb-16">Below are some initial prompts to provide inspiration.</p>

          {/* Question Carousel */}
          <div className="relative py-8">
            <button
              onClick={previousQuestion}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-[#3c4f76] flex items-center justify-center transition-all duration-300 hover:bg-[#2a3b5a]"
              aria-label="Previous question"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="text-2xl font-bold text-[#3c4f76] px-16 min-h-[6rem] flex items-center justify-center">
              {questions[currentQuestion]}
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
          <div className="flex justify-center gap-2 py-8">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentQuestion ? "bg-[#3c4f76]" : "bg-[#3c4f76]/20"
                  }`}
                aria-label={`Go to question ${index + 1}`}
              />
            ))}
          </div>

          {/* Recording Controls */}
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <button
              onClick={toggleRecording}
              className={`${isRecording
                  ? "bg-[#3c4f76] border-[#3c4f76]"
                  : "bg-[#3c4f76] border-[#3c4f76]"
                } w-20 h-20 rounded-2xl border-2 text-white flex items-center justify-center transition-all duration-300 hover:bg-[#2a3b5a]`}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {hasRecording && (
              <button
                onClick={generateStory}
                className="bg-[#3c4f76] border-2 border-[#3c4f76] w-20 h-20 rounded-2xl text-white flex items-center justify-center transition-all duration-300 hover:bg-[#2a3b5a]"
                aria-label="Generate story"
              >
                <Download className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 