import { motion } from "framer-motion";
import { AlertTriangle, Scale, DollarSign, ShieldAlert } from "lucide-react";

const painPoints = [
  { icon: Scale, problem: "Processos trabalhistas", risk: "Custos jurídicos elevados e condenações inesperadas" },
  { icon: DollarSign, problem: "Multas e autuações", risk: "Penalidades financeiras por descumprimento da legislação" },
  { icon: AlertTriangle, problem: "Passivos financeiros", risk: "Riscos ocultos que comprometem o caixa da empresa" },
  { icon: ShieldAlert, problem: "Insegurança na gestão", risk: "Decisões tomadas sem respaldo jurídico adequado" },
];

const PainPointsSection = () => {
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
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance mb-6">
            Se você tem funcionários, precisa prestar atenção nisso.
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Muitos empresários enfrentam problemas trabalhistas não por má intenção, mas por falta de orientação jurídica adequada.
            Erros simples no dia a dia da empresa podem gerar:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="surface-card p-8 rounded-xl"
            >
              <point.icon className="w-6 h-6 text-accent mb-6" strokeWidth={1.5} />
              <p className="text-muted-foreground text-sm mb-2">{point.problem}</p>
              <p className="text-primary font-display text-lg font-semibold">{point.risk}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 max-w-2xl"
        >
          <p className="text-muted-foreground leading-relaxed">
            E a maioria desses problemas poderia ser evitada com informação clara e orientação preventiva.
          </p>
          <p className="text-foreground font-semibold mt-4">
            Foi exatamente por isso que criamos este material.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PainPointsSection;
