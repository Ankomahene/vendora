'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Eye, MoreVertical, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Listing } from '../types';
import { CURRENCY } from '@/lib/constants';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isActive, setIsActive] = useState(listing.is_active);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const defaultImage = 'https://via.placeholder.com/300x200?text=No+Image';
  const thumbnailImage =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : defaultImage;

  const timeAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleStatus = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_active: !isActive })
        .eq('id', listing.id);

      if (error) throw error;

      setIsActive(!isActive);
      toast.success(
        `Listing ${!isActive ? 'activated' : 'deactivated'} successfully`
      );
    } catch (error) {
      console.error('Error toggling listing status:', error);
      toast.error('Failed to update listing status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this listing? This action cannot be undone.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listing.id);

      if (error) throw error;

      toast.success('Listing deleted successfully');
      // Force refresh to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnailImage}
          alt={listing.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold truncate">
            {truncateText(listing.title, 60)}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/listings/${listing.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/listings/${listing.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm mb-2">
          {truncateText(listing.description, 100)}
        </p>

        {/* <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="h-3.5 w-3.5 mr-1" />
          <span>{listing.product_type}</span>
        </div> */}

        {listing.price !== null && (
          <p className="font-medium mt-2">
            {CURRENCY} {listing.price.toFixed(2)}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Posted {timeAgo}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isActive ? 'Active' : 'Inactive'}
          </span>
          <Switch
            checked={isActive}
            onCheckedChange={toggleStatus}
            disabled={isLoading}
            aria-label="Toggle listing status"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
