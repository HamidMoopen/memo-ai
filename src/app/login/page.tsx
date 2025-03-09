"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn, type LoginFormData, type LoginResult } from './actions';
import { createClient } from "@/lib/supabase/client";
import { getRedirectUrl } from "@/lib/utils";

export default function LoginPage() {
    const supabase = createClient()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState<LoginResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    async function signInWithGoogle() {
        setIsGoogleLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: getRedirectUrl("/auth/callback"),
                },
            });

            if (error) throw error;
        } catch (error: any) {
            setError({ error: 'unknown', message: 'Error signing in with Google' });
        } finally {
            setIsGoogleLoading(false);
        }
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await signIn(formData);
            if (result.error) {
                setError(result);
            }
        } catch (error: any) {
            setError({ error: 'unknown', message: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-[#3c4f76] text-center mb-8">Welcome Back</h1>

                {error?.message && (
                    <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg">
                        {error.message}
                        {error.showSignUp && (
                            <span>
                                {" "}
                                <Link href="/signup" className="text-[#3c4f76] hover:text-[#2a3b5a] font-medium">
                                    Create an account
                                </Link>
                                {" "}with this email?
                            </span>
                        )}
                    </div>
                )}

                {/* Google Sign In Button */}
                <Button
                    type="button"
                    onClick={signInWithGoogle}
                    disabled={isGoogleLoading}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-6 rounded-2xl mb-6 flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                    {isGoogleLoading ? (
                        <span className="animate-spin">⭕</span>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                    )}
                    Sign in with Google
                </Button>



                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                {/* Email Sign In Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#383f51] mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
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
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-[#3c4f76] focus:border-[#3c4f76] text-[#383f51]"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white text-lg py-6 rounded-2xl transition-all duration-300"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-[#383f51]">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-[#3c4f76] hover:text-[#2a3b5a] font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}