import { NextRequest, NextResponse } from 'next/server'

// @ts-expect-error - Next.js 15.1.6 doesn't have stable types for API route params
export async function GET(request: NextRequest, { params }) {
  return NextResponse.json({ category: params.category });
} 