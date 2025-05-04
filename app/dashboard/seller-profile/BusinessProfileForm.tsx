'use client';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Card, CardContent } from '@/components/ui/card';
import { useProfileServices } from '@/lib/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  BusinessInfoSection,
  PhotosSection,
  ServiceModesSection,
  ServicesSection,
} from './components';
import { BusinessProfileFormValues, businessProfileSchema } from './types';
import { SellerDetails } from '@/lib/types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const DynamicMapSection = dynamic(
  () => import('@/components/map/components/MapSection'),
  {
    ssr: false,
  }
);

export function BusinessProfileForm() {
  const {
    user,
    isLoading: isUserLoading,
    updateProfile,
  } = useProfileServices();
  const pathname = usePathname();

  const form = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      business_name: '',
      business_category: '',
      description: '',
      contact_phone: '',
      services: [],
      service_modes: [
        { type: 'delivery' as const, enabled: false },
        { type: 'home_service' as const, enabled: false },
        { type: 'in_store' as const, enabled: false },
      ],
    },
  });

  useEffect(() => {
    async function loadSellerProfile() {
      if (user && user.role === 'seller') {
        if (user.seller_details) {
          const sellerDetails = user.seller_details;
          form.reset({
            business_name: sellerDetails.business_name || '',
            business_category: sellerDetails.business_category || '',
            description: sellerDetails.description || '',
            contact_phone: sellerDetails.contact_phone || '',
            services: sellerDetails.services || [],
            service_modes: sellerDetails.service_modes || [
              { type: 'delivery' as const, enabled: false },
              { type: 'home_service' as const, enabled: false },
              { type: 'in_store' as const, enabled: false },
            ],
          });
        }
      }
    }

    loadSellerProfile();
  }, [form, user]);

  const onSubmit = async (data: BusinessProfileFormValues) => {
    if (!user) return;

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          ...(pathname === '/dashboard/seller-onboarding'
            ? {
                first_login: false,
                seller_status: 'pending',
              }
            : {}),
          seller_details: {
            ...user.seller_details,
            ...(data as SellerDetails),
          },
        },
      });

      toast.success('Business profile updated successfully');
    } catch (error) {
      console.error('Error updating business profile:', error);
      toast.error('An error occurred while updating your business profile');
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user && user.role !== 'seller') {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <h3 className="text-lg font-medium">
              Business Profile Not Available
            </h3>
            <p className="text-muted-foreground mt-2">
              You need a seller account to access this feature.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <BusinessInfoSection form={form} />

          <Card>
            <CardContent className="pt-6">
              <ServicesSection form={form} />
              <ServiceModesSection form={form} />

              <div className="flex justify-end mt-6">
                <PrimaryButton type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Business Details
                </PrimaryButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <DynamicMapSection />
      <PhotosSection />

      <div className="flex justify-end mt-6">
        <Link href="/dashboard">
          <PrimaryButton>Done</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
