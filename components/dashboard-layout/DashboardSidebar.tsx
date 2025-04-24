'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Heart,
  Settings,
  Store,
  Users,
  FileText,
  ChevronRight,
  Building,
  Tag,
} from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

interface DashboardSidebarProps {
  profile: UserProfile | null;
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const isSeller = profile?.role === 'seller';
  const isAdmin = profile?.role === 'admin';

  const userLinks = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/messages',
      label: 'Messages',
      icon: MessageSquare,
    },
    {
      href: '/dashboard/favorites',
      label: 'Favorites',
      icon: Heart,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const sellerLinks = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/messages',
      label: 'Messages',
      icon: MessageSquare,
    },
    {
      href: '/dashboard/favorites',
      label: 'Favorites',
      icon: Heart,
    },
    {
      href: '/dashboard/listings',
      label: 'My Listings',
      icon: ShoppingBag,
    },
    {
      href: '/dashboard/seller-profile',
      label: 'Business Profile',
      icon: Store,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const adminLinks = [
    {
      href: '/admin',
      label: 'Admin Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: Building,
    },
    {
      href: '/admin/product-types',
      label: 'Product Types',
      icon: Tag,
    },
    {
      href: '/admin/sellers',
      label: 'Manage Sellers',
      icon: Users,
    },
    {
      href: '/admin/listings',
      label: 'Review Listings',
      icon: FileText,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const links = isAdmin ? adminLinks : isSeller ? sellerLinks : userLinks;

  return (
    <aside className="w-full md:w-64 bg-card border-r h-full flex flex-col">
      <div className="p-6">
        <Logo />
      </div>
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-[#4a51e5]/10 text-[#4a51e5] hover:bg-[#4a51e5]/15'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
                {pathname === link.href && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm font-medium">Need help?</div>
          <p className="text-xs text-muted-foreground mt-1">
            Contact our support team for assistance with your account.
          </p>
          <Link
            href="/support"
            className="mt-3 text-xs font-medium text-[#4a51e5] hover:underline block"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </aside>
  );
}
