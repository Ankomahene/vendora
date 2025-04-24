import React, { useState, KeyboardEvent } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<boolean>;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || disabled || isSending) return;

    setIsSending(true);
    try {
      const success = await onSendMessage(message.trim());
      if (success) {
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t bg-background">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSending}
        className="min-h-[60px] flex-1 resize-none"
      />
      <Button
        type="button"
        onClick={handleSend}
        disabled={!message.trim() || disabled || isSending}
        size="icon"
        className="h-10 w-10 rounded-full shrink-0"
      >
        <PaperPlaneIcon className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  );
}
