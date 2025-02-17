interface LoadingSpinnerProps {
    fullScreen?: boolean;
}

export function LoadingSpinner({ fullScreen = true }: LoadingSpinnerProps) {
    const containerClasses = fullScreen
        ? "min-h-screen bg-[#faf9f6] flex items-center justify-center"
        : "h-full w-full flex items-center justify-center py-8";

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-[#3c4f76] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[#3c4f76] text-lg">Loading your dashboard...</div>
            </div>
        </div>
    );
} 