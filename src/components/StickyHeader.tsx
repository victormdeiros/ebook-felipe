import { useEffect, useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import iconManual from "@/assets/icon- manual do empregador.png";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

type HeaderVariant = "ebook" | "event";

const NAV_ITEMS = {
  ebook: [
    { label: "O Manual", href: "#manual" },
    { label: "Conteudo", href: "#conteudo" },
    { label: "Autores", href: "#autores" },
    { label: "Depoimentos", href: "#depoimentos" },
  ],
  event: [
    { label: "Evento", href: "#evento" },
    { label: "Palestrantes", href: "#palestrantes" },
    { label: "Local", href: "#local" },
    { label: "Inscricao", href: "#inscricao" },
  ],
};

const StickyHeader = ({ variant = "ebook" }: { variant?: HeaderVariant }) => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const { cartCount, addToCart, addEventToCart, openCart } = useCart();
  const isEvent = variant === "event";
  const navItems = NAV_ITEMS[variant];

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
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleGuaranteeAccess = () => {
    if (isEvent) addEventToCart();
    else addToCart();
    openCart();
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 shadow-[0_1px_0_rgba(200,121,124,0.08)] backdrop-blur-md"
            : "bg-background/60 backdrop-blur-sm"
        }`}
      >
        {isEvent && (
          <div className="bg-wine py-1.5 text-center">
            <p className="font-ui text-[0.62rem] font-black tracking-[0.2em] uppercase text-white/90">
              Ultimas vagas disponiveis &mdash; Evento dia 10/06 em Recife
            </p>
          </div>
        )}

        <div
          className="absolute left-0 h-[2px] bg-wine transition-all duration-100"
          style={{ width: `${progress}%`, top: isEvent ? "1.85rem" : "0" }}
          aria-hidden="true"
        />

        <div className={`container mx-auto flex items-center justify-between px-6 transition-all duration-300 lg:px-12 ${scrolled ? "py-3" : "py-4"}`}>
          <a href={isEvent ? "/evento" : "/ebook"} aria-label="Manual do Empregador - inicio" className="flex items-center gap-2.5">
            <img
              src={iconManual}
              alt="Manual do Empregador"
              className={`shrink-0 object-contain transition-all duration-300 ${scrolled ? "h-8" : "h-10"}`}
            />
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegacao principal">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="font-body text-sm text-secondary-light transition-colors duration-200 hover:text-gold">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative flex min-h-[44px] min-w-[44px] items-center justify-center text-gold/70 transition-colors duration-200 hover:text-gold"
              aria-label={`Carrinho${cartCount > 0 ? ` - ${cartCount} item` : ""}`}
            >
              <ShoppingCart className={`h-5 w-5 transition-all duration-300 ${cartBounce ? "scale-125 text-gold" : "scale-100"}`} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-bold leading-none text-background shadow-[0_0_8px_rgba(201,168,76,0.6)]">
                  {cartCount}
                </span>
              )}
            </button>

            <a
              href={isEvent ? "/ebook" : "/evento"}
              className="hidden h-9 items-center rounded border border-gold/40 px-4 font-ui text-[0.65rem] font-semibold tracking-[0.12em] text-gold transition-all duration-200 hover:bg-gold hover:text-[#1a1408] md:flex"
            >
              {isEvent ? "VER E-BOOK" : "VER EVENTO"}
            </a>

            <button
              onClick={handleGuaranteeAccess}
              className="hidden h-9 items-center rounded px-4 font-ui text-[0.65rem] font-semibold tracking-[0.12em] text-white transition-all duration-200 hover:bg-gold md:flex"
              style={{ background: "#2d7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c9a84c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2d7a4f")}
            >
              {isEvent ? "GARANTIR MINHA VAGA" : "GARANTIR MEU ACESSO"}
            </button>

            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center text-off-white md:hidden"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-white/5 bg-background/98 px-6 pb-6 pt-4 backdrop-blur-lg md:hidden" aria-label="Navegacao mobile">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/5 py-3 font-body text-base text-secondary-light transition-colors hover:text-gold"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={isEvent ? "/ebook" : "/evento"}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/5 py-3 font-body text-base font-semibold text-gold transition-colors hover:text-gold-light"
              >
                {isEvent ? "Ver e-book" : "Ver evento"}
              </a>
            </div>
          </nav>
        )}
      </header>

      <CartDrawer />
    </>
  );
};

export default StickyHeader;
