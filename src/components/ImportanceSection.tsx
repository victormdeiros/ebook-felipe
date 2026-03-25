import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, DollarSign, CheckCircle2 } from "lucide-react";

const importanceCards = [
  {
    icon: AlertTriangle,
    text: "A legislação trabalhista brasileira possui diversas regras e detalhes que muitas vezes passam despercebidos no dia a dia da gestão.",
  },
  {
    icon: DollarSign,
    text: "Pequenos erros podem gerar grandes prejuízos — processos, multas e passivos que comprometem a saúde financeira da empresa.",
  },
  {
    icon: CheckCircle2,
    text: "Empresas com postura preventiva reduzem riscos, organizam melhor seus processos e tomam decisões com mais segurança.",
    highlight: true,
  },
];

const ImportanceSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 lg:py-32 section-elevated relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance mx-auto max-w-4xl">
            Por que este material pode fazer diferença para sua empresa
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-16">
          {importanceCards.map((card, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`surface-card p-8 rounded-xl flex flex-col items-center text-center ${
                card.highlight ? "border-wine/20" : ""
              }`}
            >
              <div className="mb-6 bg-background p-4 rounded-full">
                <card.icon
                  className={`w-7 h-7 ${card.highlight ? "text-wine" : "text-off-white/70"}`}
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-off-white/80 font-body leading-relaxed text-sm sm:text-base">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center"
        >
          <p className="font-display text-2xl md:text-3xl text-off-white/80 italic max-w-3xl mx-auto leading-relaxed">
            "Mais do que informar, este material ajuda a estruturar uma rotina trabalhista mais segura, clara e economicamente responsavel para a empresa."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImportanceSection;
