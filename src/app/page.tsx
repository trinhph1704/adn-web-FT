import { Header, Footer } from '@/components/shared';
import {
  HeroSection,
  FeaturesSection,
  ProcessSection,
  TestimonialsSection,
  TeamSection,
  FAQSection,
  TrustSection,
  CTASection,
} from '@/components/home';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <TeamSection />
        <FAQSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
