'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { updateSellerStatus } from '@/services/admin';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SellerActionButtonsProps {
  sellerId: string;
}

export function SellerActionButtons({ sellerId }: SellerActionButtonsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');

  const handleAction = async () => {
    setIsUpdating(true);
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      const success = await updateSellerStatus(sellerId, status);

      if (!success) {
        throw new Error(`Failed to ${action} seller`);
      }

      toast.success(
        `Seller ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      );
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error(`Error ${action}ing seller:`, error);
      toast.error(`Failed to ${action} seller. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  };

  const openDialog = (selectedAction: 'approve' | 'reject') => {
    setAction(selectedAction);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10"
          onClick={() => openDialog('reject')}
        >
          <X className="mr-2 h-4 w-4" />
          Reject
        </Button>

        <Button
          className="bg-success hover:bg-success/90 text-white"
          onClick={() => openDialog('approve')}
        >
          <Check className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve Seller' : 'Reject Seller'}
            </DialogTitle>
            <DialogDescription>
              {action === 'approve'
                ? 'This will approve the seller and allow them to create listings.'
                : 'This will reject the seller application. The seller will need to contact support to reapply.'}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>

            <Button
              variant={action === 'approve' ? 'default' : 'destructive'}
              onClick={handleAction}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : action === 'approve' ? (
                'Approve'
              ) : (
                'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
