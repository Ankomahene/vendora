import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/profile';
import { ListingsContent } from './components/ListingsContent';

export const metadata = {
  title: 'Manage Listings - Vendora',
  description: 'Manage your listings in the Vendora marketplace',
};

export default async function ListingsPage() {
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
    redirect('/dashboard');
  }

  // Only sellers with approved status can access this page
  if (profile.role !== 'seller' || profile.seller_status !== 'approved') {
    redirect('/dashboard');
  }

  return <ListingsContent userId={user.id} />;
}
