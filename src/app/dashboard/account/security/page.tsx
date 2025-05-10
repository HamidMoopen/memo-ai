'use client';

import { useState, useEffect } from "react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SecurityPage() {
    const [user, setUser] = useState<any>(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
        };

        getUser();
    }, [router]);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            alert('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Error updating password. Please try again.');
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
                title="Security Settings"
                description="Manage your password and security preferences"
                backLink="/dashboard/account"
                backLinkText="Back to Account"
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="rounded-3xl border-2 border-gray-100">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#3c4f76]">Change Password</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#383f51]">
                                        Current Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className="border-gray-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#383f51]">
                                        New Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="border-gray-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#383f51]">
                                        Confirm New Password
                                    </label>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="border-gray-200"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white rounded-xl py-6 text-lg"
                                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-2 border-gray-100 mt-8">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#3c4f76]">Two-Factor Authentication</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-[#383f51]">
                                    Enhance your account security by enabling two-factor authentication.
                                </p>
                                <Button
                                    className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white rounded-xl py-6 text-lg"
                                    onClick={() => alert('This feature is coming soon!')}
                                >
                                    Enable 2FA
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 