import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

const learningPoints = [
  "Quais são os documentos essenciais que toda empresa precisa ter",
  "Como contratar funcionários corretamente",
  "O que diz a legislação sobre jornada de trabalho",
  "Como lidar com horas extras, faltas e atrasos",
  "Quais exames médicos são obrigatórios",
  "Como organizar corretamente o controle de ponto",
  "O que fazer diante de atestados médicos",
  "Como reduzir riscos de processos trabalhistas",
];

const LearningSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="conteudo" className="py-24 lg:py-32 section-dark relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-14 text-center mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance mb-4">
            O que você vai aprender neste material
          </h2>
          <p className="text-muted-foreground font-body text-lg">
            Tudo isso explicado de forma clara, prática e direta.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 max-w-5xl mx-auto">
          {learningPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="flex items-start gap-4 p-5 lg:p-6 surface-card rounded-lg group hover:border-wine/15 transition-colors duration-300"
            >
              <div className="bg-wine/10 p-1.5 rounded-full shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-wine" strokeWidth={2.5} />
              </div>
              <span className="text-off-white/85 font-body text-sm sm:text-base leading-relaxed">{point}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <a
            href="#comprar"
            className="inline-flex items-center justify-center font-ui font-bold text-sm bg-wine hover:bg-wine-light text-background px-10 min-h-[52px] rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_rgba(200,121,124,0.35)]"
          >
            QUERO ADQUIRIR O E-BOOK
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningSection;
