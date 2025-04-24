import React from 'react';
import { format } from 'date-fns';
import { Message } from '@/lib/types/messaging';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  senderName: string;
  senderAvatar?: string;
}

export function MessageBubble({
  message,
  isCurrentUser,
  senderName,
  senderAvatar,
}: MessageBubbleProps) {
  // Format timestamp
  const timestamp = format(new Date(message.sent_at), 'h:mm a');

  // Get initials for avatar fallback
  const initials = senderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div
      className={cn(
        'flex w-full items-end gap-2 mb-4',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'flex flex-col max-w-[75%]',
          isCurrentUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'px-4 py-2 rounded-lg',
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-muted rounded-bl-none'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <span className="text-xs text-muted-foreground mt-1">
          {timestamp}
          {isCurrentUser && message.read && (
            <span className="ml-1 text-primary">✓</span>
          )}
        </span>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
