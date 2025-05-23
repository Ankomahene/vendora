'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile, getDashboardStats } from '@/services/profile';
import { UserProfile } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

// Function to fetch the current authenticated user
async function fetchCurrentUser() {
  const supabase = createClient();

  // First get the authenticated user from Supabase Auth
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  // Then fetch the user profile with additional data from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return profile as UserProfile;
}

export function useProfileServices() {
  const queryClient = useQueryClient();

  // Set up subscription for real-time auth state changes
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // Invalidate and refetch user data when auth state changes
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  // Get current user data directly
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
    isRefetching: isRefetchingUser,
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<UserProfile>;
    }) => updateUserProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['currentUser'],
      });
    },
  });

  // Get dashboard stats query
  const useDashboardStats = () =>
    useQuery({
      queryKey: ['dashboardStats'],
      queryFn: () => getDashboardStats(),
    });

  return {
    // Current user data and state
    user: user || null,
    isLoading: isUserLoading,
    error: userError,
    isAuthenticated: !!user,
    refetchUser,
    isRefetchingUser,

    updateProfile: updateProfileMutation,

    useDashboardStats,
  };
}
