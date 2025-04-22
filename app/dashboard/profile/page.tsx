import { Metadata } from 'next';
import { UserProfileForm } from './UserProfileForm';

export const metadata: Metadata = {
  title: 'User Profile | Vendora',
  description: 'Manage your personal profile information',
};

export default function UserProfilePage() {
  return (
    <div className="space-y-6  max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>
      <UserProfileForm />
    </div>
  );
}
