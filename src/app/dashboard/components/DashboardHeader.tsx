'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
    title: string
    description?: string
    backLink?: string
    backLinkText?: string
    actions?: React.ReactNode
}

export function DashboardHeader({
    title,
    description,
    backLink,
    backLinkText = 'Back',
    actions
}: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between py-6 px-8 border-b border-gray-100">
            <div className="space-y-2">
                {backLink && (
                    <Link href={backLink}>
                        <Button variant="ghost" className="flex items-center text-[#3c4f76] p-0 mb-2">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            {backLinkText}
                        </Button>
                    </Link>
                )}
                <h1 className="text-3xl font-bold text-[#3c4f76]">{title}</h1>
                {description && (
                    <p className="text-gray-500">{description}</p>
                )}
            </div>
            {actions && (
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    {actions}
                </div>
            )}
        </div>
    )
} 