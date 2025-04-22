'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export const BuyerCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Want to Sell Your Services?</CardTitle>
        <CardDescription>
          Become a seller to list your services on our platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <div className="bg-[#4a51e5] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div className="text-sm">
              Register as a seller to start creating service listings
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <div className="bg-[#ff7b24] text-white rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div className="text-sm">
              Submit your business details for verification
            </div>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-[#4a51e5] to-[#2fd48f] hover:opacity-90 text-white"
          >
            <Link href="/auth/become-seller">Become a Seller</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
