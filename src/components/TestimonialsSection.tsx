import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    initial: "M",
    name: "Marcos Andrade",
    role: "Sócio-diretor, Empresa de Logística",
    text: "\"Antes do material, tomávamos decisões trabalhistas no improviso. Depois de ler o Manual do Empregador, conseguimos organizar nossos processos internos e reduzir significativamente o risco de problemas com a equipe.\"",
  },
  {
    initial: "C",
    name: "Carla Mendes",
    role: "Gestora de RH, Comércio Varejista",
    text: "\"Material direto ao ponto. Consegui entender de forma clara quais documentos a empresa precisa manter e como agir corretamente diante de situações cotidianas com os colaboradores.\"",
  },
  {
    initial: "R",
    name: "Roberto Silva",
    role: "Empreendedor, Pequena Empresa",
    text: "\"Recomendo para qualquer empresário que tenha funcionários. O conteúdo é acessível mesmo para quem não tem formação jurídica, e o escritório Felipe Lopes é referência em orientação preventiva.\"",
  },
];

const Stars = () => (
  <div className="flex gap-0.5 mb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
    ))}
  </div>
);

const TestimonialsSection = () => {
  return (
    <section
      data-optional="true"
      className="py-24 lg:py-32 bg-support"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="font-ui text-xs text-gold tracking-widest mb-4 block uppercase font-bold">Depoimentos</span>
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-off-white text-balance">
            Empresários que confiam no nosso trabalho
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-support-dark border-t-2 border-gold rounded-xl p-8 flex flex-col shadow-lg"
            >
              <Stars />
              <p className="text-off-white/80 font-body text-sm leading-relaxed italic mb-8 flex-1">
                {t.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/80 border border-gold/30 flex items-center justify-center shrink-0">
                  <span className="font-display text-gold font-bold text-lg">{t.initial}</span>
                </div>
                <div>
                  <p className="text-off-white text-sm font-semibold">{t.name}</p>
                  <p className="text-secondary-light font-body text-xs mt-0.5">{t.role}</p>
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
