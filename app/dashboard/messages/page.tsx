import React from 'react';
import { MessagesClient } from './client';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conversation?: string }>;
}) {
  // Get active conversation ID from URL if present
  const { conversation } = await searchParams;

  // Get the current user from supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?redirect=/messages');
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Redirect if profile not found
  if (!userProfile) {
    redirect('/auth/login?redirect=/messages');
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessagesClient
        userId={userProfile.id}
        initialConversationId={conversation}
      />
    </div>
  );
}
