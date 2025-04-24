import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { MessagesCount } from '../messaging/MessagesCount';

interface MessagesNotificationProps {
  userId: string;
}

export function MessagesNotification({ userId }: MessagesNotificationProps) {
  return (
    <Button variant="ghost" asChild className="relative flex justify-start">
      <Link href="/messages">
        <MessageSquare className="h-5 w-5 mr-2" />
        <span>Messages</span>
        <MessagesCount userId={userId} />
      </Link>
    </Button>
  );
}
