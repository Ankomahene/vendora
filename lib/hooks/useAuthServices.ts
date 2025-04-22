import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  signUpUser,
  verifyOtp,
  signInUser,
  signOutUser,
  requestPasswordReset,
  updatePassword,
  becomeSeller,
} from '@/services/auth';
import {
  LoginFormValues,
  OtpFormValues,
  ResetPasswordFormValues,
  SignupFormValues,
} from '@/lib/auth-schema';

export function useAuthServices() {
  const queryClient = useQueryClient();

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: (data: SignupFormValues) => signUpUser(data),
    onSuccess: () => {
      // Optionally invalidate queries after signup
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: (data: OtpFormValues) => verifyOtp(data),
    onSuccess: () => {
      // Invalidate user data queries
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (data: LoginFormValues) => signInUser(data),
    onSuccess: () => {
      // Invalidate user data queries
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: () => signOutUser(),
    onSuccess: () => {
      // Clear user data from cache
      queryClient.invalidateQueries();
    },
  });

  // Request password reset mutation
  const requestPasswordResetMutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) => requestPasswordReset(data),
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (password: string) => updatePassword(password),
  });

  // Become seller mutation
  const becomeSellerMutation = useMutation({
    mutationFn: () => becomeSeller(),
    onSuccess: () => {
      // Invalidate user profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  return {
    signUp: signUpMutation,
    verifyOtp: verifyOtpMutation,
    signIn: signInMutation,
    signOut: signOutMutation,
    requestPasswordReset: requestPasswordResetMutation,
    updatePassword: updatePasswordMutation,
    becomeSeller: becomeSellerMutation,
  };
}
