-- Create the seller_profiles table
CREATE TABLE IF NOT EXISTS public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  seller_status TEXT NOT NULL CHECK (seller_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  business_name TEXT NOT NULL,
  business_category TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  services TEXT[] NOT NULL,
  service_modes JSONB NOT NULL DEFAULT '[]',
  location JSONB NOT NULL,
  images TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security for seller_profiles
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;


-- Create RLS policies for seller_profiles
-- CREATE POLICY "Sellers can view their own seller profile"
--   ON public.seller_profiles
--   FOR SELECT
--   USING (auth.uid() = id);

CREATE POLICY "Sellers can update their own seller profile"
  ON public.seller_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- CREATE POLICY "Admin can view all seller profiles"
--   ON public.seller_profiles
--   FOR SELECT
--   USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admin can update all seller profiles"
  ON public.seller_profiles
  FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add trigger for seller_profiles
CREATE TRIGGER update_seller_profiles_updated_at
BEFORE UPDATE ON public.seller_profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON public.seller_profiles(id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_status ON public.seller_profiles(seller_status);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_category ON public.seller_profiles(business_category); 