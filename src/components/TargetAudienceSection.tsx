import { motion } from "framer-motion";
import { Briefcase, Building, Rocket, Shield, ClipboardCheck } from "lucide-react";

const audiences = [
  { icon: Briefcase, text: "Empresários que possuem funcionários" },
  { icon: Building, text: "Gestores de pequenas e médias empresas" },
  { icon: Rocket, text: "Empreendedores em fase de crescimento" },
  { icon: Shield, text: "Empresas que desejam prevenir problemas trabalhistas" },
  { icon: ClipboardCheck, text: "Gestores que querem organizar melhor sua equipe" },
];

const TargetAudienceSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-gold text-balance">
            Este material é especialmente útil para:
          </h2>
        </motion.div>

        {/* Using a custom grid to fit 5 items (3 top, 2 bottom centered conceptually) */}
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-16">
          {audiences.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-support border border-primary p-8 rounded-xl flex flex-col items-center text-center w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] hover:border-gold hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-support-dark p-4 rounded-full mb-6 relative">
                <div className="absolute inset-0 border border-gold/30 rounded-full scale-110"></div>
                <item.icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </div>
              <span className="text-off-white font-body text-base font-medium">{item.text}</span>
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
          <p className="text-off-white/80 font-body text-lg max-w-2xl mx-auto">
            Se você possui funcionários ou pretende contratar, este material pode ajudar a tornar sua gestão mais segura.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
