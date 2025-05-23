'use client';

import { ConversationResponse, Message } from '@/lib/types/messaging';
import { createContext, useContext, useState } from 'react';

interface MessagingContextType {
  conversations: ConversationResponse[];
  activeConversationId: string | null;
  activeConversation: ConversationResponse | null | undefined;
  unreadMessagesCount: { [key: string]: number };
  messageToEdit: Message | null;
  setActiveConversationId: (id: string | null) => void;
  setInitialConversations: (conversations: ConversationResponse[]) => void;
  addNewConversation: (conversation: ConversationResponse) => void;
  setUnreadMessagesCount: (unreadMessagesCount: {
    [key: string]: number;
  }) => void;
  moveConversationToTop: (conversationId: string) => void;
  setMessageToEdit: (message: Message | null) => void;
}

export const MessagingContext = createContext<MessagingContextType | null>(
  null
);

export const MessagingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    []
  );

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<{
    [key: string]: number;
  }>({});
  const [messageToEdit, setMessageToEdit] = useState<Message | null>(null);

  const setInitialConversations = (conversations: ConversationResponse[]) => {
    setConversations(conversations);
  };

  const moveConversationToTop = (conversationId: string) => {
    setConversations((prevConversations) => {
      const conversation = prevConversations.find(
        (c) => c.id === conversationId
      );
      if (!conversation) return prevConversations;

      return [
        conversation,
        ...prevConversations.filter((c) => c.id !== conversationId),
      ];
    });
  };

  const addNewConversation = (conversation: ConversationResponse) => {
    setConversations((prevConversations) => [
      conversation,
      ...prevConversations,
    ]);
  };

  const activeConversation =
    activeConversationId && conversations.length > 0
      ? conversations.find((c) => c.id === activeConversationId)
      : null;

  const value = {
    conversations,
    activeConversationId,
    setActiveConversationId,
    setInitialConversations,
    activeConversation,
    unreadMessagesCount,
    setUnreadMessagesCount,
    moveConversationToTop,
    messageToEdit,
    setMessageToEdit,
    addNewConversation,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessagingContext = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error(
      'useMessagingContext must be used within a MessagingProvider'
    );
  }
  return context;
};
