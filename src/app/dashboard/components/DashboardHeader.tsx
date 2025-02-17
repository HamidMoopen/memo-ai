'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardHeaderProps {
    title: string;
    description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
    const [greeting, setGreeting] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const getTimeBasedGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good morning';
            if (hour < 18) return 'Good afternoon';
            return 'Good evening';
        };

        const getUserInfo = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else if (user?.user_metadata?.name) {
                setUserName(user.user_metadata.name);
            }
        };

        setGreeting(getTimeBasedGreeting());
        getUserInfo();
    }, []);

    return (
        <div className="px-4 sm:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-lg text-[#383f51]/80 mb-1">
                        {greeting}{userName ? `, ${userName}` : ''}
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