import { Metadata } from 'next';
import { AuthCard } from '../AuthCard';
import NewPasswordForm from './NewPasswordForm';

export const metadata: Metadata = {
  title: 'Update Password | Vendora',
  description: 'Update your password',
};

export default function NewPasswordPage() {
  return (
    <AuthCard
      title=" Update Password"
      description="Create a new password for your account"
    >
      <NewPasswordForm />
    </AuthCard>
  );
}
