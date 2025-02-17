'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface DashboardHeaderProps {
    title: string;
    description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
    const [greeting, setGreeting] = useState('');
    const { data: session } = useSession();

    useEffect(() => {
        const getTimeBasedGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good morning';
            if (hour < 18) return 'Good afternoon';
            return 'Good evening';
        };

        setGreeting(getTimeBasedGreeting());
    }, []);

    return (
        <div className="px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-lg text-[#383f51]/80 mb-1">
                        {greeting}{session?.user?.name ? `, ${session.user.name}` : ''}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#3c4f76] mb-2">{title}</h1>
                    <p className="text-base sm:text-lg text-[#383f51]/80">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
} 