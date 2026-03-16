import { Instagram, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { CONFIG } from "@/config";

const FooterSection = () => {
  return (
    <footer className="py-16 bg-[#161616]">
      {/* Gold top border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-16" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-12 items-start mb-12">
          {/* Column 1 – Identity */}
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-primary/20 border border-gold/30 flex items-center justify-center rounded-sm">
                 <span className="text-gold font-display font-bold text-xl">FL</span>
               </div>
               <span className="font-display text-xl text-off-white font-semibold">Felipe Lopes <span className="font-light">Advogados</span></span>
            </div>
            <p className="text-secondary-light font-body text-sm leading-relaxed mb-6 max-w-sm">
              Orientação jurídica para empresas e empresários, com foco na prevenção de riscos e gestão empresarial segura.
            </p>
            <div className="flex gap-4">
              <a href={CONFIG.OFFICE_INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-secondary-light hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-secondary-light hover:text-gold transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h4 className="font-ui font-bold text-xs text-gold uppercase tracking-widest mb-6">Links Úteis</h4>
            <nav aria-label="Links do rodapé">
              <ul className="space-y-4">
                {[
                  { label: "Comprar o E-book", href: "#comprar" },
                  { label: "Termos de Uso", href: "#" },
                  { label: "Política de Privacidade", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-secondary-light hover:text-gold font-body text-sm transition-colors block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3 – Contact */}
          <div>
            <h4 className="font-ui font-bold text-xs text-gold uppercase tracking-widest mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-secondary-light font-body text-sm">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5 text-gold/80" />
                <span className="leading-relaxed">{CONFIG.OFFICE_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-light font-body text-sm">
                <Phone className="w-5 h-5 shrink-0 text-gold/80" />
                <span>{CONFIG.OFFICE_PHONE}</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-light font-body text-sm">
                <Mail className="w-5 h-5 shrink-0 text-gold/80" />
                <span>{CONFIG.OFFICE_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-light/10 pt-8 mt-4 text-center">
          <p className="text-secondary-light/60 font-body text-sm">
            © {new Date().getFullYear()} Felipe Lopes Advogados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
