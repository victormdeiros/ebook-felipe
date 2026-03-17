import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/config";

const FloatingWhatsApp = () => {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 border border-wine/20 bg-background/90 backdrop-blur-sm text-wine px-5 min-h-[44px] rounded-md font-ui text-xs transition-all duration-200 hover:bg-wine hover:text-background hover:border-wine shadow-lg"
      aria-label="Falar com um advogado via WhatsApp"
    >
      <MessageCircle className="w-4 h-4" />
      Falar com um Advogado
    </a>
  );
};

export default FloatingWhatsApp;
