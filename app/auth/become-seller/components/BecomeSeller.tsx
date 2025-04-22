'use client';

import { PrimaryButton } from '@/components/PrimaryButton';
import { becomeSeller } from '@/services/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function BecomeSeller() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBecomeSeller = async () => {
    try {
      setIsLoading(true);

      await becomeSeller();

      toast.success('Successfully registered as a seller!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error becoming seller:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to become a seller'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PrimaryButton
      onClick={handleBecomeSeller}
      disabled={isLoading}
      className="font-medium"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Become a Seller'
      )}
    </PrimaryButton>
  );
}
