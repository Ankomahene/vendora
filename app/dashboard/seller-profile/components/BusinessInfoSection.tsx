import { UseFormReturn } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone } from 'lucide-react';
import { BusinessProfileFormValues } from '../types';

interface BusinessInfoSectionProps {
  form: UseFormReturn<BusinessProfileFormValues>;
}

export function BusinessInfoSection({ form }: BusinessInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Manage your business details visible to potential customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem name="business_name" formItemId="business_name">
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_category"
              render={({ field }) => (
                <FormItem
                  name="business_category"
                  formItemId="business_category"
                >
                  <FormLabel>Business Category</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Barber, Plumber, Caterer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem name="contact_phone" formItemId="contact_phone">
                  <FormLabel>Business Phone</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Phone className="mr-2 h-4 w-4 opacity-70 my-auto" />
                      <Input placeholder="Contact phone number" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem name="description" formItemId="description">
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business, services, and expertise..."
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
