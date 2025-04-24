import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/profile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ListingForm } from '../../components/ListingForm';

export const metadata = {
  title: 'Edit Listing - Vendora',
  description: 'Edit your listing in the Vendora marketplace',
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
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

  // Fetch the listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('seller_id', user.id) // Ensure the user owns this listing
    .single();

  if (listingError || !listing) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/listings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Link>
        </Button>
      </div>

      <ListingForm profile={profile} listingToEdit={listing} isEditing={true} />
    </div>
  );
}
