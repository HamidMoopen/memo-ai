import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRedirectUrl(path: string): string {
  return typeof window !== 'undefined'
    ? `${window.location.origin}${path}`
    : path;
} 