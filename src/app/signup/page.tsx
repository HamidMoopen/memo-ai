"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Sign up using Supabase Auth with metadata
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                    }
                }
            });

            if (error) throw error;

            router.push('/dashboard');
        } catch (error: any) {
            setError(error.message || 'An error occurred during sign up');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-[#3c4f76] text-center mb-8">Complete Your Profile</h1>

                {error && (
                    <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#383f51] mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-[#3c4f76] focus:border-[#3c4f76] text-[#383f51]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#383f51] mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-[#3c4f76] focus:border-[#3c4f76] text-[#383f51]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#383f51] mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-[#3c4f76] focus:border-[#3c4f76] text-[#383f51]"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white text-base py-6 rounded-2xl transition-all duration-300"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-base text-[#383f51]">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#3c4f76] hover:text-[#2a3b5a] font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
} 