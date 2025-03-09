import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRedirectUrl(path: string): string {
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${path}`
    : path;
  
  console.log("🔗 Generated redirect URL:", url);
  return url;
} 