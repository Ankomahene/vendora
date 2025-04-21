import {
  LoginFormValues,
  OtpFormValues,
  ResetPasswordFormValues,
  SignupFormValues,
} from './auth-schema';
import { createClient } from './supabase/client';
import {
  clearSessionData,
  getSessionData,
  storeSessionData,
} from './sessionStorage';

export type Role = 'buyer' | 'seller' | 'admin';
export type SellerStatus = 'pending' | 'approved' | 'rejected';

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: Role;
  seller_status?: SellerStatus;
  is_admin: boolean;
  first_login: boolean;
  created_at: string;
  updated_at: string;
};

// Function to sign up user
export async function signUpUser(data: SignupFormValues) {
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
    throw new Error(result.error || 'Failed to send verification email');
  }

  // Store email and role in session storage
  storeSessionData({
    email: data.email,
    role: data.role,
    full_name: data.full_name,
  });

  return result;
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

// Function to get current user profile
export async function getUserProfile() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return null;
  }

  return profile as UserProfile;
}

// Function to update user profile
export async function updateUserProfile(
  id: string,
  data: Partial<UserProfile>
) {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return profile as UserProfile;
}
