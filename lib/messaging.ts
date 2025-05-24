import { createClient } from '@/lib/supabase/client';
import {
  Conversation,
  Message,
  ConversationWithParticipants,
  ConversationResponse,
} from '@/lib/types/messaging';
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';

// Create a new conversation
export async function createConversation(
  buyer_id: string,
  seller_id: string,
  listing_id?: string
): Promise<Conversation | null> {
  const supabase = createClient();

  // Check if conversation already exists for this buyer-seller-listing combo
  let query = supabase
    .from('conversations')
    .select('*')
    .eq('buyer_id', buyer_id)
    .eq('seller_id', seller_id);

  if (listing_id) {
    query = query.eq('listing_id', listing_id);
  }

  const { data: existingConversation, error: existingConversationError } =
    await query.maybeSingle();

  if (existingConversationError) {
    console.error(
      'Error fetching existing conversation:',
      existingConversationError
    );
    return null;
  }

  if (existingConversation) {
    return existingConversation as Conversation;
  }

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      buyer_id,
      seller_id,
      listing_id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return data as Conversation;
}

// Get all user conversations
export async function getAllUserConversations(
  userId: string
): Promise<ConversationResponse[]> {
  const supabase = createClient();

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(
      `*,
        product:listing_id(title, price, images), 
        messages(*), 
        seller:seller_id(full_name, avatar_url), 
        buyer:buyer_id(full_name, avatar_url)
      `
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('last_message_at', { ascending: false })
    .overrideTypes<ConversationResponse[], { merge: false }>();

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  if (!conversations || conversations.length === 0) {
    return [];
  }

  return conversations;
}

// Get a specific conversation by ID
export async function getConversationById(
  conversationId: string
): Promise<ConversationWithParticipants | null> {
  const supabase = createClient();

  // Fetch conversation with listing, but without profiles
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select(
      `
      *,
      listing:listing_id(id, title, images)
    `
    )
    .eq('id', conversationId)
    .single();

  if (error) {
    console.error('Error fetching conversation:', error);
    return null;
  }

  // Fetch both buyer and seller profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, seller_details')
    .in('id', [conversation.buyer_id, conversation.seller_id]);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return null;
  }

  // Find the buyer and seller profiles
  const buyerProfile = profiles?.find((p) => p.id === conversation.buyer_id);
  const sellerProfile = profiles?.find((p) => p.id === conversation.seller_id);

  // Create properly typed buyer object
  const buyer = {
    id: buyerProfile?.id || conversation.buyer_id,
    full_name: buyerProfile?.full_name || 'Unknown User',
    avatar_url: buyerProfile?.avatar_url,
  };

  // Create properly typed seller object with business name
  const seller = {
    id: sellerProfile?.id || conversation.seller_id,
    full_name: sellerProfile?.full_name || 'Unknown User',
    avatar_url: sellerProfile?.avatar_url,
    business_name: sellerProfile?.seller_details?.business_name,
  };

  // Create properly typed listing object with image
  const listing = conversation.listing
    ? {
        id: conversation.listing.id,
        title: conversation.listing.title,
        image_url: conversation.listing.images?.[0],
      }
    : undefined;

  // Return the properly typed conversation
  return {
    ...conversation,
    buyer,
    seller,
    listing,
  } as ConversationWithParticipants;
}

// Get messages for a conversation
export async function getConversationMessages(conversationId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data as Message[];
}

interface UnreadMessageCount {
  conversation_id: string;
  count: number;
}

export async function getUserUnreadMessagesCount(
  conversationIds: string[],
  currentUserId: string
): Promise<{ [key: string]: number }> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_unread_message_counts', {
    conversation_ids: conversationIds,
    current_user_id: currentUserId,
  });

  if (error) {
    console.error('Error fetching unread message counts:', error);
    return {};
  }

  const unreadMessagesCountMap: { [key: string]: number } = data.reduce(
    (acc: { [key: string]: number }, curr: UnreadMessageCount) => ({
      ...acc,
      [curr.conversation_id]: curr.count,
    }),
    {}
  );

  return unreadMessagesCountMap;
}

// Send a new message
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message | null> {
  const supabase = createClient();

  // Begin a transaction
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      sent_at: new Date().toISOString(),
      read: false,
    })
    .select()
    .single();

  if (messageError) {
    console.error('Error sending message:', messageError);
    return null;
  }

  // Update the conversation's last_message_at timestamp
  const { error: updateError } = await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  if (updateError) {
    console.error('Error updating conversation timestamp:', updateError);
  }

  return message as Message;
}

// Mark messages as read
export async function markMessagesAsRead(
  conversationId: string,
  userId: string
) {
  const supabase = createClient();

  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);

  if (error) {
    console.error('Error marking messages as read:', error);
    throw new Error('Error marking messages as read');
  }
}

export async function deleteMessage(messageId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) {
    console.error('Error deleting message:', error);
    throw new Error('Error deleting message');
  }
}

export async function updateMessage(messageId: string, content: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('messages')
    .update({ content, edited: true })
    .eq('id', messageId);

  if (error) {
    console.error('Error updating message:', error);
    throw new Error('Error updating message');
  }
}
// Subscribe to new messages in a conversation
export function subscribeToConversationMessages(
  conversationId: string,
  callback: (
    eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    message: Message
  ) => void
) {
  const supabase = createClient();

  const subscription = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) =>
        callback(
          payload.eventType as REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
          payload.new as Message
        )
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) =>
        callback(
          payload.eventType as REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
          payload.new as Message
        )
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'messages',
      },
      (payload) =>
        callback(
          payload.eventType as REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
          payload.old as Message
        )
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

export function subscribeToMultipleConversationsMessages(
  conversationIds: string[],
  callback: (message: Message) => void
) {
  const supabase = createClient();

  const subscription = supabase
    .channel(`messages:${conversationIds.join('-')}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=in.(${conversationIds.join(',')})`,
      },
      (payload) => callback(payload.new as Message)
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=in.(${conversationIds.join(',')})`,
      },
      (payload) => callback(payload.new as Message)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

// Subscribe to conversation updates for a user
export function subscribeToUserConversations(
  userId: string,
  callback: (
    eventType: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    conversation: Conversation
  ) => void
) {
  const supabase = createClient();

  // Create a channel for conversation updates
  const subscription = supabase
    .channel(`user-conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        // filter: `or(buyer_id=eq.${userId},seller_id=eq.${userId})`, // Listen to conversations where the user is a buyer or seller
      },
      (payload) =>
        callback(
          payload.eventType as REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
          payload.new as Conversation
        )
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversations',
        // filter: `or(buyer_id=eq.${userId},seller_id=eq.${userId})`, // Listen to conversations where the user is a buyer or seller
      },
      (payload) =>
        callback(
          payload.eventType as REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
          payload.new as Conversation
        )
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}
