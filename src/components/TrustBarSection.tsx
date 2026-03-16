import { motion } from "framer-motion";
import { Scale, FileText, ShieldCheck, CheckCircle2 } from "lucide-react";

const trustItems = [
  { icon: Scale, text: "Elaborado por especialistas trabalhistas" },
  { icon: FileText, text: "Linguagem clara e acessível" },
  { icon: ShieldCheck, text: "Prevenção de riscos para sua empresa" },
  { icon: CheckCircle2, text: "Guia atualizado com a legislação vigente" },
];

const TrustBarSection = () => {
  return (
    <section className="relative bg-support border-y border-gold/40 py-8">
      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
      {/* Gold bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <item.icon className="w-5 h-5 text-gold shrink-0 border border-gold/20 rounded-md p-0.5" strokeWidth={1.5} />
              <span className="text-off-white text-sm leading-tight font-body">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBarSection;
