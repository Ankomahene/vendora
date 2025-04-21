import { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '../AuthCard';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Sign Up | Vendora',
  description: 'Create a new Vendora account',
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create an account"
      description=" Fill in the details below to create your account"
    >
      <SignupForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <span>Already have an account? </span>
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
