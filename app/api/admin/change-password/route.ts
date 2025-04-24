import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  console.log('Password change API route called');

  try {
    const body = await request.json();
    console.log('Request body received');

    // Validate request body
    const result = passwordChangeSchema.safeParse(body);
    if (!result.success) {
      console.error('Validation error:', result.error.flatten().fieldErrors);
      return NextResponse.json(
        { error: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = result.data;
    console.log('Request validated successfully');

    // Get current user
    const supabase = await createClient();
    console.log('Supabase client created');

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Auth error or no user found:', userError);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    console.log('User authenticated');

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      );
    }

    if (!profile || !profile.is_admin) {
      console.error('User is not an admin:', { profile });
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    console.log('Admin privileges verified');

    // Get user's email for sign-in
    const { data: userData, error: userDataError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (userDataError || !userData?.email) {
      console.error('Error fetching user email:', userDataError);
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      );
    }
    console.log('User email retrieved');

    // Verify current password by signing in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: currentPassword,
    });

    if (signInError) {
      console.error(
        'Sign in error (current password verification):',
        signInError
      );
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    console.log('Current password verified');

    // Check if admin client can be created
    try {
      // Use admin client to update password
      const adminClient = createAdminClient();
      console.log('Admin client created');

      const { error: updateError } =
        await adminClient.auth.admin.updateUserById(user.id, {
          password: newPassword,
        });

      if (updateError) {
        console.error('Password update error:', updateError);
        return NextResponse.json(
          { error: 'Failed to update password' },
          { status: 500 }
        );
      }

      console.log('Password updated successfully');
      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (adminError) {
      console.error('Admin client error:', adminError);
      return NextResponse.json(
        { error: 'Admin client error - check SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in password change API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: String(error) },
      { status: 500 }
    );
  }
}
