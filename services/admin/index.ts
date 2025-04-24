import { createClient } from '@/lib/supabase/client';

/**
 * Updates the seller status (approved or rejected) for a user
 * Only admin users can perform this action
 */
export async function updateSellerStatus({
  userId,
  status,
  rejectionReason,
}: {
  userId: string;
  status: 'approved' | 'rejected';
  rejectionReason?: string;
}) {
  try {
    // Only allow admin users to update seller status
    const supabase = createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      throw new Error('Authentication required');
    }

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', sessionData.session.user.id)
      .single();

    if (userError || !userData) {
      throw new Error('Failed to get user profile');
    }

    if (userData.role !== 'admin') {
      throw new Error('Only admin users can update seller status');
    }

    // Call the API to update seller status and send email
    const response = await fetch('/api/admin/update-seller-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        status,
        rejectionReason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update seller status');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating seller status:', error);
    throw error;
  }
}
