import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoBranca from "@/assets/logo-branca.png";

const NAV_ITEMS = [
  { label: "O Manual", href: "#manual" },
  { label: "Conteúdo", href: "#conteudo" },
  { label: "Autor", href: "#autor" },
  { label: "Depoimentos", href: "#depoimentos" },
];

const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 60);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-[0_1px_0_rgba(200,121,124,0.08)]"
          : "bg-background/60 backdrop-blur-sm"
      }`}
    >
      <div
        className="absolute top-0 left-0 h-[2px] bg-wine transition-all duration-100"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <div
        className={`container mx-auto px-6 lg:px-12 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <a href="#" aria-label="Felipe Lopes Advogados – Início">
          <img
            src={logoBranca}
            alt="Felipe Lopes Advogados"
            width={140}
            height={60}
            className={`transition-all duration-300 ${scrolled ? "h-[50px]" : "h-[64px]"} w-auto`}
          />
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-sm text-secondary-light hover:text-wine transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#comprar"
            className="font-ui text-xs bg-gold hover:bg-gold-light text-background min-h-[44px] px-6 flex items-center rounded-md transition-all duration-200 hover:shadow-[0_4px_20px_-4px_rgba(201,168,76,0.4)]"
          >
            ADQUIRIR E-BOOK
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-off-white"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="md:hidden bg-background/98 backdrop-blur-lg border-t border-white/5 px-6 pb-6 pt-4"
          aria-label="Navegação mobile"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-base text-secondary-light hover:text-wine transition-colors py-3 border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default StickyHeader;
