import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

interface MessagesCountProps {
  userId: string;
}

export function MessagesCount({ userId }: MessagesCountProps) {
  const supabase = createClient();

  const { data: unreadCount = 0, isLoading } = useQuery({
    queryKey: ['unread-messages-count', userId],
    queryFn: async () => {
      // First get the conversation IDs for this user
      const { data: conversationIds, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);

      if (convError || !conversationIds || conversationIds.length === 0) {
        return 0;
      }

      // Then count unread messages in those conversations
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .neq('sender_id', userId)
        .eq('read', false)
        .in(
          'conversation_id',
          conversationIds.map((c) => c.id)
        );

      if (error) {
        console.error('Error fetching unread messages count:', error);
        return 0;
      }

      return count || 0;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) return null;

  return unreadCount > 0 ? (
    <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  ) : null;
}
