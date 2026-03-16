import { motion } from "framer-motion";
import logoIcon from "@/assets/logo-icon.png";

const AboutSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-ui text-xs text-accent tracking-widest mb-4 block">O Escritório</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
            Quem preparou este material
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-0 items-stretch max-w-5xl">
          {/* Image / Logo side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-card rounded-l-xl flex items-center justify-center p-16"
          >
            <img src={logoIcon} alt="Felipe Lopes Advogados" className="w-40 md:w-56 opacity-80" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-l border-accent/30 pl-10 lg:pl-16 py-12 flex flex-col justify-center"
          >
            <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
              Felipe Lopes Advogados
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O escritório Felipe Lopes Advogados atua na orientação jurídica de empresas e empresários, auxiliando na prevenção de riscos e na construção de uma gestão empresarial mais segura.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Com experiência na área trabalhista e empresarial, o escritório acompanha de perto as principais demandas enfrentadas pelos empresários no dia a dia.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Foi justamente a partir dessa experiência prática que surgiu a ideia de criar este e-book: um material acessível que reúne orientações jurídicas importantes para quem precisa lidar com funcionários e relações de trabalho dentro da empresa.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
