'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useProfileServices } from '@/lib/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Shield } from 'lucide-react';
import { PasswordChangeForm } from '@/app/admin/profile/PasswordChangeForm';

const adminProfileFormSchema = z.object({
  full_name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar_url: z.string().optional(),
});

type AdminProfileFormValues = z.infer<typeof adminProfileFormSchema>;

export function AdminProfileForm() {
  const { user, isLoading: isUserLoading } = useProfileServices();
  const { updateProfile } = useProfileServices();

  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileFormSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [form, user]);

  const onSubmit = async (data: AdminProfileFormValues) => {
    if (!user) return;

    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        data,
      });
      toast.success('Admin profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
          <CardDescription>
            You do not have administrator privileges to view this page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Admin Profile Information
          </CardTitle>
          <CardDescription>
            Update your administrator profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={form.getValues().avatar_url || ''}
                  alt={form.getValues().full_name}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#4a51e5] to-[#2fd48f] text-white text-lg">
                  {getInitials(form.getValues().full_name || 'Admin')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium">Admin Profile Picture</h3>
                <p className="text-xs text-muted-foreground">
                  Your profile picture is visible to all users
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Avatar
                </Button>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem name="full_name" formItemId="full_name">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
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
                        placeholder="Enter your email"
                        {...field}
                        disabled
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem name="phone" formItemId="phone">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem name="address" formItemId="address">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address"
                        className="resize-none min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Password</CardTitle>
          <CardDescription>
            Change your administrator account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm />
        </CardContent>
      </Card>
    </div>
  );
}
