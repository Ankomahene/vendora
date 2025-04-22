import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';

export const metadata: Metadata = {
  title: 'Authentication - Vendora',
  description: 'Sign in or create an account with Vendora',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}
