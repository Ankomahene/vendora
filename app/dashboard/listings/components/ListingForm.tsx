'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { FileUpload } from '@/components/file-upload';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile, Location } from '@/lib/types';
import { MapPreview } from '@/app/dashboard/components/MapPreview';
import { Listing } from '../types';
import { useCategories } from '@/lib/hooks/useCategories';
import { useProductTypes } from '@/lib/hooks/useProductTypes';

// Define the schema for form validation
const listingFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title must be at least 5 characters' })
    .max(100),
  description: z
    .string()
    .min(20, { message: 'Description must be at least 20 characters' })
    .max(2000),
  price: z.string().optional(),
  category: z.string({ required_error: 'Please select a product type' }),
  product_type: z.string({ required_error: 'Please select a product type' }),
  tags: z.string().optional(),
  service_modes: z
    .array(z.string())
    .min(1, { message: 'Select at least one service mode' }),
  use_profile_location: z.boolean().default(true),
  is_active: z.boolean().default(true),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

interface ListingFormProps {
  profile: UserProfile;
  listingToEdit?: Listing | null;
  isEditing?: boolean;
}

export function ListingForm({
  profile,
  listingToEdit = null,
  isEditing = false,
}: ListingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: productTypes, isLoading: isLoadingProductTypes } =
    useProductTypes();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [images, setImages] = useState<string[]>(listingToEdit?.images || []);
  const [useProfileLocation, setUseProfileLocation] = useState(
    listingToEdit
      ? JSON.stringify(listingToEdit.location) ===
          JSON.stringify(profile.seller_details.location)
      : true
  );
  const [location] = useState<Location | null>(
    listingToEdit?.location || profile?.seller_details?.location || null
  );

  const router = useRouter();
  const supabase = createClient();

  // Initialize form with default values
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: listingToEdit?.title || '',
      description: listingToEdit?.description || '',
      price: listingToEdit?.price ? String(listingToEdit.price) : '',
      product_type: listingToEdit?.product_type || '',
      category: listingToEdit?.category || '',
      tags: listingToEdit?.tags ? listingToEdit.tags.join(', ') : '',
      service_modes: listingToEdit?.service_modes || [],
      use_profile_location: useProfileLocation,
      is_active: listingToEdit?.is_active ?? true,
    },
  });

  // Function to handle form submission
  async function onSubmit(data: ListingFormValues) {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!useProfileLocation && !location) {
      toast.error('Please provide a location');
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine price value (null or number)
      const priceValue = data.price ? parseFloat(data.price) : null;

      // Determine location to use
      const listingLocation = useProfileLocation
        ? profile.seller_details.location
        : location;

      // Split tags into an array
      const tagsArray = data.tags
        ? data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Create the listing object
      const listing = {
        seller_id: profile.id,
        title: data.title,
        description: data.description,
        price: priceValue,
        product_type: data.product_type,
        category: data.category,
        tags: tagsArray,
        service_modes: data.service_modes,
        location: listingLocation,
        images: images,
        is_active: data.is_active,
      };

      let error;

      if (isEditing && listingToEdit) {
        // Update existing listing
        const response = await supabase
          .from('listings')
          .update(listing)
          .eq('id', listingToEdit.id)
          .select()
          .single();

        error = response.error;

        if (!error) {
          toast.success('Listing updated successfully!');
        }
      } else {
        // Insert new listing
        const response = await supabase
          .from('listings')
          .insert(listing)
          .select()
          .single();

        error = response.error;

        if (!error) {
          toast.success('Listing created successfully!');
        }
      }

      if (error) throw error;

      router.push('/dashboard/listings');

      // Force refresh to show updated data in the listings page
      router.refresh();
    } catch (error) {
      console.error(
        `Error ${isEditing ? 'updating' : 'creating'} listing:`,
        error
      );
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} listing`);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handler for image upload completion
  const handleImagesUploaded = (uploadedImages: string[]) => {
    setImages((prev) => [...prev, ...uploadedImages]);
  };

  // Handler for image deletion
  const handleImageDeleted = (deletedImage: string) => {
    setImages((prev) => prev.filter((image) => image !== deletedImage));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  placeholder="e.g. Professional Photography Services"
                  {...form.register('title', { required: true })}
                />
                {form.formState.errors.title && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  A clear, descriptive title for your listing
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your product or service in detail..."
                  className="min-h-32"
                  {...form.register('description', { required: true })}
                />
                {form.formState.errors.description && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Include key details, features, and benefits
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g. 99.99 (leave empty if price varies)"
                  step="0.01"
                  min="0"
                  {...form.register('price')}
                />
                {form.formState.errors.price && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.price.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Set a price or leave empty if price varies/negotiable
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={form.watch('is_active')}
                  onCheckedChange={(checked) => {
                    form.setValue('is_active', !!checked);
                  }}
                />
                <label htmlFor="is_active" className="text-sm cursor-pointer">
                  Active Listing
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories, Product Types and Tags */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Product Categories and Tags
              </h3>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Product Category <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingProductTypes}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a product category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  disabled={isLoadingCategories}
                />
                {form.formState.errors.product_type && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.product_type.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Choose the product type that best fits your listing
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="product_type" className="text-sm font-medium">
                  Product Type <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="product_type"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingProductTypes}
                    >
                      <SelectTrigger id="product_type">
                        <SelectValue placeholder="Select a product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  disabled={isLoadingProductTypes}
                />
                {form.formState.errors.product_type && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.product_type.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Choose the product type that best fits your listing
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <Input
                  id="tags"
                  placeholder="e.g. photography, wedding, portrait (comma separated)"
                  {...form.register('tags')}
                />
                {form.formState.errors.tags && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.tags.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Add relevant tags separated by commas
                </p>
              </div>

              <div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Service Modes <span className="text-destructive">*</span>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Select all service modes you offer
                  </p>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delivery"
                      checked={form
                        .watch('service_modes')
                        ?.includes('delivery')}
                      onCheckedChange={(checked) => {
                        const currentModes =
                          form.getValues('service_modes') || [];
                        if (checked) {
                          form.setValue('service_modes', [
                            ...currentModes,
                            'delivery',
                          ]);
                        } else {
                          form.setValue(
                            'service_modes',
                            currentModes.filter((mode) => mode !== 'delivery')
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor="delivery"
                      className="text-sm cursor-pointer"
                    >
                      Delivery
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="home_service"
                      checked={form
                        .watch('service_modes')
                        ?.includes('home_service')}
                      onCheckedChange={(checked) => {
                        const currentModes =
                          form.getValues('service_modes') || [];
                        if (checked) {
                          form.setValue('service_modes', [
                            ...currentModes,
                            'home_service',
                          ]);
                        } else {
                          form.setValue(
                            'service_modes',
                            currentModes.filter(
                              (mode) => mode !== 'home_service'
                            )
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor="home_service"
                      className="text-sm cursor-pointer"
                    >
                      Home Service
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in_store"
                      checked={form
                        .watch('service_modes')
                        ?.includes('in_store')}
                      onCheckedChange={(checked) => {
                        const currentModes =
                          form.getValues('service_modes') || [];
                        if (checked) {
                          form.setValue('service_modes', [
                            ...currentModes,
                            'in_store',
                          ]);
                        } else {
                          form.setValue(
                            'service_modes',
                            currentModes.filter((mode) => mode !== 'in_store')
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor="in_store"
                      className="text-sm cursor-pointer"
                    >
                      In-Store
                    </label>
                  </div>
                </div>

                {form.formState.errors.service_modes && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.service_modes.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Images <span className="text-destructive">*</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload 1-5 high-quality images of your product or service (max
                5MB per image)
              </p>

              <FileUpload
                bucketName="listings-images"
                path={`${profile.id}`}
                maxFiles={5}
                onUploadComplete={handleImagesUploaded}
                onDeleteFile={handleImageDeleted}
                existingFiles={images}
              />

              {images.length === 0 && (
                <p className="text-sm text-destructive">
                  At least one image is required
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location</h3>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="use_profile_location"
                  checked={useProfileLocation}
                  onCheckedChange={(checked) => {
                    const isChecked = !!checked;
                    setUseProfileLocation(isChecked);
                    form.setValue('use_profile_location', isChecked);
                  }}
                />
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor="use_profile_location"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Use my business location
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Use the location from your business profile
                  </p>
                </div>
              </div>

              {useProfileLocation && profile.seller_details?.location && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Your business location:
                  </h4>
                  <MapPreview
                    location={profile.seller_details.location}
                    isInteractive={false}
                  />
                </div>
              )}

              {!useProfileLocation && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Custom location:</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Location selector will be added here
                  </p>
                  {location ? (
                    <MapPreview location={location} isInteractive={true} />
                  ) : (
                    <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Please select a location
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/listings')}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update' : 'Create'} Listing
        </Button>
      </div>
    </div>
  );
}
