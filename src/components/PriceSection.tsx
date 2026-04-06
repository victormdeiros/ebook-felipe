import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const benefits = [
  "Acesso imediato após o pagamento",
  "Material em PDF — consulte onde quiser",
  "Pagamento 100% seguro via Mercado Pago",
];

const PriceSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    addToCart();
    openCart();
  };

  return (
    <section className="py-24 lg:py-32 section-elevated relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      {/* Ambient glows matching site palette */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-wine/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance">
            Garanta seu acesso agora
          </h2>
          <p className="mt-4 text-text-muted font-body text-base max-w-xl mx-auto">
            Material objetivo para consulta rápida na rotina de gestão e Departamento Pessoal.
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center"
        >
          {/* Price card — site palette (support bg + wine border) */}
          <div
            className="w-full max-w-sm rounded-2xl text-center relative"
            style={{
              background: "var(--support)",
              border: "1px solid rgba(138, 34, 48, 0.25)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 0 60px -20px rgba(138,34,48,0.18)",
              padding: "2.5rem 2rem",
            }}
          >
            {/* Urgency badge */}
            <span
              className="inline-block font-ui text-[0.65rem] tracking-[0.14em] text-white mb-5 px-3 py-1 rounded-full"
              style={{ background: "#c0392b" }}
            >
              🔥 OFERTA DE LANÇAMENTO
            </span>

            {/* Old price */}
            <p
              className="font-body"
              style={{ fontSize: "15px", color: "#6b6060", textDecoration: "line-through", marginBottom: "4px" }}
            >
              de R$ 97,00
            </p>

            {/* Arrow */}
            <p
              className="text-wine"
              style={{ fontSize: "20px", margin: "4px 0" }}
              aria-hidden="true"
            >
              ↓
            </p>

            {/* New price */}
            <p
              className="font-display text-off-white"
              style={{ fontSize: "68px", lineHeight: 1, marginBottom: "4px" }}
            >
              R$ 47,00
            </p>

            {/* Legend */}
            <p
              className="font-body"
              style={{ fontSize: "13px", color: "#a79797", marginBottom: "1.5rem" }}
            >
              Promoção de lançamento
            </p>

            {/* Divider */}
            <div className="h-px bg-white/6 mb-5 mx-4" />

            {/* Benefits */}
            <ul className="text-left mx-auto mb-6 space-y-2" style={{ maxWidth: "260px" }}>
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "#c8bfbf" }}>
                  <BadgeCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-ui text-sm font-bold tracking-[0.04em] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(16,185,129,0.5)]"
              style={{
                borderRadius: "40px",
                padding: "1rem 2rem",
                border: "none",
                fontSize: "15px",
              }}
            >
              GARANTIR MEU ACESSO
            </button>

            {/* Security line */}
            <div className="mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-wine/60" />
              <span className="font-body text-[11px] text-text-muted">
                Compra segura · Mercado Pago
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PriceSection;
