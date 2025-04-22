import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '@/lib/types';

// Function to get seller profile
export async function getSellerProfile(
  userId?: string
): Promise<UserProfile | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const targetUserId = userId || user.id;

  // Get the profile with seller details
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single();

  if (profileError || !profile || profile.role !== 'seller') {
    return null;
  }

  return profile as UserProfile;
}

// Function to get all sellers
export async function getAllSellers(status?: string): Promise<UserProfile[]> {
  const supabase = createClient();

  let query = supabase.from('profiles').select('*').eq('role', 'seller');

  if (status) {
    query = query.eq('seller_status', status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data as UserProfile[];
}
