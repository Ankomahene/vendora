import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/services/profile';
import { Logo } from '@/components/Logo';
import { BusinessProfileForm } from '../seller-profile/BusinessProfileForm';

export default async function SellerOnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/auth/login');
  }

  const profile = await getUserProfile(user.id);

  // Check if user is a seller
  if (!profile || profile.role !== 'seller') {
    redirect('/dashboard');
  }

  // If not first login, redirect to dashboard as they've already onboarded
  if (!profile.first_login) {
    redirect('/dashboard');
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <div className="flex justify-center pb-6">
        <Logo />
      </div>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Complete Your Seller Profile
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Welcome to Vendora! Please provide information about your business
            to complete your seller registration. This information will be
            reviewed by our team before your seller account is approved.
          </p>
        </div>

        <BusinessProfileForm />
      </div>
    </div>
  );
}
