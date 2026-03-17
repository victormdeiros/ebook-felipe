import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, ShieldCheck } from "lucide-react";
import ebookMockup from "@/assets/ebook-mockup.png";
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

  return (
    <section className="hero-gradient relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Subtle vertical accent lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, rgba(200,121,124,0.4) 0px, rgba(200,121,124,0.4) 1px, transparent 1px, transparent 140px)`,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        {/* Left — Text */}
        <div className="flex-1 z-10">
          <motion.span
            {...fade(0.1)}
            className="inline-flex items-center gap-2 border border-wine/25 text-wine font-ui text-xs tracking-[0.2em] px-5 py-2.5 rounded-full mb-8"
          >
            {content.heroBadge}
          </motion.span>

          <motion.h1
            {...fade(0.2)}
            className="font-display text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight text-foreground text-balance leading-[1.05] mb-6"
          >
            Manual do
            <br />
            <span className="text-wine italic">Empregador</span>
          </motion.h1>

          <motion.h2
            {...fade(0.32)}
            className="text-lg md:text-xl text-off-white/75 leading-relaxed mb-4 max-w-lg font-body"
          >
            {content.heroSubheadline}
          </motion.h2>

          <motion.p
            {...fade(0.38)}
            className="text-base text-muted-foreground leading-relaxed mb-10 max-w-lg font-body"
          >
            {content.heroBody}
          </motion.p>

          <motion.div
            {...fade(0.48)}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <a
              href="#comprar"
              className="font-ui font-bold text-sm bg-wine hover:bg-wine-light text-background px-8 min-h-[48px] rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_rgba(200,121,124,0.35)] text-center flex items-center justify-center whitespace-nowrap"
            >
              {content.heroCta}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-sm border border-white/10 text-off-white hover:border-wine/40 hover:text-wine px-8 min-h-[48px] rounded-md transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              FALAR COM UM ADVOGADO
            </a>
          </motion.div>

          <motion.div
            {...fade(0.55)}
            className="flex items-center gap-4 text-secondary-light text-xs font-body"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Seus dados estão seguros. Sem spam.
            </span>
          </motion.div>
        </div>

        {/* Right — Ebook Mockup */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0, 0, 1] }}
          className="flex-1 w-full order-first md:order-last flex justify-center md:justify-end"
        >
          <div className="relative">
            {/* Ambient glow */}
            <div
              className="absolute inset-0 -m-16 rounded-full bg-wine-dim blur-[70px] pointer-events-none"
              aria-hidden="true"
            />

            {/* Seal badge */}
            <div className="absolute -top-4 -right-4 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-wine flex items-center justify-center shadow-[0_4px_20px_rgba(200,121,124,0.4)] border-4 border-background">
              <span className="font-ui text-[10px] sm:text-xs text-background font-bold leading-tight text-center">
                GUIA<br />PRÁTICO
              </span>
            </div>

            {/* Ebook render */}
            <img
              src={ebookMockup}
              alt="Manual do Empregador - E-book"
              width={480}
              height={640}
              className="relative z-10 w-[260px] sm:w-[300px] md:w-[380px] lg:w-[440px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]"
            />

            {/* Floor shadow */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-black/50 blur-xl rounded-[100%] scale-y-[0.3]" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
