import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store } from 'lucide-react';

export function PhotosSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Photos</CardTitle>
        <CardDescription>
          Upload photos of your business, products or services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-md p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Store className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-md font-medium">Photo Gallery</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Photo upload functionality will be available soon.
          </p>
          <Button variant="outline" disabled>
            Upload Photos
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
