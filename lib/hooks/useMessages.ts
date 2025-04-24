import { useState, useEffect, useCallback } from 'react';
import { Message } from '../types/messaging';
import {
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
} from '../messaging';

export function useMessages(conversationId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedMessages = await getConversationMessages(conversationId);
      setMessages(fetchedMessages);

      // Mark messages as read
      await markMessagesAsRead(conversationId, userId);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, userId]);

  // Send a new message
  const sendNewMessage = useCallback(
    async (content: string) => {
      if (!conversationId) return false;

      try {
        const newMessage = await sendMessage(conversationId, userId, content);
        return !!newMessage;
      } catch (err) {
        setError('Failed to send message');
        console.error(err);
        return false;
      }
    },
    [conversationId, userId]
  );

  // Reset state when conversation changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    // Reset loading state
    setIsLoading(true);

    // Fetch messages for this conversation
    fetchMessages();

    // Set up real-time subscription for new messages
    const unsubscribe = subscribeToMessages(conversationId, (newMessage) => {
      setMessages((prevMessages) => {
        // Avoid duplicate messages
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          return prevMessages;
        }

        // Mark messages as read if they're from the other user
        if (newMessage.sender_id !== userId) {
          markMessagesAsRead(conversationId, userId).catch(console.error);
        }

        return [...prevMessages, newMessage];
      });
    });

    // Clean up subscription
    return unsubscribe;
  }, [conversationId, userId, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendNewMessage,
    refreshMessages: fetchMessages,
  };
}
