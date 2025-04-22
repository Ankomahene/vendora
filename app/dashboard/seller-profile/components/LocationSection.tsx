import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export function LocationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Location</CardTitle>
        <CardDescription>
          Set your business location to help customers find you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-md p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-md font-medium">Location Settings</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Map-based location selection will be available soon.
          </p>
          <Button variant="outline" disabled>
            Set Location
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
