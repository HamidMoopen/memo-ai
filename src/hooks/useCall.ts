import { useState } from 'react';

interface CallResponse {
  success: boolean;
  vapiCallId?: string;
  error?: string;
  details?: any;
}

export const useCall = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeCall = async (phoneNumber: string): Promise<CallResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerPhoneNumber: phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate call');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { makeCall, isLoading, error };
}; 