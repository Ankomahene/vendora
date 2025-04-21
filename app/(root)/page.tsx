import { HeroSection } from '@/app/components/hero/HeroSection';
import { FeaturedSection } from '@/app/components/featured/FeaturedSection';
import { CategorySection } from '@/app/components/featured/CategorySection';
import { TestimonialSection } from '@/app/components/featured/TestimonialSection';
import { CTASection } from '@/app/components/layout/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <CategorySection />
      <TestimonialSection />
      <CTASection />
    </>
  );
}
