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
                <div>
                    <h1 className="text-4xl font-bold text-[#3c4f76] mb-2">{title}</h1>
                    <p className="text-lg text-[#383f51]/80">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
} 