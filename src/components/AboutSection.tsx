import { motion, useReducedMotion } from "framer-motion";
import felipePhoto from "@/assets/felipe-lopes.png";

const AboutSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="autor" className="py-24 lg:py-32 section-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance">
            Quem preparou este material
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Photo */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center relative"
          >
            <div className="absolute -left-3 -bottom-3 w-28 h-28 border-b-2 border-l-2 border-wine/40 rounded-bl-2xl pointer-events-none" aria-hidden="true" />

            <div className="w-full max-w-md aspect-[4/5] bg-support rounded-xl overflow-hidden relative shadow-2xl">
              <img
                src={felipePhoto}
                alt="Dr. Felipe Lopes"
                width={400}
                height={500}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="mt-6 text-center">
              <p className="font-display font-semibold text-off-white text-xl">Dr. Felipe Lopes</p>
              <p className="text-muted-foreground font-body text-sm mt-1">Fundador | Felipe Lopes Advogados</p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex max-w-max mb-6">
              <span className="font-ui text-xs text-wine border border-wine/25 px-4 py-1.5 rounded-full">
                Por Felipe Lopes
              </span>
            </div>

            <div className="space-y-5 text-off-white/80 font-body leading-relaxed text-base lg:text-lg">
              <p>
                O escritório Felipe Lopes Advogados atua há uma década na orientação jurídica de empresas e empresários, construindo uma sólida trajetória de confiança e excelência no atendimento jurídico.
              </p>
              <p>
                Somos um escritório Full Service com atuação nacional, especializado em assessoria e consultoria em todas as áreas do Direito, com unidades físicas em Recife, Natal, São Paulo e Brasília.
              </p>
              <p>
                Nossa abordagem é preventiva: identificamos problemas antes de se tornarem litígios e antecipamos soluções para garantir uma gestão jurídica eficiente para nossos clientes.
              </p>
              <p>
                Foi justamente a partir dessa experiência prática — acompanhando as principais demandas dos empresários no dia a dia — que surgiu a ideia de criar este e-book.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
