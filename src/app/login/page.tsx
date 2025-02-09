import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-memory-cream flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-serif text-memory-purple text-center mb-8">Welcome Back</h1>

                <form className="space-y-6" action="/dashboard">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-memory-purple focus:border-memory-purple"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-memory-purple focus:border-memory-purple"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-memory-purple hover:bg-memory-purple-light text-white transition-all duration-300 ease-in-out transform hover:scale-105 rounded-full"
                    >
                        Sign In
                    </Button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-memory-purple hover:text-memory-purple-light">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}