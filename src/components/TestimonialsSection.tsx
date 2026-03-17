import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    initial: "M",
    name: "Marcos Andrade",
    role: "Sócio-diretor, Empresa de Logística",
    stars: 5,
    text: "\"Antes do material, tomávamos decisões trabalhistas no improviso. Depois de ler o Manual do Empregador, conseguimos organizar nossos processos internos e reduzir significativamente o risco de problemas com a equipe.\"",
  },
  {
    initial: "C",
    name: "Carla Mendes",
    role: "Gestora de RH, Comércio Varejista",
    stars: 5,
    text: "\"Material direto ao ponto. Consegui entender de forma clara quais documentos a empresa precisa manter e como agir corretamente diante de situações cotidianas com os colaboradores.\"",
  },
  {
    initial: "R",
    name: "Roberto Silva",
    role: "Empreendedor, Pequena Empresa",
    stars: 4,
    text: "\"Recomendo para qualquer empresário que tenha funcionários. O conteúdo é acessível mesmo para quem não tem formação jurídica, e o escritório Felipe Lopes é referência em orientação preventiva.\"",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 mb-4" aria-label={`${count} de 5 estrelas`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? "fill-wine text-wine" : "text-white/10"}`}
      />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="depoimentos" className="py-24 lg:py-32 section-dark relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="font-ui text-xs text-wine tracking-[0.2em] mb-4 block">
            DEPOIMENTOS
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-wine text-balance">
            Empresários que confiam no nosso trabalho
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="surface-card rounded-xl p-8 flex flex-col"
            >
              <Stars count={t.stars} />
              <p className="text-off-white/70 font-body text-sm leading-relaxed italic mb-8 flex-1">
                {t.text}
              </p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-11 h-11 rounded-full bg-primary/60 border border-wine/20 flex items-center justify-center shrink-0">
                  <span className="font-display text-wine font-bold text-lg">{t.initial}</span>
                </div>
                <div>
                  <p className="text-off-white text-sm font-semibold font-body">{t.name}</p>
                  <p className="text-muted-foreground font-body text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
