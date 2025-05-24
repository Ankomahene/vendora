import { HeroSection } from './components/hero/HeroSection';
import { FeaturedSection } from './components/featured/FeaturedSection';
import { CategorySection } from './components/featured/CategorySection';
import { TestimonialSection } from './components/featured/TestimonialSection';
import { CTASection } from './components/layout/CTASection';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();

  const { data: sellers } = await supabase
    .from('profiles')
    .select('id,seller_details, created_at')
    .eq('role', 'seller')
    .order('created_at', { ascending: true })
    .limit(4);

  return (
    <>
      <HeroSection />
      <FeaturedSection sellers={sellers || []} />
      <CategorySection />
      <TestimonialSection />
      <CTASection />
    </>
  );
}
