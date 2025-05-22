'use client';

import { ConversationResponse } from '@/lib/types/messaging';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MessageInput } from './MessageInput';
import { useMessagingContext } from '../MessagingContext';
import { ConversationHeader } from './ConversationHeader';
import { ConversationSidebar } from './ConversationSidebar';
import { MessageList } from './MessageList';
import { MobileSideBar } from './MobileSideBar';
import {
  getUserUnreadMessagesCount,
  subscribeToMultipleConversationsMessages,
  subscribeToUserConversations,
} from '@/lib/messaging';
interface MessagingWindowProps {
  conversations: ConversationResponse[];
  currentUserId: string;
  className?: string;
  maxHeight?: string;
}

export function MessagingContainer({
  conversations,
  currentUserId,
  className,
  maxHeight = '85vh',
}: MessagingWindowProps) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const {
    activeConversationId,
    unreadMessagesCount,
    messageToEdit,
    setInitialConversations,
    setUnreadMessagesCount,
    moveConversationToTop,
    setMessageToEdit,
  } = useMessagingContext();
  //
  useEffect(() => {
    setInitialConversations(conversations);

    const fetchIntialUnreadMessagesCount = async () => {
      const intialUnreadMessagesCountMap = await getUserUnreadMessagesCount(
        conversations.map((conversation) => conversation.id),
        currentUserId
      );

      setUnreadMessagesCount(intialUnreadMessagesCountMap);
    };

    fetchIntialUnreadMessagesCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  useEffect(() => {
    const unsubscribe = subscribeToUserConversations(
      currentUserId,
      (conversation) => {
        moveConversationToTop(conversation.id);
      }
    );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  useEffect(() => {
    const unsubscribe = subscribeToMultipleConversationsMessages(
      conversations.map((conversation) => conversation.id),
      async () => {
        const unreadMessagesCountMap = await getUserUnreadMessagesCount(
          conversations.map((conversation) => conversation.id),
          currentUserId
        );
        setUnreadMessagesCount(unreadMessagesCountMap);
      }
    );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  return (
    <div
      className={cn(
        'flex bg-background border rounded-lg overflow-hidden min-h-[60vh]',
        className
      )}
      style={{ maxHeight }}
    >
      {/* Desktop sidebar */}
      <div className="w-[300px] border-r hidden md:block">
        <ConversationSidebar unreadMessagesCount={unreadMessagesCount} />
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <MobileSideBar
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
          unreadMessagesCount={unreadMessagesCount}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeConversationId && (
          <ConversationHeader
            mobileSidebar
            setShowSidebar={setShowMobileSidebar}
          />
        )}

        <MessageList />

        {activeConversationId && (
          <MessageInput
            conversationId={activeConversationId}
            messageToEdit={messageToEdit}
            setMessageToEdit={setMessageToEdit}
          />
        )}
      </div>
    </div>
  );
}
