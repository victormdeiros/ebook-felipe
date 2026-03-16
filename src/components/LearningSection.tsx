import { motion } from "framer-motion";
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
  return (
    <section className="py-24 lg:py-32 bg-support">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12 text-center mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-gold text-balance mb-4">
            O que você vai aprender neste material
          </h2>
          <p className="text-secondary-light font-body text-lg">
            Tudo isso explicado de forma clara, prática e direta.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {learningPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-4 p-6 bg-support-dark rounded-lg border-l-4 border-transparent hover:border-gold hover:-translate-y-1 transition-all duration-300 shadow-md"
            >
              <div className="bg-support p-1.5 rounded-full shrink-0">
                <Check className="w-5 h-5 text-gold" strokeWidth={2.5} />
              </div>
              <span className="text-off-white font-body text-[15px] leading-relaxed mt-1">{point}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <a
            href="#comprar"
            className="inline-block font-ui font-bold text-sm bg-gold hover:bg-gold-light text-background px-10 py-5 rounded-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-5px_rgba(201,168,76,0.4)]"
          >
            QUERO ADQUIRIR O E-BOOK →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningSection;
