import { useEffect } from "react";
import { trackPageView, gtmPush } from "@/lib/tracking";
import { CONFIG } from "@/config";
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
import EbookPriceSection from "@/components/EbookPriceSection";
import CtaSection from "@/components/CtaSection";
import FooterSection from "@/components/FooterSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  useEffect(() => {
    const cleanup = trackPageView();
    gtmPush({
      event: "view_item",
      ecommerce: {
        currency: "BRL",
        value: CONFIG.PRODUCT_PRICE,
        items: [
          {
            item_id: "ebook",
            item_name: CONFIG.BRAND_NAME,
            item_category: "E-book",
            price: CONFIG.PRODUCT_PRICE,
            quantity: 1,
          },
        ],
      },
    });
    return cleanup;
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Pular para o conteudo principal
      </a>

      <StickyHeader variant="ebook" />
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
        <EbookPriceSection />
        <CtaSection />
        <FooterSection />
      </main>
      <FloatingWhatsApp />
    </>
  );
};

export default Index;
