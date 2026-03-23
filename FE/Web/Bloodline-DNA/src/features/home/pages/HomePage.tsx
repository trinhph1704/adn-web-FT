import { Footer, Header } from "../../../components";
import ChatbotAI from "../../chatbotAI/components/ChatbotAI";
import BlogSection from "../components/BlogSection";
import CTASection from "../components/CTASection";
import FAQSection from "../components/FAQSection";
import FeaturesSection from "../components/FeaturesSection";
import HeroSection from "../components/HeroSection";
import ProcessSection from "../components/ProcessSection";
import TeamSection from "../components/TeamSection";
import TestimonialsSection from "../components/TestimonialsSection";
import TrustSection from "../components/TrustSection";
import "./custom-styles.css";

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
    <Header />
    <HeroSection />
    <FeaturesSection />
    <ProcessSection />
    <TestimonialsSection />
    <TeamSection />
    <FAQSection />
    <BlogSection />
    <TrustSection />
    <CTASection />
    <div className="fixed bottom-0 right-0 p-4">
      <ChatbotAI />
    </div>
    <Footer />
  </div>
);

export default HomePage;
