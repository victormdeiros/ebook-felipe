import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ShieldCheck, CalendarDays, Coffee, MapPin, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getContent } from "@/lib/contentStore";
import { CONFIG } from "@/config";

const ebookBenefits = [
  "Acesso imediato após o pagamento",
  "Material em PDF — consulte onde quiser",
  "Pagamento 100% seguro via Mercado Pago",
];

const eventBenefits = [
  { icon: MapPin, text: "Lugar em nossa mesa de debates" },
  { icon: Coffee, text: "Coffee Break exclusivo para networking" },
  { icon: ShieldCheck, text: "Conteúdo baseado no Manual do Empregador" },
];

const PriceSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart, addEventToCart, openCart } = useCart();
  const content = getContent();

  const eventPrice = content.eventPrice || String(CONFIG.EVENT_PRICE);

  const handleAddToCart = () => {
    addToCart();
    openCart();
  };

  const handleAddEvent = () => {
    addEventToCart();
    openCart();
  };

  return (
    <section className="py-24 lg:py-32 section-elevated relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-wine/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance">
            Escolha como evoluir sua gestão
          </h2>
          <p className="mt-4 text-text-muted font-body text-base max-w-xl mx-auto">
            Adquira o e-book, garanta sua vaga no evento, ou aproveite os dois.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* ── Ebook card ── */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-2xl text-center relative flex flex-col"
            style={{
              background: "var(--support)",
              border: "1px solid rgba(138, 34, 48, 0.25)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 0 60px -20px rgba(138,34,48,0.18)",
              padding: "2.5rem 2rem",
            }}
          >
            <span className="inline-block font-ui text-[0.65rem] tracking-[0.14em] text-white mb-5 px-3 py-1 rounded-full" style={{ background: "#c0392b" }}>
              🔥 OFERTA DE LANÇAMENTO
            </span>

            <p className="font-body" style={{ fontSize: "15px", color: "#6b6060", textDecoration: "line-through", marginBottom: "4px" }}>
              de R$ 97,00
            </p>
            <p className="text-wine" style={{ fontSize: "20px", margin: "4px 0" }} aria-hidden="true">↓</p>
            <p className="font-display text-off-white" style={{ fontSize: "62px", lineHeight: 1, marginBottom: "4px" }}>
              R$ 47,00
            </p>
            <p className="font-body mb-6" style={{ fontSize: "13px", color: "#a79797" }}>
              Manual do Empregador — PDF
            </p>

            <div className="h-px bg-white/6 mb-5 mx-4" />

            <ul className="text-left mx-auto mb-6 space-y-2 flex-1" style={{ maxWidth: "260px" }}>
              {ebookBenefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "#c8bfbf" }}>
                  <BadgeCheck className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light active:bg-gold-dark text-background font-ui text-sm font-bold tracking-[0.04em] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(201,168,76,0.5)]"
              style={{ borderRadius: "40px", padding: "1rem 2rem", border: "none", fontSize: "15px" }}
            >
              GARANTIR MEU ACESSO
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-wine/60" />
              <span className="font-body text-[11px] text-text-muted">Compra segura · Mercado Pago</span>
            </div>
          </motion.div>

          {/* ── Event card ── */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl text-center relative flex flex-col"
            style={{
              background: "#0f0c08",
              border: "1px solid rgba(201, 168, 76, 0.22)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 60px -20px rgba(201,168,76,0.12)",
              padding: "2.5rem 2rem",
            }}
          >
            <span className="inline-flex items-center justify-center gap-1.5 font-ui text-[0.65rem] tracking-[0.14em] text-gold mb-5 px-3 py-1 rounded-full border border-gold/30 bg-gold/[0.06]">
              <CalendarDays className="h-3 w-3" />
              EVENTO DE LANÇAMENTO EXCLUSIVO
            </span>

            <p className="font-display text-off-white" style={{ fontSize: "62px", lineHeight: 1, marginBottom: "4px" }}>
              R$ {eventPrice}<span className="text-2xl text-text-muted">,00</span>
            </p>
            <p className="font-body mb-6" style={{ fontSize: "13px", color: "#a79797" }}>
              Segurança Jurídica 360 · Inscrição
            </p>

            <div className="h-px mb-5 mx-4" style={{ background: "rgba(201,168,76,0.12)" }} />

            <ul className="text-left mx-auto mb-6 space-y-3 flex-1" style={{ maxWidth: "260px" }}>
              {eventBenefits.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2 text-sm" style={{ color: "#c8bfbf" }}>
                  <Icon className="w-4 h-4 shrink-0 mt-0.5 text-gold/70" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleAddEvent}
              className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold-light active:bg-gold-dark text-background font-ui text-sm font-bold tracking-[0.04em] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(201,168,76,0.5)]"
              style={{ borderRadius: "40px", padding: "1rem 2rem", border: "none", fontSize: "15px" }}
            >
              GARANTIR MINHA VAGA
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center font-body text-[11px] text-text-muted">
              Vagas limitadas · Ambiente focado
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PriceSection;
