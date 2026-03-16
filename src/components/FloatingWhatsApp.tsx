import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
  return (
    <a
      href="https://wa.me/5500000000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 border border-accent/30 bg-background/90 backdrop-blur-sm text-accent px-5 py-3 rounded-md font-ui text-xs transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] shadow-lg"
      aria-label="Falar com um advogado"
    >
      <MessageCircle className="w-4 h-4" />
      Falar com um Advogado
    </a>
  );
};

export default FloatingWhatsApp;
