import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, MessageCircle, ShieldCheck } from "lucide-react";
import ebookCover from "@/assets/ebook-cover.png";
import { CountUp } from "@/components/ui/count-up";
import { PerspectiveBook } from "@/components/ui/perspective-book";
import { CONFIG } from "@/config";
import { getContent } from "@/lib/contentStore";
import { useCart } from "@/contexts/CartContext";

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const content = getContent();
  const { addToCart, openCart } = useCart();

  const handleAddToCart = () => {
    addToCart();
    openCart();
  };
  const whatsappNumber = content.whatsappNumber || CONFIG.WHATSAPP_NUMBER;
  const whatsappMsg = content.whatsappMsg || CONFIG.WHATSAPP_MSG;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  const fade = (delay: number) =>
    shouldReduceMotion
      ? { animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.25, 0, 0, 1] as const },
        };

  const highlights = [
    "Consulta rápida para contratação, rotina e desligamento",
    "Orientação preventiva para reduzir decisões improvisadas",
  ];

  return (
    <section className="hero-gradient section-grid grain-overlay relative overflow-hidden pt-20">
      {/* ambient glows */}
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-wine/10 blur-[110px] pointer-events-none" aria-hidden="true" />
      <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-primary/20 blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto">
        {/* flex-col on mobile → flex-row on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-16 py-20 lg:min-h-[calc(100dvh-5rem)] lg:py-24">

          {/* ── Text column ── */}
          <div className="relative z-10 flex-1 min-w-0">

            <motion.span
              {...fade(0.1)}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-wine/25 bg-white/[0.03] px-4 py-2 font-ui text-[0.68rem] tracking-[0.22em] text-wine"
            >
              {content.heroBadge}
            </motion.span>

            <motion.h1
              {...fade(0.2)}
              className="mb-7 font-display text-[2.2rem] font-semibold leading-[1.05] text-foreground sm:text-[2.85rem] lg:text-[3.5rem]"
            >
              {content.heroHeadline}
              <span className="block text-wine">que reduz risco</span>
              <span className="block text-off-white">antes do problema chegar.</span>
            </motion.h1>

            <motion.p
              {...fade(0.3)}
              className="mb-3 text-base leading-relaxed text-off-white/80 md:text-[1.05rem]"
            >
              Da contratação à rescisão, um guia direto para empresários que precisam decidir com mais segurança trabalhista.
            </motion.p>

            <motion.p
              {...fade(0.36)}
              className="mb-9 text-sm leading-relaxed text-text-muted"
            >
              Material objetivo para consulta rápida na rotina de gestão e DP.
            </motion.p>

            {/* Highlights — simple list, no cards */}
            <motion.ul {...fade(0.42)} className="mb-9 space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-wine" />
                  <span className="text-sm leading-relaxed text-off-white/75">{item}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              {...fade(0.48)}
              className="mb-6 flex flex-col gap-3 sm:flex-row"
            >
              <button
                onClick={handleAddToCart}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-gold hover:bg-gold-light active:bg-gold-dark px-7 text-center font-ui text-sm font-bold text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.45)] whitespace-nowrap cursor-pointer"
              >
                GARANTIR MEU ACESSO
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-md border border-gold/30 px-7 font-ui text-sm text-gold transition-all duration-200 hover:border-gold hover:bg-gold/5 whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                FALAR COM UM ESPECIALISTA
              </a>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              {...fade(0.54)}
              className="mb-10 flex flex-wrap items-center gap-4 text-xs text-text-muted"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Seus dados estão seguros. Sem spam.
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
              <span>Compra única e acesso imediato ao conteúdo.</span>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fade(0.6)}
              className="grid grid-cols-3 gap-6 border-t border-white/8 pt-7"
            >
              <div>
                <p className="font-display text-2xl text-off-white sm:text-3xl">
                  <CountUp to={12} suffix="+" />
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  tópicos críticos da rotina empregadora
                </p>
              </div>
              <div>
                <p className="font-display text-2xl text-off-white sm:text-3xl">
                  <CountUp to={5} suffix=" min" />
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  para localizar a orientação certa
                </p>
              </div>
              <div>
                <p className="font-display text-2xl text-off-white sm:text-3xl">
                  <CountUp to={100} suffix="%" />
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  foco em prevenção e clareza
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Book column ── */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: [0.25, 0, 0, 1] }}
            className="relative z-10 flex w-full justify-center shrink-0 lg:w-auto lg:justify-end"
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] xl:max-w-[440px]">
              {/* Premium badge */}
              <div className="absolute -right-3 -top-3 z-20 rounded-full border border-wine/25 bg-primary/90 px-3 py-1.5 font-ui text-[0.62rem] tracking-[0.2em] text-white shadow-[0_8px_24px_-6px_rgba(69,17,23,0.6)]">
                E-BOOK PREMIUM
              </div>

              <PerspectiveBook
                coverSrc={content.ebookCoverUrl || ebookCover}
                title="Manual do Empregador"
                eyebrow={undefined}
              />

              {/* Info card below book */}
              <motion.div
                {...fade(0.6)}
                className="mt-4 rounded-xl border border-white/8 bg-black/30 px-4 py-3 backdrop-blur-lg"
              >
                <p className="font-ui text-[0.65rem] tracking-[0.22em] text-wine">
                  CONTEÚDO ESTRATÉGICO
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-off-white/85">
                  Referência prática para consultar antes de contratar, remunerar ou desligar.
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
