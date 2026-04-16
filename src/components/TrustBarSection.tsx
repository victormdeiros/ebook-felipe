import { motion, useReducedMotion } from "framer-motion";
import { Scale, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";

const trustItems = [
  { icon: Scale, text: "Elaborado por especialistas trabalhistas" },
  { icon: FileText, text: "Linguagem clara e acessível" },
  { icon: ShieldCheck, text: "Prevenção de riscos para sua empresa" },
  { icon: CheckCircle2, text: "Guia atualizado com a legislação vigente" },
];

const TrustBarSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative section-elevated py-6 sm:py-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-center gap-3 min-h-[44px]"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded border border-gold/20 bg-gold/[0.06]">
                <item.icon className="w-4 h-4 text-gold" strokeWidth={1.5} />
              </div>
              <span className="text-off-white/80 text-sm leading-snug font-body">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />
    </section>
  );
};

export default TrustBarSection;
