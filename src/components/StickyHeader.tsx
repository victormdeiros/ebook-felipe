import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";


const NAV_ITEMS = [
  { label: "O Manual", href: "#manual" },
  { label: "Conteúdo", href: "#conteudo" },
  { label: "Autores", href: "#autores" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Lançamento", href: "#evento", highlight: true },
];

const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const { cartCount, addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    addToCart();
    openCart();
  };

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

  // Bounce animation on cart icon when item count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(t);
    }
  }, [cartCount]);

  const handleGuaranteeAccess = () => handleAddToCart();

  return (
    <>
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
          <a href="#" aria-label="Manual do Empregador – Início" className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center rounded bg-wine/20 border border-wine/25 shrink-0">
              <span className="font-display text-wine font-bold text-sm leading-none">ME</span>
            </div>
            <span
              className={`font-display font-semibold text-off-white tracking-wide transition-all duration-300 ${
                scrolled ? "text-base" : "text-lg"
              }`}
            >
              MANUAL DO EMPREGADOR
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`font-body text-sm transition-colors duration-200 ${
                  item.highlight
                    ? "text-gold hover:text-gold-light font-semibold"
                    : "text-secondary-light hover:text-wine"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Cart icon */}
            <button
              onClick={openCart}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-off-white hover:text-gold transition-colors duration-200 cursor-pointer"
              aria-label={`Carrinho${cartCount > 0 ? ` — ${cartCount} item` : ""}`}
            >
              <ShoppingCart
                className={`w-5 h-5 transition-all duration-300 ${
                  cartBounce ? "scale-125 text-gold" : "scale-100"
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-background leading-none shadow-[0_0_8px_rgba(201,168,76,0.6)]">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={handleGuaranteeAccess}
              className="font-ui text-xs text-white min-h-[44px] px-5 flex items-center gap-1.5 rounded-md transition-all duration-200 hover:shadow-[0_4px_20px_-4px_rgba(201,168,76,0.55)] cursor-pointer" style={{ background: '#2d7a4f' }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background='#c9a84c'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
            >
              GARANTIR MINHA VAGA
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-off-white cursor-pointer"
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
                  className={`font-body text-base transition-colors py-3 border-b border-white/5 ${
                    item.highlight
                      ? "text-gold hover:text-gold-light font-semibold"
                      : "text-secondary-light hover:text-wine"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <CartDrawer />
    </>
  );
};

export default StickyHeader;
