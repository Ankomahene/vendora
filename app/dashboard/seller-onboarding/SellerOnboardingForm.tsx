'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MapPin, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProfileServices } from '@/lib/hooks';

const categories = [
  { value: 'barber', label: 'Barber' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'caterer', label: 'Caterer' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'tutor', label: 'Tutor' },
  { value: 'gardener', label: 'Gardener' },
  { value: 'photographer', label: 'Photographer' },
];

const serviceModes = [
  { id: 'delivery', label: 'Delivery' },
  { id: 'home_service', label: 'Home Service' },
  { id: 'in_store', label: 'In-store Service' },
];

const formSchema = z.object({
  business_name: z
    .string()
    .min(2, { message: 'Business name must be at least 2 characters.' }),
  business_category: z
    .string()
    .min(1, { message: 'Please select a business category.' }),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters.' }),
  contact_phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number.' }),
  services: z
    .array(z.string())
    .min(1, { message: 'Add at least one service.' }),
  service_modes: z
    .array(
      z.object({
        type: z.enum(['delivery', 'home_service', 'in_store']),
        enabled: z.boolean(),
      })
    )
    .refine((data) => data.some((mode) => mode.enabled), {
      message: 'Please select at least one service mode.',
    }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(1, { message: 'Please select a location.' }),
  }),
});

export function SellerOnboardingForm() {
  const router = useRouter();
  const { user, updateProfile } = useProfileServices();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: '',
      business_category: '',
      description: '',
      contact_phone: '',
      services: [],
      service_modes: serviceModes.map((mode) => ({
        type: mode.id as 'delivery' | 'home_service' | 'in_store',
        enabled: false,
      })),
      location: {
        lat: 0,
        lng: 0,
        address: '',
      },
    },
  });

  const services = form.watch('services');
  const serviceModeValues = form.watch('service_modes');

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      form.setValue('services', [...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (service: string) => {
    form.setValue(
      'services',
      services.filter((s) => s !== service)
    );
  };

  const handleServiceModeChange = (
    id: 'delivery' | 'home_service' | 'in_store',
    checked: boolean
  ) => {
    const updatedModes = serviceModeValues.map((mode) =>
      mode.type === id ? { ...mode, enabled: checked } : mode
    );
    form.setValue('service_modes', updatedModes);
  };

  // Mock function for the map location picker
  const handlePickLocation = () => {
    // In a real implementation, this would open a map modal
    form.setValue('location', {
      lat: 40.7128,
      lng: -74.006,
      address: '123 Example Street, New York, NY 10001',
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error('You must be logged in to complete this action');
      return;
    }

    setIsSubmitting(true);
    try {
      const sellerDetails = {
        business_name: values.business_name,
        business_category: values.business_category,
        description: values.description,
        contact_phone: values.contact_phone,
        services: values.services,
        service_modes: values.service_modes,
        location: values.location,
        images: [], // Start with empty images, will be updated later
      };

      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          first_login: false,
          seller_status: 'pending',
          seller_details: sellerDetails,
        },
      });

      toast.success('Seller profile submitted successfully!');
      router.refresh();
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to submit seller profile. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#4a51e5] to-[#2fd48f] bg-clip-text text-transparent">
          Complete Your Seller Profile
        </CardTitle>
        <CardDescription>
          Tell us about your business to get started selling on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem
                  name="business_name"
                  formItemId="business_name"
                  className="space-y-2"
                >
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_category"
              render={({ field }) => (
                <FormItem
                  name="business_category"
                  formItemId="business_category"
                  className="space-y-2"
                >
                  <FormLabel>Business Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem
                name="description"
                formItemId="description"
                className="space-y-2"
              >
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business and what makes you unique..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_phone"
            render={({ field }) => (
              <FormItem
                name="contact_phone"
                formItemId="contact_phone"
                className="space-y-2"
              >
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Your business phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="services"
            render={() => (
              <FormItem
                name="services"
                formItemId="services"
                className="space-y-2"
              >
                <FormLabel>Services Offered</FormLabel>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Add a service"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddService}
                    className="bg-[#4a51e5] hover:bg-[#4a51e5]/90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {services.length > 0 ? (
                    services.map((service, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm"
                      >
                        {service}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => handleRemoveService(service)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No services added yet
                    </p>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service_modes"
            render={() => (
              <FormItem
                name="service_modes"
                formItemId="service_modes"
                className="space-y-2"
              >
                <FormLabel>Service Modes</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {serviceModes.map((mode) => {
                    const currentMode = serviceModeValues.find(
                      (m) => m.type === mode.id
                    );
                    return (
                      <div
                        key={mode.id}
                        className={`border rounded-md p-4 transition-colors ${
                          currentMode?.enabled
                            ? 'border-[#4a51e5] bg-[#4a51e5]/5'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`mode-${mode.id}`}
                            checked={currentMode?.enabled || false}
                            onCheckedChange={(checked) =>
                              handleServiceModeChange(
                                mode.id as
                                  | 'delivery'
                                  | 'home_service'
                                  | 'in_store',
                                checked as boolean
                              )
                            }
                          />
                          <label
                            htmlFor={`mode-${mode.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {mode.label}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={() => (
              <FormItem
                name="location"
                formItemId="location"
                className="space-y-2"
              >
                <FormLabel>Business Location</FormLabel>
                <div className="grid gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePickLocation}
                    className="flex items-center justify-center gap-2 h-20 border-dashed hover:border-[#4a51e5] hover:bg-[#4a51e5]/5"
                  >
                    <MapPin className="h-5 w-5 text-[#4a51e5]" />
                    <span>Pick Location on Map</span>
                  </Button>

                  {form.getValues().location.address && (
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm">
                        {form.getValues().location.address}
                      </p>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                'Submit Profile'
              )}
            </PrimaryButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
