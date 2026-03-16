import { motion } from "framer-motion";
import { Building2, Users, TrendingUp, Shield, ClipboardList } from "lucide-react";

const audiences = [
  { icon: Building2, text: "Empresários que possuem funcionários" },
  { icon: Users, text: "Gestores de pequenas e médias empresas" },
  { icon: TrendingUp, text: "Empreendedores em fase de crescimento" },
  { icon: Shield, text: "Empresas que desejam prevenir problemas trabalhistas" },
  { icon: ClipboardList, text: "Gestores que querem organizar melhor sua equipe" },
];

const TargetAudienceSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <span className="font-ui text-xs text-accent tracking-widest mb-4 block">Para quem é</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
            Este material é especialmente útil para:
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {audiences.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-4 p-6 surface-card rounded-xl"
            >
              <item.icon className="w-5 h-5 text-accent shrink-0" strokeWidth={1.5} />
              <span className="text-foreground text-sm">{item.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-muted-foreground max-w-2xl"
        >
          Se você possui funcionários ou pretende contratar, este material pode ajudar a tornar sua gestão mais segura.
        </motion.p>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
