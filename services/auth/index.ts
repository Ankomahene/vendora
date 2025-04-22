import { createClient } from '@/lib/supabase/client';
import {
  LoginFormValues,
  OtpFormValues,
  ResetPasswordFormValues,
  SignupFormValues,
} from '@/lib/auth-schema';
import {
  clearSessionData,
  getSessionData,
  storeSessionData,
} from '@/lib/sessionStorage';

// Function to sign up user
export async function signUpUser(data: SignupFormValues) {
  try {
    const response = await fetch('/api/auth/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'verification',
        email: data.email,
        password: data.password,
        full_name: data.full_name,
        role: data.role,
        isPasswordReset: false,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error.message || 'Failed to send verification email'
      );
    }

    // Store email and role in session storage
    storeSessionData({
      email: data.email,
      role: data.role,
      full_name: data.full_name,
    });

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send verification email');
  }
}

// Function to verify OTP
export async function verifyOtp(data: OtpFormValues) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.token,
    type: 'email',
  });

  if (error) {
    throw new Error(error.message);
  }

  return { user: authData.user, session: authData.session };
}

// Function to sign in user
export async function signInUser(data: LoginFormValues) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { user: authData.user, session: authData.session };
}

// Function to sign out user
export async function signOutUser() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  // Clear session storage
  clearSessionData();

  return true;
}

// Function to request password reset
export async function requestPasswordReset(data: ResetPasswordFormValues) {
  // Store email in session storage for verification page
  storeSessionData({
    email: data.email,
    isPasswordReset: true,
  });

  try {
    const response = await fetch('/api/auth/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'verification',
        email: data.email,
        isPasswordReset: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send password reset email');
    }

    return true;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to request password reset'
    );
  }
}

// Function to update password
export async function updatePassword(password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Get email from session storage before clearing
  const { email } = getSessionData();
  clearSessionData();

  if (email) {
    // Send password reset confirmation email
    try {
      await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'password-reset-confirmation',
          email,
        }),
      });
    } catch (error) {
      console.error('Failed to send password reset confirmation', error);
      // Don't throw, as the password was successfully reset
    }
  }

  return true;
}

// Function to become a seller
export async function becomeSeller() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  // Get the profile to check if user is already a seller
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Profile not found');
  }

  if (profile.role === 'seller') {
    throw new Error('User is already a seller');
  }

  if (profile.role === 'admin') {
    throw new Error('Admin cannot become a seller');
  }

  // Update profile to seller
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      role: 'seller',
      first_login: true, // Force first login to prompt for seller details
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (updateError) {
    throw new Error('Failed to update profile');
  }

  return { success: true, message: 'User is now a seller' };
}
