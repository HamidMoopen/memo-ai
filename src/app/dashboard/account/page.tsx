'use client';

import { useState, useEffect } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Key, ChevronRight } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
        };

        getUser();
    }, [router]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="w-12 h-12 border-4 border-[#3c4f76] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const accountSections = [
        {
            id: 'profile',
            title: 'Profile Information',
            description: 'Manage your personal information',
            icon: User,
            info: user.user_metadata.full_name || user.email,
            href: '/dashboard/account/profile'
        },
        {
            id: 'email',
            title: 'Email Settings',
            description: 'Update your email and notification preferences',
            icon: Mail,
            info: user.email,
            href: '/dashboard/account/email'
        },
        {
            id: 'security',
            title: 'Security',
            description: 'Password and authentication settings',
            icon: Key,
            info: '••••••••',
            href: '/dashboard/account/security'
        },
    ];

    return (
        <div>
            <DashboardHeader
                title="Account Settings"
                description="Manage your account preferences and settings"
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {accountSections.map((section) => (
                        <Link key={section.id} href={section.href}>
                            <Card
                                className="mb-6 rounded-3xl border-2 border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <CardHeader className="flex flex-row items-center justify-between p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-[#3c4f76]/10 rounded-2xl flex items-center justify-center">
                                            <section.icon className="w-6 h-6 text-[#3c4f76]" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl text-[#3c4f76]">{section.title}</CardTitle>
                                            <p className="text-[#383f51] mt-1">{section.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[#383f51] mr-4">{section.info}</span>
                                        <ChevronRight className="w-5 h-5 text-[#3c4f76]" />
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}

                    <div className="mt-8">
                        <Button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = '/';
                            }}
                            variant="outline"
                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 