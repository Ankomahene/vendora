'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useProfileServices } from '@/lib/hooks';
import { SellerDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { businessProfileSchema, BusinessProfileFormValues } from './types';
import {
  BusinessInfoSection,
  ServicesSection,
  ServiceModesSection,
  LocationSection,
  PhotosSection,
} from './components';

export function BusinessProfileForm() {
  const {
    user,
    isLoading: isUserLoading,
    updateProfile,
  } = useProfileServices();

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
          seller_details: data as SellerDetails,
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
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Business Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <LocationSection />
          <PhotosSection />
        </div>
      </form>
    </div>
  );
}
