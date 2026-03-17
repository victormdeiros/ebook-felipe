import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    text: "O material nos ajudou a organizar rotinas que antes dependiam de memória e improviso. Hoje a operação consulta o e-book antes de decidir.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Marcos Andrade",
    role: "Sócio-diretor, Empresa de Logística",
  },
  {
    text: "Conseguimos revisar documentos e procedimentos com mais confiança. A leitura é objetiva e faz sentido para quem está no dia a dia da empresa.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Carla Mendes",
    role: "Gestora de RH, Comércio Varejista",
  },
  {
    text: "Para quem não é do jurídico, o conteúdo é especialmente útil. Ele traduz o risco trabalhista para uma linguagem de gestão.",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
    name: "Roberto Silva",
    role: "Empreendedor, Pequena Empresa",
  },
  {
    text: "O e-book nos deu um roteiro para decisões mais consistentes em admissões, férias e desligamentos. Isso reduz desgaste e acelera o trabalho interno.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Ana Paula Ribeiro",
    role: "Diretora Administrativa",
  },
  {
    text: "A estrutura é muito boa para consulta rápida. Quando surge uma dúvida, encontramos o ponto central sem interromper a operação por muito tempo.",
    image: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "Lucas Fernandes",
    role: "Administrador, Rede de Serviços",
  },
  {
    text: "A maior diferença foi ganhar previsibilidade. O material ajuda a agir antes do problema, e não depois que a situação já escalou.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    name: "Tatiane Costa",
    role: "Coordenadora de Pessoas",
  },
  {
    text: "It gave our team more confidence to standardize decisions and communicate internal procedures with clarity.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
  {
    text: "O conteúdo não tenta impressionar com juridiquês. Ele resolve dúvidas reais de quem precisa contratar e gerenciar equipe com responsabilidade.",
    image: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Juliana Barros",
    role: "CEO, Operação Regional",
  },
  {
    text: "Usando o manual como referência, nossa tomada de decisão ficou mais rápida e muito mais segura do ponto de vista preventivo.",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    name: "Eduardo Nascimento",
    role: "Diretor Operacional",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Stars = () => (
  <div className="mb-4 flex gap-0.5" aria-label="5 de 5 estrelas">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-wine text-wine" />
    ))}
  </div>
);

const TestimonialsColumn = ({
  testimonials,
  duration,
  className,
  shouldReduceMotion,
}: {
  testimonials: typeof firstColumn;
  duration: number;
  className?: string;
  shouldReduceMotion: boolean;
}) => {
  const items = [...testimonials, ...testimonials];

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <motion.div
        animate={shouldReduceMotion ? undefined : { y: ["0%", "-50%"] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration, repeat: Infinity, ease: "linear", repeatType: "loop" }
        }
        className="flex flex-col gap-6"
      >
        {items.map((testimonial, index) => (
          <div key={`${testimonial.name}-${index}`} className="surface-card rounded-[1.8rem] border border-white/7 p-6">
            <Stars />
            <p className="text-base leading-relaxed text-off-white/80">{testimonial.text}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-white/6 pt-5">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold text-off-white">{testimonial.name}</p>
                <p className="text-xs text-text-muted">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="depoimentos" className="bg-background relative my-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />

      <div className="container z-10 mx-auto px-6 lg:px-12">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex max-w-[540px] flex-col items-center justify-center"
        >
          <div className="flex justify-center">
            <div className="rounded-lg border border-white/10 px-4 py-1 text-sm text-off-white/80">Testimonials</div>
          </div>

          <h2 className="mt-5 text-center font-display text-3xl font-semibold tracking-tight text-off-white sm:text-4xl lg:text-5xl">
            O que nossos leitores dizem
          </h2>
          <p className="mt-5 text-center opacity-75 text-text-secondary">
            Veja como empresários e gestores estão usando o material para tomar decisões com mais segurança.
          </p>
        </motion.div>

        <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} shouldReduceMotion={shouldReduceMotion} />
          <TestimonialsColumn testimonials={secondColumn} duration={19} shouldReduceMotion={shouldReduceMotion} className="hidden md:block" />
          <TestimonialsColumn testimonials={thirdColumn} duration={17} shouldReduceMotion={shouldReduceMotion} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
