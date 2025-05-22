import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { MessageSquare, Send, X } from 'lucide-react';
import {
  createConversation,
  getConversationMessages,
  sendMessage,
  subscribeToConversationMessages,
} from '@/lib/messaging';
import { cn } from '@/lib/utils';
import { Message } from '@/lib/types/messaging';
import { MessageBubble } from './MessageBubble';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import Image from 'next/image';
import { CURRENCY } from '@/lib/constants';
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';

interface ContactSellerButtonProps {
  buyerId: string;
  sellerId: string;
  listingId?: string;
  sellerName: string;
  sellerAvatar?: string;
  buyerName: string;
  buyerAvatar?: string;
  listingImage?: string;
  listingName?: string;
  listingPrice?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
}

export function ContactSellerButton({
  buyerId,
  sellerId,
  listingId,
  listingImage,
  listingName,
  listingPrice,
  sellerName,
  sellerAvatar,
  buyerName,
  buyerAvatar,
  variant = 'default',
  size = 'default',
  className,
  fullWidth = false,
  iconOnly = false,
}: ContactSellerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      // Load initial messages
      const loadMessages = async () => {
        const msgs = await getConversationMessages(conversationId);
        setMessages(msgs);
      };
      loadMessages();

      // Subscribe to new messages
      const unsubscribe = subscribeToConversationMessages(
        conversationId,
        (eventType, newMsg) => {
          if (
            eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT ||
            eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE
          ) {
            setMessages((prev) => {
              const messageExists = prev.some((msg) => msg.id === newMsg.id);
              if (messageExists) {
                return prev.map((msg) => (msg.id === newMsg.id ? newMsg : msg));
              }
              return [...prev, newMsg];
            });
          }

          if (eventType === REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE) {
            setMessages((prev) => prev.filter((msg) => msg.id !== newMsg.id));
          }
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [conversationId]);

  const handleContact = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const conversation = await createConversation(
        buyerId,
        sellerId,
        listingId
      );
      if (conversation) {
        setConversationId(conversation.id);
        setShowChat(true);
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!conversationId || !newMessage.trim()) return;

    try {
      await sendMessage(conversationId, buyerId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (showChat) {
    return (
      <Card className="right-4 w-full h-72 flex flex-col shadow-lg rounded-lg overflow-hidden py-0">
        {/* Chat Header */}
        <div className=" bg-zinc-100 dark:bg-zinc-950 px-3 py-1 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              src={listingImage || ''}
              alt={listingName || ''}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-sm">{listingName}</span>
              <span className="text-[10px] text-zinc-500">
                {CURRENCY} {listingPrice}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChat(false)}
            className=""
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Container */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 space-y-2"
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === buyerId}
              senderName={
                message.sender_id === buyerId ? buyerName : sellerName
              }
              senderAvatar={
                message.sender_id === buyerId ? buyerAvatar : sellerAvatar
              }
            />
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleContact}
      disabled={isLoading}
      className={cn('cursor-pointer', fullWidth && 'w-full', className)}
    >
      <MessageSquare className="h-4 w-4 mr-2 " />
      {!iconOnly && 'Contact Seller'}
    </Button>
  );
}
