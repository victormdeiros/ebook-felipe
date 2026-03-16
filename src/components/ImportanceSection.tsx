import { motion } from "framer-motion";

const ImportanceSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-ui text-xs text-accent tracking-widest mb-4 block">Importância</span>
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance mb-8">
              Por que este material pode fazer diferença para sua empresa
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground leading-relaxed">
              A legislação trabalhista brasileira possui diversas regras e detalhes que muitas vezes passam despercebidos no dia a dia da gestão empresarial.
            </p>
            <p className="text-foreground text-xl font-display font-semibold">
              Pequenos erros podem gerar grandes prejuízos.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Por outro lado, empresas que adotam uma postura preventiva conseguem reduzir riscos, organizar melhor seus processos internos e tomar decisões com mais segurança.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Este e-book foi criado justamente para ajudar empresários a dar esse primeiro passo.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImportanceSection;
