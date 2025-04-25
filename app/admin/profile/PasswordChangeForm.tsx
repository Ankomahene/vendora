'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: 'Current password must be at least 8 characters.',
  }),
  newPassword: z.string().min(8, {
    message: 'New password must be at least 8 characters.',
  }),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordChangeForm() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
    mode: 'onChange',
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);

    try {
      // Create Supabase client
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Authentication required');
      }

      // Get user's email for sign-in
      const { data: userData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (profileError || !userData?.email) {
        throw new Error('Could not retrieve user email');
      }

      // Verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: data.currentPassword,
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        throw new Error(`Failed to update password: ${updateError.message}`);
      }

      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to change password'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <form
      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={passwordForm.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem name="currentPassword" formItemId="currentPassword">
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter current password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem name="newPassword" formItemId="newPassword">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="outline"
          disabled={isChangingPassword || !passwordForm.formState.isValid}
        >
          {isChangingPassword && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Change Password
        </Button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-2">
          Form Valid: {passwordForm.formState.isValid ? 'Yes' : 'No'} | Errors:{' '}
          {Object.keys(passwordForm.formState.errors).length}
        </div>
      )}
    </form>
  );
}
