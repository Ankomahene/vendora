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

export default async function AdminSellersPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  // Get all sellers with pending status first
  const pendingSellers = await getAllSellers('pending');
  const approvedSellers = await getAllSellers('approved');
  const rejectedSellers = await getAllSellers('rejected');

  // Combine all sellers
  const allSellers = [
    ...pendingSellers,
    ...approvedSellers,
    ...rejectedSellers,
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Sellers</h1>
        <p className="text-muted-foreground mt-1">
          Review and manage seller applications and accounts
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>
              Review new seller applications awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingSellers.length > 0 ? (
              <SellersTable sellers={pendingSellers} />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No pending applications at this time
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Sellers</CardTitle>
            <CardDescription>
              Manage all seller accounts on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allSellers.length > 0 ? (
              <SellersTable sellers={allSellers} />
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No sellers found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
