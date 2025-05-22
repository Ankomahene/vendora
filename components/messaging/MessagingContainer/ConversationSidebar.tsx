import { MessageSquare } from 'lucide-react';
import { Skeleton } from '../../ui/skeleton';
import { useMessagingContext } from '../MessagingContext';
import { ConversationItem } from './ConversationItem';
import { Badge } from '@/components/ui/badge';

interface ConversationSidebarProps {
  isLoading?: boolean;
  unreadMessagesCount: { [key: string]: number };
}

export function ConversationSidebar({
  isLoading,
  unreadMessagesCount,
}: ConversationSidebarProps) {
  const { conversations, activeConversationId, setActiveConversationId } =
    useMessagingContext();

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  if (isLoading) {
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
        <div key={conversation.id} className="relative">
          <ConversationItem
            conversation={conversation}
            isActive={activeConversationId === conversation.id}
            onClick={() => handleSelectConversation(conversation.id)}
            highlight={unreadMessagesCount[conversation.id] > 0}
          />
          {unreadMessagesCount[conversation.id] && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge
                variant="outline"
                className="text-xs bg-green-500 text-white rounded-full px-2"
              >
                {unreadMessagesCount[conversation.id]}
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
