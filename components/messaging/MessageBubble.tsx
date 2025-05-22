import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { deleteMessage } from '@/lib/messaging';
import { Message } from '@/lib/types/messaging';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  senderName: string;
  senderAvatar?: string;
  onEdit: (message: Message) => void;
}

export function MessageBubble({
  message,
  isCurrentUser,
  senderName,
  senderAvatar,
  onEdit,
}: MessageBubbleProps) {
  const queryClient = useQueryClient();

  // Format timestamp
  const timestamp = format(new Date(message.sent_at), 'h:mm a');

  // Get initials for avatar fallback
  const initials = senderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const handleDelete = async () => {
    try {
      await deleteMessage(message.id);
      queryClient.invalidateQueries({
        queryKey: ['messages', message.conversation_id],
      });
      toast.success('Message deleted');
    } catch (error: unknown) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message. Please try again.');
    }
  };

  const handleEdit = () => {
    onEdit(message);
  };

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

      <ContextMenu>
        <ContextMenuTrigger asChild>
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
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            <span className="text-xs text-muted-foreground mt-1">
              {timestamp}
              {message.edited && (
                <span className="ml-1 text-xs text-muted-foreground opacity-75">
                  · edited
                </span>
              )}
              {isCurrentUser && message.read && (
                <span className="ml-1 text-primary">✓</span>
              )}
            </span>
          </div>
        </ContextMenuTrigger>
        {isCurrentUser && (
          <ContextMenuContent>
            <ContextMenuItem
              className="focus:bg-primary/10"
              onClick={() => handleEdit()}
            >
              Edit Message
            </ContextMenuItem>
            <ContextMenuItem
              className="text-destructive focus:text-destructive focus:bg-primary/10"
              onClick={handleDelete}
            >
              Delete Message
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>

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
