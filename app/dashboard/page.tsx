import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  return (
    <div className="container flex flex-col min-h-screen py-8">
      <div className="flex-1 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome, Fullname</h2>
            <p className="text-muted-foreground">
              This is your dashboard. You can view your account information
              here.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <div className="space-y-4">
              <div className="grid gap-1">
                <h3 className="font-medium">Email</h3>
                <p>test@example.com</p>
              </div>
              <div className="grid gap-1">
                <h3 className="font-medium">Role</h3>
                <p className="capitalize">seller</p>
              </div>
              {/* {profile?.role === 'seller' && (
                <div className="grid gap-1">
                  <h3 className="font-medium">Seller Status</h3>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        profile?.seller_status === 'approved'
                          ? 'bg-success/20 text-success'
                          : profile?.seller_status === 'rejected'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-warning/20 text-warning'
                      }`}
                    >
                      {profile?.seller_status || 'pending'}
                    </span>
                  </div>
                </div>
              )} */}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
            {/* {profile?.role === 'buyer' && ( */}
            <Button variant="outline" asChild>
              <Link href="/auth/become-seller">Become a Seller</Link>
            </Button>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
