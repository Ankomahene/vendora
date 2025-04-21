import { Metadata } from 'next';
import Link from 'next/link';
import { AuthCard } from '../AuthCard';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Login | Vendora',
  description: 'Login to your Vendora account',
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Enter your email and password to sign in to your account"
    >
      <LoginForm />
      <div className="flex flex-col space-y-2 text-center">
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/reset-password"
            className="hover:text-brand underline underline-offset-4"
          >
            Forgot your password?
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/auth/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
