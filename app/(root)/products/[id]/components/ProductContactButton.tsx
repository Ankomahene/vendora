'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ProductContactButtonProps {
  productTitle: string;
}

export function ProductContactButton({
  productTitle,
}: ProductContactButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(
    `Hi there, I'm interested in "${productTitle}". Could you provide more information?`
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // In a real implementation, this would connect to a messaging service
      // For now, we'll just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Message sent to seller');
      setIsOpen(false);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    // In a real implementation, we would check auth status
    // For now, just open the dialog
    setIsOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick} variant="outline" className="w-full">
        <MessageSquare className="h-4 w-4 mr-2" />
        Contact Seller
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message about {productTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Ask a question about this product..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
