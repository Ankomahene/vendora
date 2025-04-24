'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Store } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { useProfileServices } from '@/lib/hooks';
import { toast } from 'sonner';

export function PhotosSection() {
  const { user, updateProfile } = useProfileServices();

  // Get existing images from seller_details with safety checks
  const existingImages = user?.seller_details?.images || [];

  const handleUploadComplete = async (urls: string[]) => {
    if (!user || !urls.length) return;

    try {
      const sellerDetails = user.seller_details || {};
      const currentImages = sellerDetails.images || [];

      // Combine existing images with new ones, avoiding duplicates
      const updatedImages = [...currentImages, ...urls].filter(
        (url, index, self) => self.indexOf(url) === index
      );

      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          seller_details: {
            ...sellerDetails,
            images: updatedImages,
          },
        },
      });
    } catch (error) {
      console.error('Error updating business photos:', error);
      toast.error('Failed to update business photos');
    }
  };

  const handleDeleteFile = async (url: string) => {
    if (!user || !url) return;

    try {
      const sellerDetails = user.seller_details || {};
      const currentImages = sellerDetails.images || [];

      // Remove the deleted image from the array
      const updatedImages = currentImages.filter((image) => image !== url);

      await updateProfile.mutateAsync({
        userId: user.id,
        data: {
          seller_details: {
            ...sellerDetails,
            images: updatedImages,
          },
        },
      });

      toast.success('Photo deleted successfully');
    } catch (error) {
      console.error('Error deleting business photo:', error);
      toast.error('Failed to delete business photo');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Photos</CardTitle>
        <CardDescription>
          Upload photos of your business, products or services
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.role !== 'seller' ? (
          <div className="bg-muted/50 rounded-md p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Store className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-md font-medium">Seller Account Required</h3>
            <p className="text-sm text-muted-foreground mt-2">
              You need a seller account to upload business photos.
            </p>
          </div>
        ) : (
          <FileUpload
            bucketName="business-photos"
            path={user.id}
            maxFiles={10}
            maxSize={5}
            existingFiles={existingImages}
            onUploadComplete={handleUploadComplete}
            onDeleteFile={handleDeleteFile}
          />
        )}
      </CardContent>
    </Card>
  );
}
