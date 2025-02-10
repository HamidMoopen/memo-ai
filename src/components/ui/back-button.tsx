'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigation } from "@/contexts/NavigationContext";

export function BackButton() {
    const { navigateBack } = useNavigation();

    return (
        <Button
            variant="ghost"
            onClick={navigateBack}
            className="text-memory-purple hover:text-memory-purple-light"
        >
            <ChevronLeft className="w-8 h-8" />
        </Button>
    );
} 