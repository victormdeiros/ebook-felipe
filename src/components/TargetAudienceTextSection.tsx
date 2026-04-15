import { motion, useReducedMotion } from "framer-motion";

const TargetAudienceTextSection = () => {
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
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-wine text-balance">
            PARA QUEM É ESTE EBOOK?
          </h2>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6 text-off-white/80 font-body leading-relaxed text-base lg:text-lg max-w-3xl mx-auto"
        >
          <p>
            O presente Manual tem por objetivo instruir a pessoa do empregador, trazendo, de forma clara e objetiva, orientações acerca da sua relação com o empregado, almejando garantir a concretização dos direitos e o adimplemento das obrigações existentes na relação empregatícia.
          </p>
          <p>
            Ademais, o conteúdo ora apresentado enseja sanar as principais dúvidas existentes no âmbito do Departamento Pessoal e da Segurança e Saúde do Trabalhador e do ambiente de trabalho, permitindo que, com a observância e cumprimento dos preceitos legais, demandas judiciais sejam evitadas, precavendo a atividade empresarial do surgimento de passivos que trazem prejuízos à operação.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TargetAudienceTextSection;
