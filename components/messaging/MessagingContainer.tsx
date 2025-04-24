import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '@/lib/hooks/useMessages';
import { useConversations } from '@/lib/hooks/useConversations';
import { ConversationWithParticipants } from '@/lib/types/messaging';
import { ConversationItem } from './ConversationItem';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Sheet, SheetContent } from '../ui/sheet';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, MessageSquare } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface MessagingContainerProps {
  userId: string;
  initialConversationId?: string;
  maxHeight?: string;
  className?: string;
  mobileSidebar?: boolean;
  onConversationChange?: (conversationId: string | null) => void;
}

export function MessagingContainer({
  userId,
  initialConversationId,
  maxHeight = '100vh',
  className,
  mobileSidebar = true,
  onConversationChange,
}: MessagingContainerProps) {
  // State for active conversation
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(initialConversationId || null);

  // State for mobile sidebar visibility
  const [showSidebar, setShowSidebar] = useState(!mobileSidebar);

  // Get conversations
  const { conversations, isLoading: isLoadingConversations } =
    useConversations(userId);

  // Get active conversation
  const activeConversation = activeConversationId
    ? conversations.find((c) => c.id === activeConversationId)
    : null;

  // Get messages for active conversation
  const {
    messages,
    isLoading: isLoadingMessages,
    sendMessage,
  } = useMessages(activeConversationId || '', userId);

  // Add a new effect to handle conversation changes without causing re-renders
  useEffect(() => {
    if (activeConversationId && activeConversation) {
      // We already have the active conversation, no need to do anything
      return;
    }

    // Only try to set active conversation when we have conversations loaded
    if (!isLoadingConversations && conversations.length > 0) {
      // If we have an initialConversationId, try to find that conversation
      if (initialConversationId) {
        const foundConversation = conversations.find(
          (c) => c.id === initialConversationId
        );
        if (foundConversation) {
          setActiveConversationId(initialConversationId);
          return;
        }
      }

      // If no initialConversationId or it wasn't found, use the first conversation
      if (!activeConversationId) {
        setActiveConversationId(conversations[0].id);
      }
    }
  }, [
    activeConversationId,
    activeConversation,
    conversations,
    initialConversationId,
    isLoadingConversations,
  ]);

  // Scroll to bottom of messages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle selecting a conversation
  const handleSelectConversation = (
    conversation: ConversationWithParticipants
  ) => {
    setActiveConversationId(conversation.id);
    if (mobileSidebar) {
      setShowSidebar(false);
    }
    // Call the onConversationChange callback if provided
    if (onConversationChange) {
      onConversationChange(conversation.id);
    }
  };

  // Determine who is the other participant
  const getOtherParticipant = (conversation: ConversationWithParticipants) => {
    const isBuyer = userId === conversation.buyer_id;
    return isBuyer ? conversation.seller : conversation.buyer;
  };

  // Render messages
  const renderMessages = () => {
    if (!activeConversation) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No conversation selected</h3>
          <p className="text-sm mt-2">
            Select a conversation from the list to view messages
          </p>
        </div>
      );
    }

    // Show loading state only on initial load, not during background refreshes
    if (isLoadingMessages && messages.length === 0) {
      return (
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-2',
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              )}
            >
              {index % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
              <div
                className={cn(
                  'space-y-1',
                  index % 2 === 0 ? 'items-start' : 'items-end'
                )}
              >
                <Skeleton
                  className={cn(
                    'h-16 rounded-lg',
                    index % 2 === 0 ? 'w-48' : 'w-64'
                  )}
                />
                <Skeleton className="h-3 w-12" />
              </div>
              {index % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
            </div>
          ))}
        </div>
      );
    }

    // If we have loaded but there are no messages
    if (messages.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No messages yet</h3>
          <p className="text-sm mt-2">
            Start the conversation by sending a message
          </p>
        </div>
      );
    }

    const otherUser = getOtherParticipant(activeConversation);

    return (
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === userId;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={isCurrentUser}
              senderName={isCurrentUser ? 'You' : otherUser.full_name}
              senderAvatar={isCurrentUser ? undefined : otherUser.avatar_url}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  // Render conversation header
  const renderConversationHeader = () => {
    if (!activeConversation) return null;

    const otherUser = getOtherParticipant(activeConversation);

    // Type assertions for safer access
    let displayName = otherUser.full_name;

    // Only sellers have business_name property
    if (
      userId === activeConversation.buyer_id &&
      'business_name' in otherUser &&
      typeof otherUser.business_name === 'string'
    ) {
      displayName = otherUser.business_name;
    }

    const initials = otherUser.full_name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    return (
      <div className="p-3 border-b flex items-center gap-3">
        {mobileSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(true)}
            className="md:hidden"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
        )}

        <Avatar>
          <AvatarImage src={otherUser.avatar_url} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{displayName}</h3>

          {activeConversation.listing && (
            <p className="text-xs text-muted-foreground truncate">
              re: {activeConversation.listing.title}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render sidebar content
  const renderSidebar = () => {
    if (isLoadingConversations) {
      return (
        <div className="p-3 space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (conversations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-medium">No conversations yet</h3>
          <p className="text-sm mt-2">Your messages will appear here</p>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            currentUserId={userId}
            isActive={activeConversationId === conversation.id}
            onClick={() => handleSelectConversation(conversation)}
          />
        ))}
      </div>
    );
  };

  // Mobile sidebar with sheet component
  const mobileSidebarContent = mobileSidebar && (
    <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
      <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px]">
        <div className="p-3 border-b">
          <h2 className="font-semibold">Conversations</h2>
        </div>
        {renderSidebar()}
      </SheetContent>
    </Sheet>
  );

  return (
    <div
      className={cn(
        'flex bg-background border rounded-lg overflow-hidden',
        className
      )}
      style={{ maxHeight }}
    >
      {/* Desktop sidebar always visible */}
      {!mobileSidebar && (
        <div className="w-[300px] border-r hidden md:block">
          <div className="p-3 border-b">
            <h2 className="font-semibold">Conversations</h2>
          </div>
          {renderSidebar()}
        </div>
      )}

      {/* Mobile sidebar as sheet */}
      {mobileSidebarContent}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {renderConversationHeader()}

        {renderMessages()}

        <MessageInput
          onSendMessage={sendMessage}
          disabled={!activeConversationId || isLoadingMessages}
        />
      </div>
    </div>
  );
}
