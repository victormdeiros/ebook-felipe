import { motion, useReducedMotion } from "framer-motion";
import ebookMockup from "@/assets/ebook-mockup.png";

const EbookPresentationSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="manual" className="py-24 lg:py-32 section-elevated overflow-hidden relative">
      {/* Decorative wine divider at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-[3.2rem] font-semibold tracking-tight text-wine text-balance mb-8 leading-tight">
            Apresentamos o Manual do
            <br className="hidden sm:block" />
            Empregador Inteligente
          </h2>
          <p className="text-off-white/80 text-lg font-body leading-relaxed md:text-xl max-w-3xl mx-auto">
            Este e-book foi desenvolvido para ajudar empresários a compreender,
            de forma simples e prática, as principais regras trabalhistas que
            impactam a gestão de funcionários dentro de uma empresa.
          </p>
          <p className="text-muted-foreground text-lg font-body leading-relaxed mt-6 max-w-3xl mx-auto">
            Ao longo do material, você encontrará orientações jurídicas fundamentais
            que podem ajudar a evitar erros comuns e reduzir riscos trabalhistas.
          </p>
        </motion.div>

        {/* Ebook mockup */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center relative"
        >
          <div className="relative">
            <div
              className="absolute inset-0 -m-20 rounded-full bg-wine-dim blur-[90px] pointer-events-none"
              aria-hidden="true"
            />
            <img
              src={ebookMockup}
              alt="Manual do Empregador"
              width={600}
              height={800}
              loading="lazy"
              className="relative z-10 w-[300px] md:w-[440px] lg:w-[520px] drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]"
            />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[75%] h-8 bg-black/50 blur-xl rounded-[100%] scale-y-[0.3]" aria-hidden="true" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EbookPresentationSection;
