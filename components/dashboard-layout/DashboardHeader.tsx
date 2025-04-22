'use client';

import { UserProfile } from '@/lib/types';
import { Bell, Menu, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserMenu } from '@/components/UserMenu';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface DashboardHeaderProps {
  profile: UserProfile | null;
  onMenuToggle?: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:flex-1 md:gap-4 lg:gap-8">
          <form className="hidden md:flex-1 md:flex max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for services, listings, sellers..."
                className="w-full bg-background pl-8 focus-visible:ring-[#4a51e5]"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#ff7b24]" />
            <span className="sr-only">Notifications</span>
          </Button>
          <UserMenu />
          <Separator orientation="vertical" className="h-4 w-0.5" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
