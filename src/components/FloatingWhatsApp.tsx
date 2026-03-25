import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/config";

const FloatingWhatsApp = () => {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gold px-5 min-h-[44px] rounded-md font-ui text-xs font-bold text-background transition-all duration-200 hover:bg-gold-light hover:shadow-[0_8px_24px_-6px_rgba(201,168,76,0.5)] shadow-lg cursor-pointer"
      aria-label="Falar com um advogado via WhatsApp"
    >
      <MessageCircle className="w-4 h-4" />
      Falar com um Advogado
    </a>
  );
};

export default FloatingWhatsApp;
