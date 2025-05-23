import { Listing } from '@/app/dashboard/listings/types';

export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id?: string; // optional context
  last_message_at: string;
  created_at: string;
}

export interface ConversationResponse {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id?: string;
  last_message_at: string;
  created_at: string;
  product: Listing;
  seller: {
    id: string;
    full_name: string;
    avatar_url?: string;
    business_name?: string;
    images?: string[];
  };
  buyer: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string; // buyer or seller user_id
  content: string;
  sent_at: string;
  read: boolean;
  edited?: boolean;
}

export interface ConversationWithParticipants extends Conversation {
  buyer: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  seller: {
    id: string;
    full_name: string;
    avatar_url?: string;
    business_name?: string;
  };
  listing?: {
    id: string;
    title: string;
    image_url?: string;
  };
  last_message?: Message;
}

// Raw nested data types for Supabase queries
export interface SupabaseUser {
  id: string;
  full_name: string;
  avatar_url?: string;
  seller_details?: {
    business_name?: string;
  };
}

export interface SupabaseListing {
  id: string;
  title: string;
  images?: string[];
}

export interface RawConversationData extends Conversation {
  buyer: SupabaseUser;
  seller: SupabaseUser;
  listing?: SupabaseListing;
}
