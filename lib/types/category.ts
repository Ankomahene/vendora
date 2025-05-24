export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export type EnhancedCategory = Category & {
  businessCount: number;
  listingCount: number;
};
