import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin"
                className="flex items-center p-2 rounded-md hover:bg-muted"
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="flex items-center p-2 rounded-md hover:bg-muted"
              >
                Users Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/sellers"
                className="flex items-center p-2 rounded-md hover:bg-muted"
              >
                Seller Approvals
              </Link>
            </li>
            <li>
              <Link
                href="/admin/listings"
                className="flex items-center p-2 rounded-md hover:bg-muted"
              >
                Listings Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reviews"
                className="flex items-center p-2 rounded-md hover:bg-muted"
              >
                Reviews Moderation
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className="flex items-center p-2 rounded-md hover:bg-muted"
              >
                System Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">{profile?.full_name}</span>
            <ThemeToggle />
          </div>
          <form
            action={async () => {
              'use server';
              const supabase = await createClient();
              await supabase.auth.signOut();
              redirect('/auth/login');
            }}
          >
            <Button variant="outline" className="w-full" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
