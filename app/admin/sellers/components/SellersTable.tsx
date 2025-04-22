'use client';

import { UserProfile } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { updateSellerStatus } from '@/services/admin';
import { Check, ExternalLink, Eye, MoreHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { StatusBadge } from '@/components/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SellersTableProps {
  sellers: UserProfile[];
}

export function SellersTable({ sellers }: SellersTableProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<UserProfile | null>(
    null
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject'>('approve');

  const handleAction = (seller: UserProfile, action: 'approve' | 'reject') => {
    setSelectedSeller(seller);
    setAction(action);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedSeller) return;

    setIsUpdating(true);
    try {
      const status = action === 'approve' ? 'approved' : 'rejected';
      const success = await updateSellerStatus(selectedSeller.id, status);

      if (!success) {
        throw new Error(`Failed to ${action} seller`);
      }

      toast.success(
        `Seller ${action === 'approve' ? 'approved' : 'rejected'} successfully`
      );
      router.refresh();
    } catch (error) {
      console.error(`Error ${action}ing seller:`, error);
      toast.error(`Failed to ${action} seller. Please try again.`);
    } finally {
      setIsUpdating(false);
      setConfirmDialogOpen(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={seller.avatar_url || ''}
                        alt={seller.full_name}
                      />
                      <AvatarFallback className="bg-primary/10">
                        {getInitials(seller.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{seller.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {seller.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {seller.seller_details?.business_name || '-'}
                </TableCell>
                <TableCell>
                  {seller.seller_details?.business_category || '-'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={seller.seller_status || 'pending'} />
                </TableCell>
                <TableCell>{formatDate(seller.created_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link href={`/admin/sellers/${seller.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>

                      {seller.seller_status === 'pending' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleAction(seller, 'approve')}
                          >
                            <Check className="mr-2 h-4 w-4 text-success" />
                            <span>Approve</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleAction(seller, 'reject')}
                          >
                            <X className="mr-2 h-4 w-4 text-destructive" />
                            <span>Reject</span>
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link
                          href={`/seller/${seller.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Public Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve Seller' : 'Reject Seller'}
            </DialogTitle>
            <DialogDescription>
              {action === 'approve'
                ? 'This will approve the seller and allow them to create listings. Are you sure?'
                : 'This will reject the seller application. They will need to contact support to reapply. Are you sure?'}
            </DialogDescription>
          </DialogHeader>
          {selectedSeller && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedSeller.avatar_url || ''}
                    alt={selectedSeller.full_name}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {getInitials(selectedSeller.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedSeller.seller_details?.business_name || '-'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSeller.full_name} • {selectedSeller.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant={action === 'approve' ? 'default' : 'destructive'}
              onClick={handleConfirmAction}
              disabled={isUpdating}
            >
              {isUpdating
                ? 'Processing...'
                : action === 'approve'
                ? 'Approve'
                : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
