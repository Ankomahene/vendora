import React, { useState } from 'react';
import { Button } from '../ui/button';
import { MessageSquare } from 'lucide-react';
import { createConversation } from '@/lib/messaging';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ContactSellerButtonProps {
  buyerId: string;
  sellerId: string;
  listingId?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export function ContactSellerButton({
  buyerId,
  sellerId,
  listingId,
  variant = 'default',
  size = 'default',
  className,
  fullWidth = false,
  iconOnly = false,
}: ContactSellerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContact = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const conversation = await createConversation(
        buyerId,
        sellerId,
        listingId
      );
      if (conversation) {
        router.push(`/messages?conversation=${conversation.id}`);
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleContact}
      disabled={isLoading}
      className={cn(fullWidth && 'w-full', className)}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {!iconOnly && 'Contact Seller'}
    </Button>
  );
}
