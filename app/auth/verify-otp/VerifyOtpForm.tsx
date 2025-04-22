'use client';

import { PrimaryButton } from '@/components/PrimaryButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { otpSchema, type OtpFormValues } from '@/lib/auth-schema';
import { getSessionData } from '@/lib/sessionStorage';
import { verifyOtp } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function VerifyOtpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get the email from session storage
    const sessionData = getSessionData();
    if (sessionData.email) {
      setEmail(sessionData.email);
    }
  }, []);

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
      token: '',
    },
  });

  // Update the form with the email from session storage when it's available
  useEffect(() => {
    if (email) {
      form.setValue('email', email);
    }
  }, [email, form]);

  const onSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      await verifyOtp(data);

      // Send welcome email after successful verification
      await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'welcome',
          email: data.email,
        }),
      });

      toast.success('Email verified successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to verify email'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={!!email || isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="xxxxxx"
                    autoCapitalize="none"
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PrimaryButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </PrimaryButton>
        </div>
      </form>
    </Form>
  );
}
