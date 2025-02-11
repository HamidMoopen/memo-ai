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
            className="text-[#3c4f76] hover:text-[#2a3b5a] hover:bg-[#3c4f76]/10"
        >
            <ChevronLeft className="w-8 h-8" />
        </Button>
    );
} 