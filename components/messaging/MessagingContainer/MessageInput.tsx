import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useConversationMessages } from '@/lib/hooks';
import { Message } from '@/lib/types/messaging';
import { updateMessage } from '@/lib/messaging';

export function MessageInput({
  conversationId,
  messageToEdit,
  setMessageToEdit,
}: {
  conversationId: string;
  messageToEdit: Message | null;
  setMessageToEdit: (message: Message | null) => void;
}) {
  const [message, setMessage] = useState('');
  const { sendMessage, isSending, markAsRead } = useConversationMessages({
    conversationId,
  });

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    try {
      if (messageToEdit) {
        await updateMessage(messageToEdit.id, message.trim());
        setMessageToEdit(null);
      } else {
        await sendMessage(message.trim());
        await markAsRead();
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (messageToEdit) {
      setMessage(messageToEdit.content);
    }
  }, [messageToEdit]);

  return (
    <div className="flex items-end gap-2 p-3 border-t bg-background">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={isSending || !conversationId}
        className="min-h-[60px] flex-1 resize-none"
      />
      <Button
        type="button"
        onClick={handleSend}
        disabled={!message.trim() || isSending || !conversationId}
        size="icon"
        className="h-10 w-10 rounded-full shrink-0"
      >
        <PaperPlaneIcon className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
