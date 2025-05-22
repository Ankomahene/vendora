'use client';
import React from 'react';
// import { MessagingContainer } from '@/components/messaging/MessagingContainer';
import { ContactSellerButton } from '@/components/messaging/ContactSellerButton';

import { Separator } from '@/components/ui/separator';

const userId = 'c2e446c7-6c96-484e-a127-73c12bda8b05';
const sellerId = 'd9758d09-2cbf-440c-899e-2a519013309f';
const listingId = '3de00a52-c793-4991-ad1a-5ca1e69aecf6';

export const MessagesClient = () => {
  return (
    <div className="container mx-auto w-2xl">
      <p className="py-2">Messaging Container</p>
      {/* <MessagingContainer userId={userId} /> */}

      <Separator className="my-4" />
      <p className="py-2">Contact Seller</p>

      <ContactSellerButton
        buyerId={userId}
        sellerId={sellerId}
        listingId={listingId}
        sellerName="Faithtower Lordson"
        buyerName="FMT Design and Print"
        listingImage="https://gjwldbdrfxpoqdhbdwxs.supabase.co/storage/v1/object/public/listings-images/d9758d09-2cbf-440c-899e-2a519013309f/2620c59c-3d47-4506-9dbe-93c868b167a3.png"
        listingName="Phone case printing"
        listingPrice="30.09"
      />
      <Separator className="my-4" />
      <p className="py-2">Messages Count</p>
    </div>
  );
};
