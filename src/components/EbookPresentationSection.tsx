import { motion } from "framer-motion";
import ebookMockup from "@/assets/ebook-mockup.png";

const EbookPresentationSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <img
              src={ebookMockup}
              alt="Manual do Empregador Inteligente"
              className="w-[280px] md:w-[360px] drop-shadow-[0_20px_50px_rgba(62,21,23,0.3)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="font-ui text-xs text-accent tracking-widest mb-4 block">O Material</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance mb-6">
              Apresentamos o Manual do Empregador Inteligente
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Este e-book foi desenvolvido para ajudar empresários a compreender, de forma simples e prática, as principais regras trabalhistas que impactam a gestão de funcionários dentro de uma empresa.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Ao longo do material, você encontrará orientações jurídicas fundamentais que podem ajudar a evitar erros comuns e reduzir riscos trabalhistas.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EbookPresentationSection;
