-- First, create the function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2),
  category TEXT NOT NULL,
  tags TEXT[],
  service_modes TEXT[] NOT NULL,
  location JSONB NOT NULL,
  images TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create the listing_images table for optimized querying and management
CREATE TABLE IF NOT EXISTS public.listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create the categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for listings
-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
  ON public.listings
  FOR SELECT
  USING (is_active = true);

-- Sellers can view all their own listings (active and inactive)
CREATE POLICY "Sellers can view their own listings"
  ON public.listings
  FOR SELECT
  USING (auth.uid() = seller_id);

-- Sellers can insert their own listings
CREATE POLICY "Sellers can create their own listings"
  ON public.listings
  FOR INSERT
  WITH CHECK (
    auth.uid() = seller_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'seller'
      AND seller_status = 'approved'
    )
  );

-- Sellers can update their own listings
CREATE POLICY "Sellers can update their own listings"
  ON public.listings
  FOR UPDATE
  USING (auth.uid() = seller_id);

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete their own listings"
  ON public.listings
  FOR DELETE
  USING (auth.uid() = seller_id);

-- Admins can view all listings
CREATE POLICY "Admins can view all listings"
  ON public.listings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Admins can update all listings
CREATE POLICY "Admins can update all listings"
  ON public.listings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- RLS policies for listing_images
CREATE POLICY "Anyone can view listing images"
  ON public.listing_images
  FOR SELECT
  USING (true);

CREATE POLICY "Sellers can manage their own listing images"
  ON public.listing_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_images.listing_id
      AND listings.seller_id = auth.uid()
    )
  );

-- RLS policies for categories
CREATE POLICY "Anyone can view categories"
  ON public.categories
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON public.categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create trigger for updated_at on listings
CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create trigger for updated_at on categories
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON public.listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON public.listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON public.listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

-- Insert default categories
INSERT INTO public.categories (name, description, image)
VALUES 
('Home Services', 'Services for your home and garden', 'https://example.com/images/home-services.jpg'),
('Professional Services', 'Business and professional services', 'https://example.com/images/professional-services.jpg'),
('Health & Wellness', 'Health and wellness services', 'https://example.com/images/health-wellness.jpg'),
('Beauty & Personal Care', 'Beauty treatments and personal care', 'https://example.com/images/beauty-personal.jpg'),
('Education & Training', 'Educational services and training', 'https://example.com/images/education-training.jpg'),
('Auto & Transportation', 'Automobile and transportation services', 'https://example.com/images/auto-transportation.jpg'),
('Technology', 'Technology services and products', 'https://example.com/images/technology.jpg'),
('Events & Entertainment', 'Event planning and entertainment services', 'https://example.com/images/events-entertainment.jpg'),
('Food & Catering', 'Food delivery and catering services', 'https://example.com/images/food-catering.jpg'),
('Other Services', 'Miscellaneous services', 'https://example.com/images/other-services.jpg');

-- Function to delete listing images from storage when a listing is deleted
CREATE OR REPLACE FUNCTION delete_listing_images_on_listing_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- This is a placeholder. In a real implementation, you would delete files from storage
  -- using Supabase Edge Functions or similar approaches
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function when a listing is deleted
CREATE TRIGGER on_listing_deleted
AFTER DELETE ON public.listings
FOR EACH ROW EXECUTE FUNCTION delete_listing_images_on_listing_delete(); 