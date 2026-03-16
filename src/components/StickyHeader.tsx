import { useState, useEffect } from "react";
import logoBranca from "@/assets/logo-branca.png";

const STRIPE_PAYMENT_LINK = "#STRIPE_PAYMENT_LINK";

const StickyHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          : "bg-primary/80 backdrop-blur-sm"
      }`}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-accent transition-all duration-100"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <div
        className={`container mx-auto px-6 lg:px-12 flex items-center justify-between transition-all duration-300 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        {/* Logo */}
        <a href="#" aria-label="Felipe Lopes Advogados – Início">
          <img
            src={logoBranca}
            alt="Felipe Lopes Advogados"
            className={`transition-all duration-300 ${scrolled ? "h-[60px]" : "h-[84px]"}`}
          />
        </a>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a
            href="#comprar"
            className="font-ui text-xs bg-primary-hover hover:bg-primary-light text-white px-5 py-2.5 rounded-md transition-all duration-200 hover:scale-[1.02] border border-accent/20"
          >
            ADQUIRIR O E-BOOK
          </a>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
