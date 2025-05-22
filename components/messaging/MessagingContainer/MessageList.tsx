import { useProfileServices } from '@/lib/hooks';
import { MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Skeleton } from '../../ui/skeleton';
import { MessageBubble } from '../MessageBubble';
import { useMessagingContext } from '../MessagingContext';
import { useConversationMessages } from '@/lib/hooks';
import { Message } from '@/lib/types/messaging';

export function MessageList() {
  const { activeConversation, activeConversationId, setMessageToEdit } =
    useMessagingContext();
  const { user } = useProfileServices();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading } = useConversationMessages({
    conversationId: activeConversationId ?? undefined,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      // Scroll to bottom of messages
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleEdit = (message: Message) => {
    setMessageToEdit(message);
  };

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

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`flex gap-2 ${
              index % 2 === 0 ? 'justify-start' : 'justify-end'
            }`}
          >
            {index % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
            <div
              className={`space-y-1 ${
                index % 2 === 0 ? 'items-start' : 'items-end'
              }`}
            >
              <Skeleton
                className={`h-16 rounded-lg ${
                  index % 2 === 0 ? 'w-48' : 'w-64'
                }`}
              />
              <Skeleton className="h-3 w-12" />
            </div>
            {index % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
          </div>
        ))}
      </div>
    );
  }

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

  const otherUser =
    user?.id === activeConversation.buyer_id
      ? activeConversation.seller
      : activeConversation.buyer;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === user?.id;
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            senderName={isCurrentUser ? 'You' : otherUser.full_name}
            senderAvatar={isCurrentUser ? undefined : otherUser.avatar_url}
            onEdit={handleEdit}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
