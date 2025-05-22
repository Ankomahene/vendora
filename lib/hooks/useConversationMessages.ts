import {
  getConversationMessages,
  markMessagesAsRead,
  sendMessage as sendMessageApi,
  subscribeToConversationMessages,
} from '@/lib/messaging';
import { Message } from '@/lib/types/messaging';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useProfileServices } from './useProfileServices';

interface UseConversationMessagesProps {
  conversationId?: string;
}

export function useConversationMessages({
  conversationId,
}: UseConversationMessagesProps) {
  const queryClient = useQueryClient();
  const { user } = useProfileServices();

  // Query for fetching messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getConversationMessages(conversationId!),
    enabled: !!conversationId,
  });

  // // Mutation for sending messages
  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId || !user?.id || !content.trim()) {
        return false;
      }
      const message = await sendMessageApi(conversationId, user.id, content);
      return !!message;
    },
    onSuccess: () => {
      // Invalidate and refetch messages after sending
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });

  // Mutation for marking messages as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: () => {
      if (!conversationId || !user?.id) {
        return Promise.resolve();
      }
      return markMessagesAsRead(conversationId, user?.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
  });

  // Effect for real-time updates subscription
  useEffect(() => {
    if (!conversationId || !user?.id) return;

    // Subscribe to new messages
    const unsubscribe = subscribeToConversationMessages(
      conversationId,
      async (newMessage) => {
        queryClient.setQueryData(
          ['messages', conversationId],
          (oldData: Message[] = []) => {
            // Check if message exists already to avoid duplicates
            const messageExists = oldData.some(
              (msg) => msg.id === newMessage.id
            );
            if (messageExists) {
              return oldData.map((msg) =>
                msg.id === newMessage.id ? newMessage : msg
              );
            }
            return [...oldData, newMessage];
          }
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, user?.id, queryClient]);

  useEffect(() => {
    if (!conversationId || !user?.id) return;
    markAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user?.id]);

  return {
    messages: messages ?? [],
    sendMessage,
    isSending,
    isLoading,
  };
}
