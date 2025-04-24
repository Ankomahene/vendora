import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
import { adminProtect } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await adminProtect();

  return <DashboardLayout>{children}</DashboardLayout>;
}
