import { createClient } from '@/lib/supabase/client';
import {
  Conversation,
  Message,
  ConversationWithParticipants,
} from '@/lib/types/messaging';

// Create a new conversation
export async function createConversation(
  buyer_id: string,
  seller_id: string,
  listing_id?: string
): Promise<Conversation | null> {
  const supabase = createClient();

  // Check if conversation already exists for this buyer-seller-listing combo
  const { data: existingConversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('buyer_id', buyer_id)
    .eq('seller_id', seller_id)
    .eq(listing_id ? 'listing_id' : 'is_null', listing_id || true)
    .maybeSingle();

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
      last_message_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating conversation:', error);
    return null;
  }

  return data as Conversation;
}

// Get conversations for a user
export async function getUserConversations(
  userId: string
): Promise<ConversationWithParticipants[]> {
  const supabase = createClient();

  // The issue is in the query structure. PostgREST is looking for FK relationships that don't exist
  // We need to fetch profiles separately and then join them in our code
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(
      `
      *,
      listing:listing_id(id, title, images)
    `
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  if (!conversations || conversations.length === 0) {
    return [];
  }

  // Get all the user IDs we need to fetch (both buyers and sellers)
  const userIds = new Set<string>();
  conversations.forEach((conv) => {
    userIds.add(conv.buyer_id);
    userIds.add(conv.seller_id);
  });

  // Fetch all relevant user profiles in a single query
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, seller_details')
    .in('id', Array.from(userIds));

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return [];
  }

  // Create a lookup map for quick access to profiles
  const profileMap = new Map();
  profiles?.forEach((profile) => {
    profileMap.set(profile.id, profile);
  });

  // Process the data to match our ConversationWithParticipants interface
  return conversations.map((conv) => {
    const buyerProfile = profileMap.get(conv.buyer_id);
    const sellerProfile = profileMap.get(conv.seller_id);

    // Create properly typed buyer object
    const buyer = {
      id: buyerProfile?.id || conv.buyer_id,
      full_name: buyerProfile?.full_name || 'Unknown User',
      avatar_url: buyerProfile?.avatar_url,
    };

    // Create properly typed seller object with business name
    const seller = {
      id: sellerProfile?.id || conv.seller_id,
      full_name: sellerProfile?.full_name || 'Unknown User',
      avatar_url: sellerProfile?.avatar_url,
      business_name: sellerProfile?.seller_details?.business_name,
    };

    // Create properly typed listing object with image
    const listing = conv.listing
      ? {
          id: conv.listing.id,
          title: conv.listing.title,
          image_url: conv.listing.images?.[0],
        }
      : undefined;

    // Return the properly typed conversation
    return {
      ...conv,
      buyer,
      seller,
      listing,
    } as ConversationWithParticipants;
  });
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
    .neq('sender_id', userId);

  if (error) {
    console.error('Error marking messages as read:', error);
    return false;
  }

  return true;
}

// Subscribe to new messages in a conversation
export function subscribeToMessages(
  conversationId: string,
  callback: (message: Message) => void
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
      (payload: { new: Message }) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}

// Subscribe to conversation updates for a user
export function subscribeToConversations(userId: string, callback: () => void) {
  const supabase = createClient();

  // Create a channel for conversation updates
  const subscription = supabase
    .channel(`user-conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for INSERT, UPDATE, and DELETE
        schema: 'public',
        table: 'conversations',
        filter: `buyer_id=eq.${userId},seller_id=eq.${userId}`, // Listen to conversations where the user is a buyer or seller
      },
      () => {
        // When any conversation changes, trigger the callback
        callback();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}
