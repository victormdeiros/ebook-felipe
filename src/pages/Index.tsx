import StickyHeader from "@/components/StickyHeader";
import HeroSection from "@/components/HeroSection";
import TrustBarSection from "@/components/TrustBarSection";
import PainPointsSection from "@/components/PainPointsSection";
import EbookPresentationSection from "@/components/EbookPresentationSection";
import LearningSection from "@/components/LearningSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import AboutSection from "@/components/AboutSection";
import ImportanceSection from "@/components/ImportanceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaSection from "@/components/CtaSection";
import FooterSection from "@/components/FooterSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  return (
    <>
      <StickyHeader />
      <main>
        <HeroSection />
        <TrustBarSection />
        <PainPointsSection />
        <EbookPresentationSection />
        <LearningSection />
        <TargetAudienceSection />
        <AboutSection />
        <ImportanceSection />
        <TestimonialsSection />
        <CtaSection />
        <FooterSection />
      </main>
      <FloatingWhatsApp />
    </>
  );
};

export default Index;
