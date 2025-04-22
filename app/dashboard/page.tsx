import { DashboardStatsSection } from '@/app/dashboard/components/DashboardStats';
import { MapPreview } from '@/app/dashboard/components/MapPreview';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { getDashboardStats, getUserProfile } from '@/services/profile';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { BuyerCard } from './components/BuyerCard';
import { SellerCard } from './components/SellerCard';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  const profile = await getUserProfile(user.id);
  if (!profile) {
    notFound();
  }

  // If user is a seller and first login is true, redirect to seller onboarding
  if (profile.role === 'seller' && profile.first_login) {
    redirect('/dashboard/seller-onboarding');
  }

  // Get dashboard stats
  const stats = await getDashboardStats();

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {profile.full_name || 'User'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>

        <Suspense fallback={<div>Loading stats...</div>}>
          <DashboardStatsSection
            stats={stats}
            isSeller={profile.role === 'seller'}
          />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {profile.role === 'seller' && <SellerCard profile={profile} />}

            {profile.role === 'buyer' && <BuyerCard />}

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>
                  Your recent conversations with buyers and sellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  {/* Message items would go here in a real app */}
                  <div className="p-4 flex justify-center items-center text-muted-foreground">
                    <p className="text-sm">No recent messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {profile.role === 'seller' &&
              profile?.seller_status === 'approved' && (
                <MapPreview
                  location={profile.seller_details.location}
                  isInteractive={true}
                />
              )}

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-between"
                  >
                    <Link href="/search">
                      Browse Services
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-between"
                  >
                    <Link href="/dashboard/favorites">
                      Saved Favorites
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-between"
                  >
                    <Link href="/dashboard/settings">
                      Account Settings
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
