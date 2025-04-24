'use client';

import { MapPreview } from '@/app/dashboard/components/MapPreview';
import { useSellerListings } from '@/app/dashboard/listings/hooks/useSellerListings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CURRENCY } from '@/lib/constants';
import { UserProfile } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { updateSellerStatus } from '@/services/admin';
import { AlertTriangle, Check, Loader2, Mail, Phone, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface SellerDetailsSheetProps {
  seller: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellerDetailsSheet({
  seller,
  open,
  onOpenChange,
}: SellerDetailsSheetProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  // Fetch seller listings if seller is available
  const { listings, isLoading: isLoadingListings } = useSellerListings(
    seller?.id || ''
  );

  const handleStatusUpdate = async (action: 'approve' | 'reject') => {
    if (!seller) return;

    // If rejecting, show rejection form
    if (action === 'reject') {
      setShowRejectionForm(true);
      return;
    }

    setIsProcessing(true);

    try {
      await updateSellerStatus({
        userId: seller.id,
        status: 'approved',
      });

      toast.success('Seller approved successfully');
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving seller:', error);
      toast.error('Failed to approve seller');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejection = async () => {
    if (!seller) return;

    setIsProcessing(true);

    try {
      await updateSellerStatus({
        userId: seller.id,
        status: 'rejected',
        rejectionReason,
      });

      toast.success('Seller rejected');
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error('Error rejecting seller:', error);
      toast.error('Failed to reject seller');
    } finally {
      setIsProcessing(false);
      setShowRejectionForm(false);
    }
  };

  const cancelRejection = () => {
    setShowRejectionForm(false);
    setRejectionReason('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/20 text-success">Approved</Badge>;
      case 'rejected':
        return (
          <Badge className="bg-destructive/20 text-destructive">Rejected</Badge>
        );
      default:
        return <Badge className="bg-warning/20 text-warning">Pending</Badge>;
    }
  };

  if (!seller) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={seller.avatar_url || ''}
                alt={seller.full_name}
              />
              <AvatarFallback className="bg-primary/10">
                {getInitials(seller.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <SheetTitle className="text-xl font-semibold flex items-center gap-2">
                {seller.seller_details?.business_name || seller.full_name}
                <StatusBadge status={seller.seller_status || 'pending'} />
              </SheetTitle>
              <SheetDescription>
                Seller since {formatDate(seller.created_at)}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {showRejectionForm ? (
          <div className="py-6 space-y-4">
            <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-destructive">
                  Reject Seller Application
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This will reject the seller&apos;s application. They will be
                  notified by email with your reason.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={cancelRejection}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejection}
                disabled={isProcessing || !rejectionReason.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Rejection'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Basic information about the seller and their business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Business Category</p>
                      <p className="text-sm text-muted-foreground">
                        {seller.seller_details?.business_category ||
                          'Not specified'}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">
                        {seller.full_name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{seller.email}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Phone</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>
                          {seller.seller_details?.contact_phone ||
                            'Not provided'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium">Business Description</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {seller.seller_details?.description ||
                        'No description provided'}
                    </p>
                  </div>

                  {seller.seller_details?.images &&
                    seller.seller_details.images.length > 0 && (
                      <div className="pt-4">
                        <p className="text-sm font-medium mb-2">
                          Business Photos
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {seller.seller_details.images.map((image, i) => (
                            <div
                              key={i}
                              className="relative aspect-square rounded-md overflow-hidden"
                            >
                              <Image
                                src={image}
                                alt={`${
                                  seller.seller_details?.business_name ||
                                  'Business'
                                } photo ${i + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                  <CardDescription>
                    Services and delivery methods this seller provides
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {seller.seller_details?.services?.length ? (
                        seller.seller_details.services.map((service, index) => (
                          <Badge key={index} variant="secondary">
                            {service}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No services specified
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Service Modes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {seller.seller_details?.service_modes?.map((mode) => (
                        <div
                          key={mode.type}
                          className={`border rounded-md p-3 ${
                            mode.enabled
                              ? 'border-primary/20 bg-primary/5'
                              : 'border-muted bg-muted/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">
                              {mode.type
                                .replace('_', ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </div>
                            {mode.enabled ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              {seller.seller_details?.location ? (
                <div className="w-full rounded-md overflow-hidden border bg-muted">
                  <MapPreview
                    location={seller.seller_details.location}
                    isInteractive
                  />
                </div>
              ) : (
                <Card className="h-[250px]">
                  <p className="text-sm text-muted-foreground">
                    No location information provided
                  </p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="listings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Seller Listings</CardTitle>
                  <CardDescription>
                    Products and services offered by this seller
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingListings ? (
                    <div className="py-8 flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : listings && listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {listings.map((listing) => (
                        <div
                          key={listing.id}
                          className="border rounded-md overflow-hidden flex flex-col"
                        >
                          {listing.images && listing.images[0] && (
                            <div className="relative h-40 w-full">
                              <Image
                                src={listing.images[0]}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="p-3 flex-1 flex flex-col">
                            <h3 className="font-medium line-clamp-1">
                              {listing.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {listing.description}
                            </p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                              <Badge variant="outline">
                                {listing.product_type}
                              </Badge>
                              {listing.price ? (
                                <span className="font-medium">
                                  {CURRENCY} {listing.price.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  No price
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      {seller.seller_status === 'approved'
                        ? 'This seller has no listings yet'
                        : 'Seller needs to be approved before they can create listings'}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!showRejectionForm && seller.seller_status === 'pending' && (
          <SheetFooter className="pt-6 sm:justify-between">
            <div className="w-full flex gap-2 sm:justify-end">
              <Button
                variant="destructive"
                onClick={() => handleStatusUpdate('reject')}
                disabled={isProcessing}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleStatusUpdate('approve')}
                disabled={isProcessing}
                className="flex-1 sm:flex-none"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Approve Seller'
                )}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
