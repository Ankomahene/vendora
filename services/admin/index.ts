import { createClient } from '@/lib/supabase/client';

// Update seller status (approve/reject)
export async function updateSellerStatus(
  userId: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  const supabase = createClient();

  // Check if user is admin
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  const { data: adminProfile, error: adminError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (adminError || !adminProfile || adminProfile.role !== 'admin') {
    throw new Error('Only admins can perform this action');
  }

  // Update seller status
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      seller_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (updateError) {
    console.error('Error updating seller status:', updateError);
    return false;
  }

  // TODO: Send email notification to seller using the email API

  return true;
}
