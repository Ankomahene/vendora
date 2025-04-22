import { createClient } from '@/lib/supabase/client';
import { DashboardStats, UserProfile } from '@/lib/types';

// Function to get current user profile
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return profile as UserProfile;
}

// Function to update user profile
export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return updatedProfile as UserProfile;
}

// Function to get dashboard stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      totalListings: 0,
      totalViews: 0,
      totalMessages: 0,
      pendingReviews: 0,
    };
  }

  // This is a placeholder. In a real implementation, you would count actual listings, views, etc.

  return {
    totalListings: 5,
    totalViews: 120,
    totalMessages: 8,
    pendingReviews: 2,
  };
}
