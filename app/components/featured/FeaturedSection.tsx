import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { featuredVendors } from '@/lib/constants';

export function FeaturedSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white dark:bg-zinc-950">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
              Featured Vendors
            </h2>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl">
              Discover top-rated businesses in your area, handpicked for quality
              and exceptional service.
            </p>
          </div>
          <a
            href="#"
            className="mt-6 md:mt-0 group inline-flex items-center text-primary font-medium"
          >
            <span>View all vendors</span>
            <ArrowRight
              size={16}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
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
                <Button className="bg-primary hover:bg-primary">
                  List your business
                </Button>
                <Button variant="outline">Learn more</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  distance: string;
  image: string;
  location: string;
}

interface VendorCardProps {
  vendor: Vendor;
}

function VendorCard({ vendor }: VendorCardProps) {
  return (
    <div className="group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden relative">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-white dark:bg-zinc-800 rounded-full px-2 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {vendor.category}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
            {vendor.name}
          </h3>
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{vendor.location}</span>
          <span className="mx-2">•</span>
          <span>{vendor.distance}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {vendor.reviews} reviews
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80 hover:bg-primary/5 dark:hover:bg-zinc-800 py-0 px-2"
          >
            View details
          </Button>
        </div>
      </div>
    </div>
  );
}
