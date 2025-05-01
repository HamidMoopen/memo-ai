import { useCall } from '@/hooks/useCall';
import { Button } from './ui/button';
import { PhoneCall, Loader2 } from 'lucide-react';

interface CallButtonProps {
  phoneNumber: string;
  className?: string;
}

export function CallButton({ phoneNumber, className }: CallButtonProps) {
  const { makeCall, isLoading, error } = useCall();

  const handleCall = async () => {
    const result = await makeCall(phoneNumber);
    if (!result.success) {
      console.error('Call failed:', result.error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleCall}
        disabled={isLoading}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Calling you now...
          </>
        ) : (
          <>
            <PhoneCall className="mr-2 h-5 w-5" />
            Call Me Now
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
} 