import { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '../AuthCard';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Vendora',
  description: 'Reset your password',
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email address and we'll send you a link to reset
              your password"
    >
      <ResetPasswordForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <span>Remember your password? </span>
        <Link
          href="/auth/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
