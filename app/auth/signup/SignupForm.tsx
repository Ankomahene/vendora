'use client';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
} from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { signupSchema, type SignupFormValues } from '@/lib/auth-schema';
import { signUpUser } from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      role: 'buyer',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signUpUser(data);
      toast.success('Check your email for a verification code');
      router.push(`/auth/verify-otp`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  function getFieldValue(name: keyof SignupFormValues) {
    return form.getValues(name);
  }

  function setValue(name: keyof SignupFormValues, value: string) {
    form.setValue(name, value);
  }

  return (
    <FormProvider form={form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem name="full_name" formItemId="full_name">
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    autoCapitalize="words"
                    autoComplete="name"
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem name="password" formItemId="password">
                <FormLabel>Password</FormLabel>
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
            name="role"
            render={() => (
              <FormItem name="role" formItemId="role">
                <FormLabel>Account Type</FormLabel>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <Button
                    type="button"
                    variant={
                      getFieldValue('role') === 'buyer' ? 'default' : 'outline'
                    }
                    className="w-full"
                    onClick={() => setValue('role', 'buyer')}
                    disabled={isLoading}
                  >
                    Buyer
                  </Button>
                  <Button
                    type="button"
                    variant={
                      getFieldValue('role') === 'seller' ? 'default' : 'outline'
                    }
                    className="w-full"
                    onClick={() => setValue('role', 'seller')}
                    disabled={isLoading}
                  >
                    Seller
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <PrimaryButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
}
