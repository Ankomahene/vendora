'use client';

import React from 'react';
import { MessagingContainer } from '@/components/messaging/MessagingContainer';

interface MessagesClientProps {
  userId: string;
  initialConversationId?: string;
}

export function MessagesClient({
  userId,
  initialConversationId,
}: MessagesClientProps) {
  return (
    <div className="h-[calc(100vh-160px)]">
      <MessagingContainer
        userId={userId}
        initialConversationId={initialConversationId}
        maxHeight="calc(100vh - 160px)"
        mobileSidebar={false}
      />
    </div>
  );
}
