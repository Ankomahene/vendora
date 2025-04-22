import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserProfile } from '@/lib/types';
import {
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Clock,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface Props {
  profile: UserProfile;
}

export const SellerCard = ({ profile }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Seller Status</CardTitle>

          <StatusBadge status={profile.seller_status || 'pending'} />
        </div>
        <CardDescription>
          {profile.seller_status === 'approved'
            ? 'Your seller account is active and you can create listings.'
            : profile.seller_status === 'rejected'
            ? 'Your seller application was rejected. Please contact support.'
            : 'Your seller application is being reviewed by our team.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {profile.seller_status === 'pending' && (
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <Clock className="h-5 w-5 text-warning" />
            <div className="text-sm">
              Approval typically takes 24-48 hours. We&apos;ll notify you by
              email once reviewed.
            </div>
          </div>
        )}

        {profile.seller_status === 'rejected' && (
          <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div className="text-sm">
              We couldn&apos;t approve your seller account. Please check your
              email for details or contact our support team.
            </div>
          </div>
        )}

        {profile.seller_status === 'approved' && (
          <div className="flex flex-col space-y-4">
            <Button asChild className="w-full justify-between">
              <Link href="/dashboard/listings/create">
                Create New Listing
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild className="justify-between">
                <Link href="/dashboard/seller-profile">
                  Edit Profile
                  <FileText className="h-4 w-4 ml-1" />
                </Link>
              </Button>

              <Button variant="outline" asChild className="justify-between">
                <Link href="/dashboard/analytics">
                  Analytics
                  <BarChart3 className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
