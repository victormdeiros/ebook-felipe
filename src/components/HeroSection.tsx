import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck } from "lucide-react";
import ebookMockup from "@/assets/ebook-mockup.png";
import { CountUp } from "@/components/ui/count-up";
import { PerspectiveBook } from "@/components/ui/perspective-book";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { CONFIG } from "@/config";
import { getContent } from "@/lib/contentStore";

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const content = getContent();
  const whatsappNumber = content.whatsappNumber || CONFIG.WHATSAPP_NUMBER;
  const whatsappMsg = content.whatsappMsg || CONFIG.WHATSAPP_MSG;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

  const fade = (delay: number) =>
    shouldReduceMotion
      ? { animate: { opacity: 1 } }
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, delay, ease: [0.25, 0, 0, 1] as const } };

  const highlights = [
    "Consulta rápida para contratação, rotina e desligamento",
    "Orientação preventiva para reduzir decisões improvisadas",
  ];

  return (
    <section className="hero-gradient section-grid grain-overlay relative min-h-screen overflow-hidden pt-20">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, rgba(169,52,69,0.45) 0px, rgba(169,52,69,0.45) 1px, transparent 1px, transparent 164px)`,
        }}
        aria-hidden="true"
      />

      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-wine/10 blur-[110px]" aria-hidden="true" />
      <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-primary/20 blur-[120px]" aria-hidden="true" />

      <div className="container mx-auto flex min-h-[calc(100vh-5rem)] items-center px-6 py-12 lg:px-12 lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.9fr)] lg:gap-8">
          <div className="relative z-10 max-w-xl">
          <motion.span
            {...fade(0.1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-wine/25 bg-white/[0.03] px-4 py-2 font-ui text-[0.68rem] tracking-[0.22em] text-wine"
          >
            {content.heroBadge}
          </motion.span>

          <motion.h1
            {...fade(0.2)}
            className="max-w-[12ch] text-balance font-display text-[2.35rem] font-semibold leading-[0.98] text-foreground sm:text-[3rem] lg:text-[3.7rem]"
          >
            {content.heroHeadline}
            <span className="block text-wine">que reduz risco</span>
            <span className="block text-off-white">antes do problema chegar.</span>
          </motion.h1>

          <motion.h2
            {...fade(0.32)}
            className="mb-4 max-w-[38rem] text-base leading-relaxed text-text-secondary md:text-[1.12rem]"
          >
            Da contratação à rescisão, um guia direto para empresários que precisam decidir com mais segurança trabalhista.
          </motion.h2>

          <motion.p
            {...fade(0.38)}
            className="mb-6 max-w-[36rem] text-sm leading-relaxed text-text-muted md:text-base"
          >
            Material objetivo para consulta rápida na rotina de gestão e RH.
          </motion.p>

          <motion.div {...fade(0.42)} className="mb-6 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <SpotlightCard key={item} className="min-h-[118px] rounded-[1.35rem] border-white/6 bg-white/[0.025] p-4">
                <BadgeCheck className="mb-3 h-5 w-5 text-wine" />
                <p className="text-sm leading-relaxed text-text-secondary">{item}</p>
              </SpotlightCard>
            ))}
          </motion.div>

          <motion.div
            {...fade(0.48)}
            className="mb-6 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#comprar"
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-wine px-7 text-center font-ui text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-light hover:shadow-[0_14px_34px_-8px_rgba(138,34,48,0.45)] whitespace-nowrap"
            >
              {content.heroCta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-md border border-white/10 px-7 font-ui text-sm text-off-white transition-all duration-200 hover:border-wine/40 hover:text-wine whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              FALAR COM UM ADVOGADO
            </a>
          </motion.div>

          <motion.div
            {...fade(0.55)}
            className="mb-6 flex flex-wrap items-center gap-4 text-xs text-text-secondary"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Seus dados estão seguros. Sem spam.
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
            <span>Compra única e acesso imediato ao conteúdo.</span>
          </motion.div>

            <motion.div {...fade(0.6)} className="grid gap-4 border-t border-white/8 pt-5 sm:grid-cols-3">
              <div>
                <p className="font-display text-2xl text-off-white sm:text-3xl">
                  <CountUp to={12} suffix="+" />
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">tópicos críticos da rotina empregadora</p>
              </div>
              <div>
                <p className="font-display text-2xl text-off-white sm:text-3xl">
                  <CountUp to={5} suffix=" min" />
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">para localizar a orientação certa</p>
              </div>
              <div>
                <p className="font-display text-2xl text-off-white sm:text-3xl">
                  <CountUp to={100} suffix="%" />
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">foco em prevenção e clareza</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, x: 18 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0, 0, 1] }}
            className="relative order-first flex w-full justify-center lg:order-last lg:justify-end"
          >
            <div className="relative w-full max-w-[30rem]">
              <div className="absolute inset-x-[8%] top-10 h-[70%] rounded-[2.35rem] border border-white/8 bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-md" aria-hidden="true" />
              <div className="absolute right-2 top-2 rounded-full border border-wine/25 bg-primary/90 px-4 py-2 font-ui text-[0.66rem] tracking-[0.2em] text-white shadow-[0_10px_30px_-8px_rgba(69,17,23,0.55)]">
                E-BOOK PREMIUM
              </div>

              <PerspectiveBook
                coverSrc={content.ebookCoverUrl || ebookMockup}
                title="Manual do Empregador"
                eyebrow="Felipe Lopes Advogados"
                className="mx-auto pt-10"
              />

              <motion.div
                {...fade(0.55)}
                className="relative -mt-2 mx-auto max-w-[25rem] rounded-[1.4rem] border border-white/8 bg-black/35 p-4 backdrop-blur-xl"
              >
                <p className="font-ui text-[0.7rem] tracking-[0.22em] text-wine">CONTEÚDO ESTRATÉGICO</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-off-white">Referência prática para consultar antes de contratar, remunerar ou desligar.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
