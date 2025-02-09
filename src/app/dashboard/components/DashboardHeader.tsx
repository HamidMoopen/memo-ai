import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
    title: string;
    description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
    return (
        <div className="container mx-auto px-8 py-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div>
                        <h1 className="text-4xl font-serif text-memory-purple leading-relaxed">{title}</h1>
                        <p className="text-lg text-gray-600 mt-2">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 