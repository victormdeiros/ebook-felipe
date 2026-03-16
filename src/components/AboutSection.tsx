import { motion } from "framer-motion";
import felipePhoto from "@/assets/felipe-lopes.png";

const AboutSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-support-dark relative overflow-hidden">
      {/* Decorative vertical line */}
      <div className="hidden lg:block absolute left-1/2 top-1/4 bottom-1/4 w-px bg-gold/60 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-gold text-balance">
            Quem preparou este material
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-6xl mx-auto">
          {/* Image / Placeholder side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center relative"
          >
            {/* CSS decorative border trick */}
            <div className="absolute -left-4 -bottom-4 w-32 h-32 border-b-2 border-l-2 border-gold rounded-bl-3xl pointer-events-none" />
            
            <div className="w-full max-w-md aspect-[4/5] bg-primary rounded-xl flex items-center justify-center shadow-2xl overflow-hidden relative group">
              <img src={felipePhoto} alt="Dr. Felipe Lopes" className="w-full h-full object-cover relative z-0 transition-transform duration-700 hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 z-10 pointer-events-none" />
            </div>
            
            <div className="mt-6 text-center">
              <p className="font-body font-semibold text-off-white text-lg">Dr. Felipe Lopes</p>
              <p className="text-secondary-light font-body text-sm">Fundador | Felipe Lopes Advogados</p>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex max-w-max mb-6">
              <span className="font-ui text-[10px] sm:text-xs text-gold border border-gold/40 px-3 py-1 rounded-full bg-gold/10">
                Por Felipe Lopes
              </span>
            </div>
            
            <div className="space-y-6 text-off-white font-body leading-relaxed text-base md:text-lg">
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
