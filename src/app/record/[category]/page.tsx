import { RecordingInterface } from "@/components/RecordingInterface"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Record - Memory Lane',
  description: 'Record your memories and stories',
}

// @ts-expect-error - Next.js 15.1.6 doesn't have stable types for page params
export default function Page({ params }) {
  return <RecordingInterface category={params.category} />;
} 