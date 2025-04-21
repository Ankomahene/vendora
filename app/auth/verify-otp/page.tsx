import { Metadata } from 'next';
import { AuthCard } from '../AuthCard';
import VerifyOtpForm from './VerifyOtpForm';

export const metadata: Metadata = {
  title: 'Verify Email | Vendora',
  description: 'Verify your email address to continue',
};

export default function VerifyOtpPage() {
  return (
    <AuthCard
      title="Verify Your Email"
      description="Enter the verification code sent to your email"
    >
      <VerifyOtpForm />
    </AuthCard>
  );
}
