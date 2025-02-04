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
    <div className="min-h-screen bg-memory-dark relative">
      <div className="fixed inset-0 bg-memory-dark -z-10" /> {/* Fixed background */}
      <div className="relative z-0 text-memory-cream">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-16">
            <Link href="/topics" className="text-memory-cream hover:text-memory-orange transition-colors">
              <ChevronLeft className="w-8 h-8" />
            </Link>
            <h1 className="text-2xl font-serif">Memory Lane</h1>
            <div className="w-8" /> {/* Spacer for centering */}
          </div>

          {/* Content */}
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-up">
            <h2 className="text-4xl font-serif mb-4">Love Life</h2>
            <p className="text-xl text-memory-cream/80 mb-16">Below are some initial prompts to provide inspiration.</p>

            {/* Question Carousel */}
            <div className="relative py-8">
              <button
                onClick={previousQuestion}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-memory-purple flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-memory-purple-light"
                aria-label="Previous question"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="text-2xl font-serif px-16 min-h-[6rem] flex items-center justify-center transition-all duration-300 ease-in-out">
                {questions[currentQuestion]}
              </div>

              <button
                onClick={nextQuestion}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-memory-purple flex items-center justify-center transition-all duration-300 ease-in-out hover:bg-memory-purple-light"
                aria-label="Next question"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 py-8">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out ${
                    index === currentQuestion ? "bg-memory-orange" : "bg-memory-purple"
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                />
              ))}
            </div>

            {/* Recording Controls */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button
                onClick={toggleRecording}
                className={`${
                  isRecording
                    ? "bg-memory-orange border-memory-orange hover:bg-memory-orange-light hover:border-memory-orange-light"
                    : "bg-memory-purple border-memory-orange hover:bg-memory-purple-light"
                } w-20 h-20 rounded-2xl border-4 text-memory-cream flex items-center justify-center text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-102 shadow-lg`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {hasRecording && (
                <button
                  onClick={generateStory}
                  className="bg-memory-purple border-4 border-memory-orange w-20 h-20 rounded-2xl text-memory-cream flex items-center justify-center text-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-102 hover:bg-memory-purple-light shadow-lg"
                  aria-label="Generate story"
                >
                  <Download className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 