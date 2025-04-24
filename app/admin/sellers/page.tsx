import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { getAllSellers } from '@/services/seller';
import { redirect } from 'next/navigation';
import { SellersTable } from './components/SellersTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata = {
  title: 'Admin - Manage Sellers',
  description: 'Review and manage seller applications and accounts',
};

interface AdminSellersPageProps {
  searchParams: { tab?: string };
}

export default async function AdminSellersPage({
  searchParams,
}: AdminSellersPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  // Get the tab from search params or default to "pending"
  const activeTab = searchParams.tab || 'pending';

  // Get all sellers with pending status first
  const pendingSellers = await getAllSellers('pending');
  const approvedSellers = await getAllSellers('approved');
  const rejectedSellers = await getAllSellers('rejected');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Sellers</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage seller applications and accounts
        </p>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-6">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="pending" className="flex-1">
            Pending Applications
            {pendingSellers.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                {pendingSellers.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            All Sellers
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1">
            Approved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pendingSellers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>
                  Review new seller applications awaiting approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SellersTable sellers={pendingSellers} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No pending applications at this time
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Sellers</CardTitle>
              <CardDescription>
                Manage all seller accounts on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SellersTable
                sellers={[
                  ...pendingSellers,
                  ...approvedSellers,
                  ...rejectedSellers,
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approved Sellers</CardTitle>
              <CardDescription>
                Manage active seller accounts on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvedSellers.length > 0 ? (
                <SellersTable sellers={approvedSellers} />
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No approved sellers found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
