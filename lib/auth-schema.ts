import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Signup validation schema
export const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['buyer', 'seller']),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

// OTP verification schema
export const otpSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  token: z.string().min(6, 'Please enter a valid OTP code'),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// Reset password schema
export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// New password schema
export const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;
