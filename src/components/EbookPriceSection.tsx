import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { fetchContent, getContent } from "@/lib/contentStore";
import { getProducts } from "@/lib/repository";
import { CONFIG } from "@/config";

const ebookBenefits = [
  "Acesso imediato apos o pagamento",
  "Material em PDF para consultar antes de contratar, advertir ou desligar",
  "Pagamento 100% seguro via Mercado Pago",
];

const EbookPriceSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, openCart } = useCart();
  const [content, setContent] = useState(getContent());
  const [productPrices, setProductPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchContent().then(setContent).catch(() => {});
    getProducts()
      .then((products) => {
        const map: Record<string, number> = {};
        for (const p of products) map[p.id] = p.price;
        setProductPrices(map);
      })
      .catch(() => {});
  }, []);

  const ebookPrice = productPrices.ebook != null ? String(productPrices.ebook) : content.price || String(CONFIG.PRODUCT_PRICE);
  const ebookPriceOriginal = content.priceOriginal || String(CONFIG.PRODUCT_PRICE_ORIGINAL);

  const handleAddToCart = () => {
    addToCart();
    openCart();
  };

  return (
    <section id="checkout" className="section-elevated relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent" />
      <div className="absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-wine/10 blur-[130px]" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="mb-4 font-ui text-[0.65rem] tracking-[0.28em] text-gold">E-BOOK DIGITAL</p>
          <h2 className="font-display text-4xl font-semibold text-off-white md:text-5xl">
            Manual do Empregador em uma compra unica.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center font-body text-base leading-relaxed text-text-muted">
            Tenha um material de consulta rapida para orientar decisoes trabalhistas com mais clareza.
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-gold/20 bg-[#0f0b0c] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] md:grid-cols-[1fr_0.9fr]"
        >
          <div className="relative p-8 sm:p-10">
            <span className="mb-8 inline-flex rounded-full border border-wine/25 bg-wine/15 px-4 py-1.5 font-ui text-[0.62rem] tracking-[0.18em] text-off-white">
              OFERTA DE LANCAMENTO
            </span>
            <p className="font-body text-sm text-text-muted line-through">de R$ {ebookPriceOriginal},00</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="font-display text-2xl text-gold">R$</span>
              <span className="font-display text-7xl font-bold leading-none text-off-white">{ebookPrice}</span>
              <span className="mb-2 font-display text-2xl text-text-muted">,00</span>
            </div>
            <p className="mt-3 text-sm text-text-muted">Manual do Empregador - PDF</p>

            <button
              id="btn-add-cart-ebook"
              onClick={handleAddToCart}
              className="mt-8 flex min-h-[54px] w-full items-center justify-center rounded-xl px-6 font-ui text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(201,168,76,0.55)]"
              style={{ background: "#2d7a4f" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c9a84c")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2d7a4f")}
            >
              COMPRAR O EBOOK
            </button>
          </div>

          <div className="border-t border-white/8 bg-black/20 p-8 sm:p-10 md:border-l md:border-t-0">
            <p className="mb-6 font-ui text-[0.62rem] tracking-[0.22em] text-gold">INCLUSO</p>
            <ul className="space-y-4">
              {ebookBenefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-off-white/80">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gold/70" />
              <p className="text-xs leading-relaxed text-text-muted">Compra segura, acesso individual e sem mensalidade.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EbookPriceSection;
