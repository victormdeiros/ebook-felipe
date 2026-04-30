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
    document.title = "Segurança Jurídica 360° – Evento";

    const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    const originalHref = favicon?.href ?? "/icon-manual.png";
    if (favicon) favicon.href = "/logo_seguran\u00e7a_juridica-removebg-preview.png";

    return () => {
      document.title = "Manual do Empregador – E-book";
      if (favicon) favicon.href = originalHref;
    };
  }, []);

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

      <EventCountdown />
      <StickyHeader variant="event" topOffset={48} />
      <main id="main-content">
        <EventHeroSection />
        <EventLandingSections />
        <FooterSection />
      </main>
      <FloatingWhatsApp />
    </>
  );
};

export default Evento;
