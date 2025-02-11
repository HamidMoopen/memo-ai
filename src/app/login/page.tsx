import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
            <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-[#3c4f76] text-center mb-8">Welcome Back</h1>

                <form className="space-y-6" action="/dashboard">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#383f51] mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
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
                            className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:ring-[#3c4f76] focus:border-[#3c4f76] text-[#383f51]"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#3c4f76] hover:bg-[#2a3b5a] text-white text-lg py-6 rounded-2xl transition-all duration-300"
                    >
                        Sign In
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