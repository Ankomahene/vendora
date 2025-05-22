import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileServices } from '@/lib/hooks';
import { ConversationResponse } from '@/lib/types/messaging';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ConversationItemProps {
  conversation: ConversationResponse;
  isActive: boolean;
  highlight: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  highlight,
  onClick,
}: ConversationItemProps) {
  const { buyer, seller, product } = conversation;
  const { user } = useProfileServices();

  const isBuyer = buyer.id === user?.id;

  // Get buyer initials for avatar fallback
  const userInitials = isBuyer
    ? seller.full_name
    : buyer.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-3 hover:bg-primary/10 transition-colors',
        'border-b',
        isActive && 'bg-zinc-100 dark:bg-zinc-800 '
      )}
    >
      <Avatar>
        <AvatarImage
          src={isBuyer ? product.images[0] : buyer.avatar_url}
          alt="avatar"
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {userInitials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 text-left">
        <p
          className={cn(
            'truncate text-gray-700 dark:text-gray-300',
            highlight && 'text-gray-900 dark:text-gray-100 font-medium'
          )}
        >
          {isBuyer ? product.title : buyer.full_name}
        </p>

        {product && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground">re:</span>
            <div className="flex items-center gap-0">
              {!isBuyer && (
                <div className="relative w-6 h-6 rounded-md overflow-hidden bg-muted">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground truncate">
                {isBuyer ? seller.business_name : product.title}{' '}
              </p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
