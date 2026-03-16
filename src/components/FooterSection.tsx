import logoBranca from "@/assets/logo-branca.png";
import { Instagram, Linkedin } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-16 bg-background border-t border-foreground/5">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div>
            <img src={logoBranca} alt="Felipe Lopes Advogados" className="h-10 mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Orientação jurídica para empresas e empresários, com foco na prevenção de riscos e gestão empresarial segura.
            </p>
          </div>

          <div>
            <h4 className="font-ui text-xs text-accent tracking-widest mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-ui text-xs text-accent tracking-widest mb-4">Aviso Legal</h4>
            <p className="text-muted-foreground/60 text-xs leading-relaxed">
              Este material possui caráter informativo e não substitui a análise jurídica individual de cada caso.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-foreground/5 text-center">
          <p className="text-muted-foreground/40 text-xs">
            © {new Date().getFullYear()} Felipe Lopes Advogados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
