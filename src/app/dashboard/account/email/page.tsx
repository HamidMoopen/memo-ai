'use client';

import { useState, useEffect } from "react";
import { DashboardHeader } from "../../components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Switch } from "../../../../components/ui/switch";
import { createClient } from '../../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function EmailSettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailPreferences, setEmailPreferences] = useState({
        weeklyDigest: true,
        storyReminders: true,
        productUpdates: false
    });
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

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.updateUser({
                email: newEmail
            });

            if (error) throw error;

            alert('Please check your email to confirm the change');
            setNewEmail('');
        } catch (error) {
            console.error('Error updating email:', error);
            alert('Error updating email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePreferencesUpdate = async () => {
        // In a real app, you would save these preferences to your database
        alert('Email preferences updated successfully!');
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
                title="Email Settings"
                description="Manage your email and notification preferences"
                backLink="/dashboard/account"
                backLinkText="Back to Account"
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Email Change Card */}
                    <Card className="rounded-3xl border-2 border-gray-100">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#3c4f76]">Change Email Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleEmailUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#383f51]">
                                        Current Email
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
                                        New Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter new email address"
                                        className="border-gray-200"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white rounded-xl py-6 text-lg"
                                    disabled={loading || !newEmail}
                                >
                                    {loading ? 'Updating...' : 'Update Email'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Email Preferences Card */}
                    <Card className="rounded-3xl border-2 border-gray-100">
                        <CardHeader>
                            <CardTitle className="text-2xl text-[#3c4f76]">Email Preferences</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium text-[#383f51]">
                                            Weekly Digest
                                        </label>
                                        <p className="text-sm text-[#383f51]/70">
                                            Receive a summary of your stories and activities
                                        </p>
                                    </div>
                                    <Switch
                                        checked={emailPreferences.weeklyDigest}
                                        onCheckedChange={(checked: boolean) => 
                                            setEmailPreferences(prev => ({...prev, weeklyDigest: checked}))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium text-[#383f51]">
                                            Story Reminders
                                        </label>
                                        <p className="text-sm text-[#383f51]/70">
                                            Get notified about scheduled story sessions
                                        </p>
                                    </div>
                                    <Switch
                                        checked={emailPreferences.storyReminders}
                                        onCheckedChange={(checked: boolean) => 
                                            setEmailPreferences(prev => ({...prev, storyReminders: checked}))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-base font-medium text-[#383f51]">
                                            Product Updates
                                        </label>
                                        <p className="text-sm text-[#383f51]/70">
                                            Stay informed about new features and improvements
                                        </p>
                                    </div>
                                    <Switch
                                        checked={emailPreferences.productUpdates}
                                        onCheckedChange={(checked: boolean) => 
                                            setEmailPreferences(prev => ({...prev, productUpdates: checked}))
                                        }
                                    />
                                </div>

                                <Button
                                    onClick={handlePreferencesUpdate}
                                    className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white rounded-xl py-6 text-lg"
                                >
                                    Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 