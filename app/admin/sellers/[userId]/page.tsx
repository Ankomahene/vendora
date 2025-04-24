import { MapPreview } from '@/app/dashboard/components/MapPreview';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { getSellerProfile } from '@/services/seller';
import { ArrowLeft, Check, Mail, Phone, X } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { SellerActionButtons } from './components/SellerActionButtons';

export default async function SellerDetailsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }
  // Get seller details
  const profile = await getSellerProfile(userId);

  if (!profile) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/sellers">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Seller Details</h1>
        </div>

        {profile.seller_status === 'pending' && (
          <SellerActionButtons sellerId={userId} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={profile.avatar_url || ''}
                    alt={profile.full_name}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>
                      {profile.seller_details.business_name}
                    </CardTitle>
                    {getStatusBadge(profile.seller_status || 'pending')}
                  </div>
                  <CardDescription>{profile.full_name}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{profile.seller_details.contact_phone}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Business Category</h3>
                <Badge variant="outline" className="bg-muted/50">
                  {profile.seller_details.business_category}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Submitted On</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(profile.created_at)}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">
                  Business Description
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {profile.seller_details.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Tabs defaultValue="services">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="service_modes">Service Modes</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Services Offered</CardTitle>
                    <CardDescription>
                      Services this seller will provide
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.seller_details.services.length > 0 ? (
                        profile.seller_details.services.map(
                          (service, index) => (
                            <Badge key={index} variant="secondary">
                              {service}
                            </Badge>
                          )
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No services specified
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="service_modes" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Service Modes</CardTitle>
                    <CardDescription>
                      How this seller delivers their services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.seller_details.service_modes.map((mode) => (
                        <div
                          key={mode.type}
                          className={`border rounded-md p-4 ${
                            mode.enabled
                              ? 'border-primary/20 bg-primary/5'
                              : 'border-muted bg-muted/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">
                              {mode.type
                                .replace('_', ' ')
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </div>
                            {mode.enabled ? (
                              <Check className="h-5 w-5 text-primary" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Business Location</CardTitle>
                    <CardDescription>
                      Where this seller is located
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-4">
                      <p className="text-sm text-muted-foreground">
                        {profile.seller_details.location.address}
                      </p>
                      <div className="h-[300px] w-full">
                        <MapPreview
                          location={profile.seller_details.location}
                          isInteractive={false}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.seller_status === 'pending' ? (
                <>
                  <Button
                    className="w-full bg-success hover:bg-success/90 text-white"
                    asChild
                  >
                    <Link
                      href={`/api/admin/sellers/${userId}/approve`}
                      prefetch={false}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve Seller
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    asChild
                  >
                    <Link
                      href={`/api/admin/sellers/${userId}/reject`}
                      prefetch={false}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject Application
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                  <div className="text-sm">
                    {profile.seller_status === 'approved'
                      ? 'This seller has been approved and can create listings.'
                      : 'This seller application has been rejected.'}
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/seller/${userId}`} target="_blank">
                  View Public Profile
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Admin notes functionality will be implemented in a future
                update.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
