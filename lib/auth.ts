import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function adminProtect() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?next=/admin');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_admin) {
    redirect('/dashboard');
  }

  return profile;
}
