import { Header, Footer } from "@/components/shared";
import {
  HeroSection,
  FeaturesSection,
  ProcessSection,
  TestimonialsSection,
  TeamSection,
  FAQSection,
  BlogSection,
  TrustSection,
  CTASection,
} from "@/components/home";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <TestimonialsSection />
        <TeamSection />
        <FAQSection />
        <BlogSection />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
