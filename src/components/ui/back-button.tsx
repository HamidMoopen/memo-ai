'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
    const router = useRouter();

    return (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-memory-purple hover:text-memory-purple-light"
        >
            <ChevronLeft className="w-8 h-8" />
        </Button>
    );
} 