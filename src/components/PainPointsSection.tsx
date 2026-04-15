import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Scale, DollarSign, ShieldAlert } from "lucide-react";

const painPoints = [
  { icon: Scale, problem: "Processos trabalhistas" },
  { icon: DollarSign, problem: "Multas e autuações" },
  { icon: AlertTriangle, problem: "Passivos financeiros" },
  { icon: ShieldAlert, problem: "Insegurança na gestão" },
];

const PainPointsSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 lg:py-32 section-dark">
      <div className="container mx-auto">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-wine text-balance mb-6">
            Se você tem funcionários, precisa prestar atenção nisso.
          </h2>
          <p className="text-off-white/80 text-lg font-body leading-relaxed max-w-3xl">
            Muitos empresários enfrentam problemas trabalhistas não por má intenção,
            mas por falta de conhecimento adequado sobre as obrigações trabalhistas.
          </p>
        </motion.div>

        <div className="border-l-2 border-wine/50 pl-6 mb-10">
          <p className="text-wine font-body font-semibold text-lg">
            Erros simples no dia a dia da empresa podem gerar:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-5 mb-16">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="surface-card p-6 rounded-lg flex items-center gap-4 hover:border-wine/20 transition-colors duration-300"
            >
              <div className="bg-background p-3 rounded-full shrink-0">
                <point.icon className="w-6 h-6 text-wine" strokeWidth={1.5} />
              </div>
              <p className="text-off-white font-display text-xl font-semibold">{point.problem}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-off-white/80 font-display text-xl md:text-2xl italic leading-relaxed max-w-3xl mx-auto">
            "E a maioria desses problemas poderia ser evitada com
            informação clara e orientação preventiva.
          </p>
          <p className="text-wine font-display text-xl md:text-2xl font-semibold mt-3">
            Foi exatamente por isso que criamos este material."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PainPointsSection;
