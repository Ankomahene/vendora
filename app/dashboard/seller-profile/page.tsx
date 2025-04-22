import { Metadata } from 'next';
import { BusinessProfileForm } from './BusinessProfileForm';

export const metadata: Metadata = {
  title: 'Business Profile | Vendora',
  description: 'Manage your business information and services',
};

export default function BusinessProfilePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Business Profile</h1>
        <p className="text-muted-foreground">
          Manage your business information, services, and visibility
        </p>
      </div>
      <BusinessProfileForm />
    </div>
  );
}
