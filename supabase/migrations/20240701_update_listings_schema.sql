-- Rename category column to product_type in listings table
ALTER TABLE public.listings 
RENAME COLUMN category TO product_type;

-- Update indexes
DROP INDEX IF EXISTS idx_listings_category;
CREATE INDEX IF NOT EXISTS idx_listings_product_type ON public.listings(product_type);

-- Create product_types table
CREATE TABLE IF NOT EXISTS public.product_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_types
CREATE POLICY "Anyone can view product types"
  ON public.product_types
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage product types"
  ON public.product_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  );

-- Create trigger for updated_at on product_types
CREATE TRIGGER update_product_types_updated_at
BEFORE UPDATE ON public.product_types
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert default product types
INSERT INTO public.product_types (name, description)
VALUES 
('Electronics', 'Electronic devices and accessories'),
('Furniture', 'Home and office furniture'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books, magazines, and publications'),
('Tools', 'Tools and equipment'),
('Home Decor', 'Decorative items for the home'),
('Toys & Games', 'Children''s toys and games'),
('Sports Equipment', 'Sports and outdoor gear'),
('Beauty & Personal Care', 'Beauty and personal care products'),
('Food & Beverages', 'Food items and beverages'); 