import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import React from 'react';
import { useMessagingContext } from '../MessagingContext';
import { useProfileServices } from '@/lib/hooks';

interface ConversationHeaderProps {
  mobileSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export const ConversationHeader = ({
  mobileSidebar,
  setShowSidebar,
}: ConversationHeaderProps) => {
  const { activeConversation } = useMessagingContext();
  const { user } = useProfileServices();

  const isBuyer = activeConversation?.buyer.id === user?.id;

  const userFullName = isBuyer
    ? activeConversation?.product.title
    : activeConversation?.buyer.full_name;

  const userAvatar = isBuyer
    ? activeConversation?.product.images[0]
    : activeConversation?.buyer.avatar_url;

  const listingTitle = isBuyer
    ? activeConversation?.seller.business_name
    : activeConversation?.product?.title;

  const initials = userFullName
    ? userFullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '';

  return (
    <div className="p-3 border-b flex items-center gap-3">
      {mobileSidebar && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSidebar(true)}
          className="md:hidden"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Button>
      )}

      <Avatar>
        <AvatarImage src={userAvatar} alt={userFullName} />
        <AvatarFallback className="bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{userFullName}</h3>

        {listingTitle && (
          <p className="text-xs text-muted-foreground truncate">
            re: {listingTitle}
          </p>
        )}
      </div>
    </div>
  );
};
