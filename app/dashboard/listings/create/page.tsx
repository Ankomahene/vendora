import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/profile';
import { PageHeader } from '@/components/page-header';
import { ListingForm } from '../components/ListingForm';

export const metadata = {
  title: 'Create Listing',
  description: 'Create a new listing for your services or products',
};

export default async function CreateListingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?next=/dashboard/listings/create');
  }

  const profile = await getUserProfile(user.id);

  if (!profile) {
    redirect('/dashboard/profile?next=/dashboard/listings/create');
  }

  if (profile.role !== 'seller') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Create Listing"
        text="Add a new product or service to your marketplace listings"
      />
      <ListingForm profile={profile} />
    </div>
  );
}
