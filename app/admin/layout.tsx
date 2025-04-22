import { DashboardLayout } from '@/components/dashboard-layout/DashboardLayout';
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
