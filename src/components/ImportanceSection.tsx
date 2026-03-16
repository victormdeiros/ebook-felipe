import { motion } from "framer-motion";
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
  return (
    <section
      className="py-24 lg:py-32"
      style={{ background: "linear-gradient(to bottom, #000000, #3A3839)" }}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-gold text-balance mx-auto">
            Por que este material pode fazer diferença para sua empresa
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {importanceCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-support border-t-[3px] border-t-primary p-8 rounded-b-xl rounded-t-sm shadow-xl flex flex-col items-center text-center"
            >
              <div className="mb-6 bg-support-dark p-4 rounded-full border border-white/5">
                <card.icon 
                  className={`w-8 h-8 ${card.highlight ? 'text-gold fill-gold/10 scale-110 drop-shadow-[0_0_10px_rgba(201,168,76,0.6)]' : 'text-off-white'}`} 
                  strokeWidth={1.5} 
                />
              </div>
              <p className="text-off-white font-body leading-relaxed">
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="font-display text-2xl md:text-3xl text-off-white italic max-w-3xl mx-auto">
            "Este e-book foi criado para ajudar empresários a dar esse primeiro passo."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ImportanceSection;
