import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Building, Rocket, Shield, ClipboardCheck } from "lucide-react";

const audiences = [
  { icon: Briefcase, text: "Empresários que possuem funcionários" },
  { icon: Building, text: "Gestores de pequenas e médias empresas" },
  { icon: Rocket, text: "Empreendedores em fase de crescimento" },
  { icon: Shield, text: "Empresas que desejam prevenir problemas trabalhistas" },
  { icon: ClipboardCheck, text: "Gestores que querem organizar melhor sua equipe" },
];

const TargetAudienceSection = () => {
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
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance">
            Este material é especialmente útil para:
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-16">
          {audiences.map((item, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="surface-card p-8 rounded-xl flex flex-col items-center text-center hover:border-wine/15 transition-colors duration-300"
            >
              <div className="relative mb-6">
                <div className="bg-background p-4 rounded-full">
                  <item.icon className="w-7 h-7 text-wine" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 border border-wine/20 rounded-full scale-[1.2]" aria-hidden="true" />
              </div>
              <span className="text-off-white/85 font-body text-base font-medium leading-snug">{item.text}</span>
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
          <p className="text-off-white/60 font-body text-lg max-w-2xl mx-auto">
            Se você possui funcionários ou pretende contratar, este material pode ajudar a tornar sua gestão mais segura.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
