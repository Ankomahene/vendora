import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ConversationWithParticipants } from '@/lib/types/messaging';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: ConversationWithParticipants;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  currentUserId,
  isActive,
  onClick,
}: ConversationItemProps) {
  // Determine if current user is buyer or seller
  const isBuyer = currentUserId === conversation.buyer_id;

  // Get the other participant's info
  const otherUser = isBuyer ? conversation.seller : conversation.buyer;

  // Type assertions for safer access
  let displayName = otherUser.full_name;

  // Only sellers have business_name property
  if (
    isBuyer &&
    'business_name' in otherUser &&
    typeof otherUser.business_name === 'string'
  ) {
    displayName = otherUser.business_name;
  }

  // Get avatar
  const avatar = otherUser.avatar_url;

  // Get initials for avatar fallback
  const initials = otherUser.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Format last message time
  const lastMessageTime = formatDistanceToNow(
    new Date(conversation.last_message_at),
    {
      addSuffix: true,
    }
  );

  // Extract last message preview if available
  const lastMessagePreview =
    conversation.last_message?.content || 'No messages yet';

  // Check if unread
  const hasUnreadMessage =
    conversation.last_message &&
    conversation.last_message.sender_id !== currentUserId &&
    !conversation.last_message.read;

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
        isActive && 'bg-muted',
        hasUnreadMessage && 'font-medium'
      )}
      onClick={onClick}
    >
      <Avatar>
        <AvatarImage src={avatar} alt={displayName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-sm truncate">{displayName}</h4>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {lastMessageTime}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p
            className={cn(
              'text-sm text-muted-foreground truncate',
              hasUnreadMessage && 'text-foreground font-medium'
            )}
          >
            {lastMessagePreview}
          </p>

          {hasUnreadMessage && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0 ml-2"></span>
          )}
        </div>

        {conversation.listing && (
          <div className="text-xs text-muted-foreground truncate mt-1">
            re: {conversation.listing.title}
          </div>
        )}
      </div>
    </div>
  );
}
