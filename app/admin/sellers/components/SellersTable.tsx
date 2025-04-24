'use client';

import { UserProfile } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { MoreHorizontal, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { StatusBadge } from '@/components/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SellerDetailsSheet } from './SellerDetailsSheet';

interface SellersTableProps {
  sellers: UserProfile[];
}

export function SellersTable({ sellers }: SellersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<UserProfile | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Handle opening seller details
  const handleViewDetails = (seller: UserProfile) => {
    setSelectedSeller(seller);
    setIsDetailsOpen(true);
  };

  // Filter sellers based on search query
  const filteredSellers = sellers.filter((seller) => {
    const searchTerms = searchQuery.toLowerCase();
    return (
      seller.full_name.toLowerCase().includes(searchTerms) ||
      seller.email.toLowerCase().includes(searchTerms) ||
      seller.seller_details?.business_name
        ?.toLowerCase()
        .includes(searchTerms) ||
      false ||
      seller.seller_details?.business_category
        ?.toLowerCase()
        .includes(searchTerms) ||
      false
    );
  });

  const getInitials = (name?: string) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div className="flex mb-4 gap-3">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sellers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Seller</TableHead>
              <TableHead>Business</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No sellers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSellers.map((seller) => (
                <TableRow
                  key={seller.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewDetails(seller)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={seller.avatar_url || ''}
                          alt={seller.full_name}
                        />
                        <AvatarFallback className="bg-primary/10">
                          {getInitials(seller.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{seller.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {seller.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {seller.seller_details?.business_name || '-'}
                  </TableCell>
                  <TableCell>
                    {seller.seller_details?.business_category || '-'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={seller.seller_status || 'pending'} />
                  </TableCell>
                  <TableCell>{formatDate(seller.created_at)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleViewDetails(seller)}
                        >
                          <Search className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link
                            href={`/seller/${seller.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Public Profile</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SellerDetailsSheet
        seller={selectedSeller}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
