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
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <span className="font-ui text-xs text-accent tracking-widest mb-4 block">Conteúdo</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
            O que você vai aprender neste material
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
          {learningPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-start gap-4 p-4 surface-card rounded-lg"
            >
              <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" strokeWidth={2} />
              <span className="text-foreground text-sm leading-relaxed tabular-nums">{point}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-accent font-semibold text-lg"
        >
          Tudo isso explicado de forma clara, prática e direta.
        </motion.p>
      </div>
    </section>
  );
};

export default LearningSection;
