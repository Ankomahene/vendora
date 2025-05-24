import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import SellerStatusUpdateEmail from '@/components/emails/SellerStatusUpdateEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userId, status, rejectionReason } = await request.json();

    if (!userId || !status) {
      return NextResponse.json(
        { error: 'User ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be either approved or rejected' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Update seller status in the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({ seller_status: status })
      .eq('id', userId)
      .select('email')
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    if (!profileData?.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      );
    }

    // Generate dashboard URL
    const dashboardUrl = `${new URL(request.url).origin}/dashboard`;

    // Send email notification
    const emailData = await resend.emails.send({
      from: 'sellers@mrshadrack.com',
      to: profileData.email,
      subject:
        status === 'approved'
          ? 'Your seller account has been approved!'
          : 'Update on your seller account application',
      react: SellerStatusUpdateEmail({
        userEmail: profileData.email,
        status,
        dashboardUrl,
        rejectionReason,
      }),
    });

    return NextResponse.json({
      data: {
        message: `Seller status updated to ${status}`,
        email: emailData,
      },
    });
  } catch (error) {
    console.error('Error updating seller status:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
