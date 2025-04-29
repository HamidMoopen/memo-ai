"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUp() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',  // We'll store this in user_metadata
        phone: '',  // Add phone field
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        phone: formData.phone,
                    }
                }
            });

            if (error) throw error;

            if (data?.user) {
                router.push('/dashboard');
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred during sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="bg-accent p-10 rounded-2xl border border-border shadow-soft max-w-md w-full">
                <h1 className="text-3xl font-bold text-foreground text-center mb-8">Complete Your Profile</h1>

                {error && (
                    <div className="mb-4 p-4 text-destructive bg-destructive/10 rounded-xl">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                            required
                            pattern="[0-9]{10}"
                            placeholder="1234567890"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none bg-background text-foreground"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-xl shadow-soft transition-all duration-300"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
} 