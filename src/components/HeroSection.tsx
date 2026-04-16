import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, ShieldCheck } from "lucide-react";
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
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.05] px-4 py-2 font-ui text-[0.68rem] tracking-[0.22em] text-gold"
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
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
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
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-md px-7 text-center font-ui text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-8px_rgba(201,168,76,0.45)] whitespace-nowrap cursor-pointer" style={{ background: '#2d7a4f' }} onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background='#c9a84c'} onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background='#2d7a4f'}
              >
                GARANTIR MEU ACESSO
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-md border px-7 font-ui text-sm text-white transition-all duration-200 hover:brightness-110 hover:shadow-[0_8px_24px_-6px_rgba(45,122,79,0.45)] whitespace-nowrap cursor-pointer"
                style={{ borderColor: "#2d7a4f", background: "#2d7a4f" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
