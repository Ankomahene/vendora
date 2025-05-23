import { MessagingContainer } from '@/components/messaging/MessagingContainer';
import { MessagingProvider } from '@/components/messaging/MessagingContext';
import { createClient } from '@/lib/supabase/server';
import { ConversationResponse } from '@/lib/types/messaging';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  // Get the current user from supabase
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login?redirect=/messages');
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select(
      `*,
        product:listing_id(title, price, images), 
        seller:seller_id(id, full_name, avatar_url, seller_details->business_name, seller_details->images), 
        buyer:buyer_id(id, full_name, avatar_url)
      `
    )
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })
    .overrideTypes<ConversationResponse[], { merge: false }>();

  return (
    <div className="container py-2">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      <MessagingProvider>
        <MessagingContainer
          conversations={conversations || []}
          currentUserId={user.id}
          maxHeight="calc(100vh - 160px)"
        />
      </MessagingProvider>
    </div>
  );
}
