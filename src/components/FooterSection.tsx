import { MessageCircle } from "lucide-react";
import { CONFIG } from "@/config";

const FooterSection = () => {
  return (
    <footer className="py-16 bg-background relative">
      <div className="h-px bg-gradient-to-r from-transparent via-wine/30 to-transparent mb-16" aria-hidden="true" />

      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-12 items-start mb-12">
          {/* Identity */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-support border border-wine/20 flex items-center justify-center rounded-sm">
                <span className="text-wine font-display font-bold text-xl">ME</span>
              </div>
              <span className="font-display text-xl text-off-white font-semibold tracking-wide">
                MANUAL DO EMPREGADOR
              </span>
            </div>
            <p className="text-text-muted font-body text-sm leading-relaxed mb-6 max-w-sm">
              Material objetivo para consulta rápida na rotina de gestão e Departamento Pessoal.
            </p>
            <div className="flex gap-4">
              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-wine transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-ui text-xs text-wine tracking-[0.2em] mb-6">LINKS ÚTEIS</h4>
            <nav aria-label="Links do rodapé">
              <ul className="space-y-3">
                {[
                  { label: "Garantir meu acesso", href: "#checkout" },
                  { label: "Termos de Uso", href: "#" },
                  { label: "Política de Privacidade", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-muted hover:text-wine font-body text-sm transition-colors inline-block py-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-ui text-xs text-wine tracking-[0.2em] mb-6">CONTATO</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-text-muted font-body text-sm">
                <MessageCircle className="w-5 h-5 shrink-0 text-wine/60" />
                <a
                  href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Quero saber mais sobre o Manual do Empregador.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-wine transition-colors"
                >
                  Fale com um especialista
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 mt-4 text-center">
          <p className="text-white/55 font-body text-sm">
            &copy; {new Date().getFullYear()} MANUAL DO EMPREGADOR. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
