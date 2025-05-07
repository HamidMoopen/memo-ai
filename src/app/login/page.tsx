"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn, type LoginFormData, type LoginResult } from './actions';
import { supabase } from "@/lib/supabase/client";
import { getRedirectUrl } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaMicrosoft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
            setError('Error signing in with Google');
        } finally {
            setIsGoogleLoading(false);
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const result = await signIn(formData);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        if (result.success) {
            // Redirect to dashboard on successful login
            router.push('/dashboard');
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* Left Visual Panel */}
            <div className="hidden md:flex flex-col items-center justify-center w-1/2 relative overflow-hidden">
                {/* Animated Spotlight */}
                <div className="absolute inset-0 z-0">
                    <svg width="100%" height="100%" className="absolute inset-0" style={{ filter: 'blur(40px)' }}>
                        <defs>
                            <radialGradient id="spotlight" cx="50%" cy="40%" r="60%">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#spotlight)" className="text-primary" />
                    </svg>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-8 animate-fade-in">
                        <div className="w-20 h-20 rounded-2xl bg-card/80 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect width="48" height="48" rx="14" fill="currentColor" fillOpacity="0.12" className="text-primary" />
                                <rect x="12" y="12" width="24" height="24" rx="6" fill="currentColor" fillOpacity="0.18" className="text-primary" />
                                <rect x="18" y="18" width="12" height="12" rx="3" fill="currentColor" fillOpacity="0.28" className="text-primary" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight animate-fade-in">Welcome Back!</h1>
                    <p className="text-lg text-foreground/70 max-w-xs text-center animate-fade-in delay-100">Start your story, unlock your memories, and enjoy your journey with Eterna.</p>
                </div>
            </div>

            {/* Right Login Form Panel */}
            <div className="flex flex-1 flex-col items-center justify-center min-h-screen px-6 py-12 relative z-10">
                <div className="w-full max-w-md bg-card/90 rounded-2xl shadow-2xl p-10 border border-border backdrop-blur-sm animate-fade-in">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-2">Lets write history!</h2>
                    <p className="text-md text-foreground/60 text-center mb-8">Sign in to continue your story.</p>

                    {error && (
                        <div className="mb-4 p-4 text-destructive bg-destructive/10 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {/* SSO Buttons */}
                    <div className="flex gap-3 mb-6">
                        <Button
                            type="button"
                            onClick={signInWithGoogle}
                            disabled={isGoogleLoading}
                            className="flex-1 flex items-center justify-center gap-2 bg-card hover:bg-accent text-foreground rounded-lg py-3 shadow-md transition-all duration-200 border border-border"
                        >
                            <FcGoogle className="w-5 h-5" />
                        </Button>
                        <Button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 bg-card hover:bg-accent text-foreground rounded-lg py-3 shadow-md transition-all duration-200 border border-border"
                        >
                            <FaApple className="w-5 h-5" />
                        </Button>
                        <Button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 bg-card hover:bg-accent text-foreground rounded-lg py-3 shadow-md transition-all duration-200 border border-border"
                        >
                            <FaMicrosoft className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card/90 text-secondary/40">or continue with email</span>
                        </div>
                    </div>

                    {/* Email Sign In Form */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none bg-card text-secondary text-lg shadow-inner"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none bg-card text-secondary text-lg shadow-inner"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-4 rounded-xl shadow-lg transition-all duration-300 font-bold tracking-wide mt-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card hover:scale-[1.03]"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-foreground/60">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-primary hover:text-primary/90 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}