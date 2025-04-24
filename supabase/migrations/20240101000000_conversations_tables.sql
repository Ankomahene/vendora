-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Prevent duplicate conversations between the same buyer/seller for the same listing
  UNIQUE(buyer_id, seller_id, listing_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read BOOLEAN DEFAULT false
  
  -- We removed the subquery CHECK constraint as it's not supported
  -- We'll enforce this through RLS policies instead
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller_id ON conversations(seller_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Enable RLS on conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies for conversations table
CREATE POLICY "Participants can view their own conversations" 
  ON conversations 
  FOR SELECT 
  USING (
    auth.uid() = buyer_id OR 
    auth.uid() = seller_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Buyers can create conversations" 
  ON conversations 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = buyer_id
  );

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages table
CREATE POLICY "Participants can view messages in their conversations" 
  ON messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND (auth.uid() = buyer_id OR auth.uid() = seller_id)
    ) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Participants can send messages in their conversations" 
  ON messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND (auth.uid() = buyer_id OR auth.uid() = seller_id)
    )
  );

CREATE POLICY "Receivers can mark messages as read" 
  ON messages 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND 
      (
        (auth.uid() = buyer_id AND sender_id = seller_id) OR
        (auth.uid() = seller_id AND sender_id = buyer_id)
      )
    )
  )
  WITH CHECK (
    read = true
  );

-- Add realtime subscriptions
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE messages, conversations;
COMMIT;