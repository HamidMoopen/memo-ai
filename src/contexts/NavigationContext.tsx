'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type NavigationContextType = {
    navigateBack: () => void;
    addToHistory: (path: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [history, setHistory] = useState<string[]>(['/']);

    const addToHistory = useCallback((path: string) => {
        setHistory(prev => [...prev, path]);
    }, []);

    const navigateBack = useCallback(() => {
        setHistory(prev => {
            const newHistory = [...prev];
            // Remove current page
            newHistory.pop();
            // Get previous page
            const previousPage = newHistory[newHistory.length - 1] || '/';
            router.push(previousPage);
            return newHistory;
        });
    }, [router]);

    return (
        <NavigationContext.Provider value={{ navigateBack, addToHistory }}>
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
} 