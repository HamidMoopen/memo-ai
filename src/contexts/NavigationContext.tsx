'use client';

import { createContext, useContext, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type NavigationContextType = {
    history: string[];
    addToHistory: (path: string) => void;
    navigateBack: () => void;
};

const NavigationContext = createContext<NavigationContextType>({
    history: [],
    addToHistory: () => { },
    navigateBack: () => { },
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<string[]>(['/dashboard']);
    const router = useRouter();
    const isNavigatingRef = useRef(false);

    const addToHistory = (path: string) => {
        // Don't add to history if we're in the middle of navigating back
        if (isNavigatingRef.current) return;

        setHistory((prev) => {
            // Don't add duplicate consecutive entries
            if (prev.length > 0 && prev[prev.length - 1] === path) {
                return prev;
            }

            // Create a new history array with the new path
            return [...prev, path];
        });
    };

    const navigateBack = () => {
        if (history.length > 1) {
            // Set flag to prevent adding current page to history during navigation
            isNavigatingRef.current = true;

            // Create a copy of the history
            const newHistory = [...history];

            // Remove the current page from history
            newHistory.pop();

            // Get the previous page
            const previousPage = newHistory[newHistory.length - 1];

            // Update the history state first (before navigation)
            setHistory(newHistory);

            // Navigate to the previous page
            router.push(previousPage);

            // Reset the flag after navigation
            setTimeout(() => {
                isNavigatingRef.current = false;
            }, 500);
        } else {
            // Default fallback if no history
            router.push('/dashboard');
        }
    };

    return (
        <NavigationContext.Provider value={{ history, addToHistory, navigateBack }}>
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => useContext(NavigationContext); 