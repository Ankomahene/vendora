'use client';

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
import {
  newPasswordSchema,
  type NewPasswordFormValues,
} from '@/lib/auth-schema';
import { updatePassword } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function NewPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    setIsLoading(true);
    try {
      await updatePassword(data.password);
      toast.success('Password updated successfully!');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update password'
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
            name="password"
            render={({ field }) => (
              <FormItem name="password" formItemId="password">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem name="confirmPassword" formItemId="confirmPassword">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
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
            {isLoading ? 'Updating password...' : 'Update password'}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
}
