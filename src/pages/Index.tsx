import { useEffect } from "react";
import { trackPageView } from "@/lib/tracking";
import StickyHeader from "@/components/StickyHeader";
import HeroSection from "@/components/HeroSection";
import PainPointsSection from "@/components/PainPointsSection";
import EbookPresentationSection from "@/components/EbookPresentationSection";
import LearningSection from "@/components/LearningSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import TargetAudienceTextSection from "@/components/TargetAudienceTextSection";
import AboutSection from "@/components/AboutSection";
import ImportanceSection from "@/components/ImportanceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PriceSection from "@/components/PriceSection";
import CtaSection from "@/components/CtaSection";
import FooterSection from "@/components/FooterSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  useEffect(() => {
    const cleanup = trackPageView();
    return cleanup;
  }, []);

  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <StickyHeader />
      <main id="main-content">
        <HeroSection />
        <PainPointsSection />
        <EbookPresentationSection />
        <LearningSection />
        <TargetAudienceTextSection />
        <TargetAudienceSection />
        <AboutSection />
        <ImportanceSection />
        <TestimonialsSection />
        <PriceSection />
        <CtaSection />
        <FooterSection />
      </main>
      <FloatingWhatsApp />
    </>
  );
};

export default Index;
