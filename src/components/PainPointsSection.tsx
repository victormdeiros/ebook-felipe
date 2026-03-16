import { motion } from "framer-motion";
import { AlertTriangle, Scale, DollarSign, ShieldAlert } from "lucide-react";

const painPoints = [
  { icon: Scale, problem: "Processos trabalhistas" },
  { icon: DollarSign, problem: "Multas e autuações" },
  { icon: AlertTriangle, problem: "Passivos financeiros" },
  { icon: ShieldAlert, problem: "Insegurança na gestão" },
];

const PainPointsSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-support-dark">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-gold text-balance mb-6">
            Se você tem funcionários, precisa prestar atenção nisso.
          </h2>
          <p className="text-off-white text-lg font-body leading-relaxed max-w-3xl">
            Muitos empresários enfrentam problemas trabalhistas não por má intenção,
            mas por falta de orientação jurídica adequada.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-support/60 border-l-4 border-gold p-6 rounded-r-lg mb-10"
        >
          <p className="text-gold font-body font-semibold text-lg">
            Erros simples no dia a dia da empresa podem gerar:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-16">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-support border border-primary p-6 rounded-lg flex items-center gap-4 hover:border-gold transition-colors duration-300"
            >
              <div className="bg-support-dark p-3 rounded-full shrink-0">
                <point.icon className="w-6 h-6 text-gold" strokeWidth={1.5} />
              </div>
              <p className="text-off-white font-display text-xl font-semibold">{point.problem}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-off-white font-display text-xl md:text-2xl italic leading-relaxed max-w-3xl mx-auto">
            "E a maioria desses problemas poderia ser evitada com
            informação clara e orientação preventiva.<br />
            <span className="text-gold mt-2 block not-italic font-semibold">Foi exatamente por isso que criamos este material."</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PainPointsSection;
