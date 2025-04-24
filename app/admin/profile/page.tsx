import { Metadata } from 'next';
import { AdminProfileForm } from './AdminProfileForm';

export const metadata: Metadata = {
  title: 'Admin Profile | Vendora',
  description: 'Manage your administrator profile information',
};

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information and account settings
        </p>
      </div>
      <AdminProfileForm />
    </div>
  );
}
