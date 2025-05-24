'use client';

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/lib/auth-schema';
import { requestPasswordReset } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PrimaryButton } from '@/components/PrimaryButton';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
} from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(data);
      toast.success('Check your email for a password reset code');
      router.push('/auth/verify-otp');
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send reset instructions'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem name="email" formItemId="email">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
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
            {isLoading ? 'Sending instructions...' : 'Send instructions'}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
}
