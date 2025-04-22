import { z } from 'zod';

export const businessProfileSchema = z.object({
  business_name: z.string().min(2, {
    message: 'Business name must be at least 2 characters.',
  }),
  business_category: z.string().min(2, {
    message: 'Category must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  contact_phone: z.string().min(6, {
    message: 'Phone number is required',
  }),
  services: z.array(z.string()).min(1, {
    message: 'At least one service is required',
  }),
  service_modes: z.array(
    z.object({
      type: z.enum(['delivery', 'home_service', 'in_store']),
      enabled: z.boolean(),
    })
  ),
});

export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;
