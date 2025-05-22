'use client';

import { ConversationResponse } from '@/lib/types/messaging';
import { createContext, useContext, useState } from 'react';

interface MessagingContextType {
  conversations: ConversationResponse[];
  activeConversationId: string | null;
  activeConversation: ConversationResponse | null | undefined;
  unreadMessagesCount: { [key: string]: number };
  setActiveConversationId: (id: string | null) => void;
  setInitialConversations: (conversations: ConversationResponse[]) => void;
  setUnreadMessagesCount: (unreadMessagesCount: {
    [key: string]: number;
  }) => void;
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

  const setInitialConversations = (conversations: ConversationResponse[]) => {
    setConversations(conversations);
  };

  const value = {
    conversations,
    activeConversationId,
    setActiveConversationId,
    setInitialConversations,
    activeConversation: activeConversationId
      ? conversations.find((c) => c.id === activeConversationId)
      : null,
    unreadMessagesCount,
    setUnreadMessagesCount,
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
