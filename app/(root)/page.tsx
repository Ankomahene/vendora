import { HeroSection } from './components/hero/HeroSection';
import { FeaturedSection } from './components/featured/FeaturedSection';
import { CategorySection } from './components/featured/CategorySection';
import { TestimonialSection } from './components/featured/TestimonialSection';
import { CTASection } from './components/layout/CTASection';

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
