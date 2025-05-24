'use client';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/lib/hooks';
import { Category } from '@/lib/types/category';
import { SellerDetails } from '@/lib/types';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function FeaturedSection({
  sellers,
}: {
  sellers: { id: string; seller_details: SellerDetails }[];
}) {
  const { data: categories } = useCategories();

  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-zinc-950">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              Featured Businesses
            </h2>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
              Discover top-rated businesses in your area, handpicked for quality
              and exceptional service.
            </p>
          </div>
          <Link
            href="/search?type=sellers"
            className="mt-6 md:mt-0 group inline-flex items-center text-primary font-medium"
          >
            <span>View all businesses</span>
            <ArrowRight
              size={16}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sellers.map((seller) => (
            <VendorCard
              key={seller.id}
              seller={seller}
              category={categories?.find(
                (category) =>
                  category.id === seller.seller_details.business_category
              )}
            />
          ))}
        </div>

        <div className="mt-16 md:mt-24">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#4a51e5"
                  d="M39.9,-51.2C54.3,-44.1,70.2,-34.3,76.3,-20.1C82.4,-5.9,78.8,12.7,70.5,27.9C62.2,43.1,49.3,54.9,34.9,60.9C20.5,66.9,4.6,67.1,-12.7,65.6C-30,64.1,-48.8,60.9,-57.8,49.5C-66.7,38.1,-65.9,18.5,-63.4,1.5C-61,-15.5,-56.9,-30.5,-47.6,-38.1C-38.2,-45.6,-23.5,-45.7,-9.9,-48.9C3.8,-52.1,25.6,-58.4,39.9,-51.2Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>

            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                Own a business?
              </h2>
              <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-8">
                Join thousands of local businesses on Vendora. Increase your
                visibility and connect with customers in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard/seller-profile">
                  <Button className="bg-primary hover:bg-primary/80 cursor-pointer">
                    List your business
                  </Button>
                </Link>
                <Button variant="outline">Learn more</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface VendorCardProps {
  seller: { id: string; seller_details: SellerDetails };
  category: Category | undefined;
}

function VendorCard({ seller, category }: VendorCardProps) {
  return (
    <div className="group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden relative">
        <Link href={`/sellers/${seller.id}`}>
          <Image
            src={seller.seller_details.images[0]}
            alt={seller.seller_details.business_name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-3 left-3 bg-white dark:bg-zinc-800 rounded-full px-2 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {category?.name}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
            {seller.seller_details.business_name}
          </h3>
        </div>

        <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          <MapPin size={16} className="mr-1" />
          <span>{seller.seller_details.location.name}</span>
        </div>

        <div className="flex justify-between items-center">
          <Link href={`/sellers/${seller.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/5 dark:hover:bg-zinc-800 py-0 px-2"
            >
              View details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
