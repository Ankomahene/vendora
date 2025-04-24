import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL environment variable is missing');
    throw new Error('Supabase URL is required');
  }

  if (!supabaseServiceRoleKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is missing');
    throw new Error('Supabase service role key is required');
  }

  try {
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (error) {
    console.error('Error creating admin Supabase client:', error);
    throw error;
  }
}
