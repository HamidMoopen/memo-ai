'use client';

import { useState, useEffect } from "react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
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
            setFullName(user.user_metadata.full_name || '');
        };

        getUser();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;

            // Refresh the page to update the header
            router.refresh();
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="w-12 h-12 border-4 border-[#3c4f76] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <DashboardHeader
                title="Profile Settings"
                description="Manage your personal information"
                backLink="/dashboard/account"
                backLinkText="Back to Account"
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="rounded-3xl border-2 border-gray-100">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#3c4f76]">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#383f51]">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#383f51]">
                                        Full Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="border-gray-200"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white rounded-xl py-6 text-lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 