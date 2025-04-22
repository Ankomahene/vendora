'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useProfileServices } from '@/lib/hooks';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user: profile } = useProfileServices();
  const pathname = usePathname();

  // Close mobile menu only when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader
        profile={profile || null}
        onMenuToggle={() => setIsMobileMenuOpen(true)}
      />

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <DashboardSidebar profile={profile} />
        </div>

        {/* Mobile sidebar with sheet */}
        <Sheet
          open={isMobileMenuOpen}
          onOpenChange={(open) => {
            setIsMobileMenuOpen(open);
          }}
        >
          <SheetContent side="left" className="p-0 w-full sm:max-w-xs">
            <DashboardSidebar profile={profile} />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="max-h-[calc(100vh-67px)] overflow-auto bg-muted/30 w-full">
          <div className="container py-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
