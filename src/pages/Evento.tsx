import { useEffect } from "react";
import StickyHeader from "@/components/StickyHeader";
import EventHeroSection from "@/components/EventHeroSection";
import EventCountdown from "@/components/EventCountdown";
import EventLandingSections from "@/components/EventLandingSections";
import FooterSection from "@/components/FooterSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { CONFIG } from "@/config";
import { gtmPush, trackPageView } from "@/lib/tracking";

const Evento = () => {
  useEffect(() => {
    const cleanup = trackPageView();
    gtmPush({
      event: "view_item",
      ecommerce: {
        currency: "BRL",
        value: CONFIG.EVENT_PRICE,
        items: [
          {
            item_id: "event",
            item_name: "Seguranca Juridica 360",
            item_category: "Evento",
            price: CONFIG.EVENT_PRICE,
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

      <StickyHeader variant="event" />
      <main id="main-content">
        <EventHeroSection />
        <EventCountdown />
        <EventLandingSections />
        <FooterSection />
      </main>
      <FloatingWhatsApp />
    </>
  );
};

export default Evento;
