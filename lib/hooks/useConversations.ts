import { useState, useEffect, useCallback } from 'react';
import { ConversationWithParticipants } from '../types/messaging';
import { getUserConversations, subscribeToConversations } from '../messaging';

export function useConversations(userId: string) {
  const [conversations, setConversations] = useState<
    ConversationWithParticipants[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations function
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const data = await getUserConversations(userId);
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initialize and set up realtime subscription
  useEffect(() => {
    // Fetch conversations initially
    fetchConversations();

    // Set up Supabase realtime subscription for conversations
    const unsubscribe = subscribeToConversations(userId, () => {
      // When a conversation is updated, refetch all conversations
      // We don't set loading state here to avoid UI flicker
      getUserConversations(userId)
        .then((data) => {
          setConversations(data);
        })
        .catch((err) => {
          console.error('Error refreshing conversations:', err);
        });
    });

    // Clean up subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, [userId, fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    refreshConversations: fetchConversations,
  };
}
