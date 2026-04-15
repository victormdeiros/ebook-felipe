import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import felipePhoto from "@/felipe.png";

const EbookPresentationSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const bullets = [
    "Orientações objetivas sobre admissão, jornada, benefícios, advertências e desligamento.",
    "Leitura pensada para consulta rápida quando a empresa precisa decidir com segurança.",
    "Conteúdo que ajuda a prevenir erros, alinhar procedimentos e reduzir improviso na gestão.",
  ];

  return (
    <section id="manual" className="section-elevated relative overflow-hidden py-24 lg:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-wine/40 to-transparent" aria-hidden="true" />
      <div className="absolute right-[-8rem] top-10 h-72 w-72 rounded-full bg-wine/10 blur-[110px]" aria-hidden="true" />

      <div className="container mx-auto">

        {/* ── Section label ── */}
        <motion.p
          className="font-ui text-[0.65rem] tracking-[0.26em] text-wine mb-6"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          MANUAL DO EMPREGADOR
        </motion.p>

        {/* ── Main block: title (left) + photo (right) ── */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 lg:gap-16 items-start mb-16">

          {/* Title */}
          <motion.h2
            className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold leading-[1.03] text-off-white"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0, 0, 1] }}
          >
            Decisões mais seguras em cada etapa da relação de trabalho
          </motion.h2>

          {/* Photo + author bio card */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:row-span-2"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img
                src={felipePhoto}
                alt="Dr. Felipe Lopes"
                className="w-full h-72 lg:h-96 object-cover object-top"
              />
            </div>
            <div className="mt-4 px-1">
              <p className="font-ui text-[0.7rem] tracking-[0.18em] text-wine mb-1">DR. FELIPE LOPES</p>
              <p className="text-xs text-text-muted leading-relaxed text-justify">
                Advogado com mais de 20 anos de experiência, especialista em Direito Empresarial e Direito do Trabalho, com formação complementar em Direito Eleitoral. Ao longo de sua trajetória, atuou em diferentes funções públicas e institucionais, incluindo a presidência de comissões da OAB Olinda/PE e cargos de assessoria e gestão jurídica em órgãos públicos. Reconhecido por sua atuação estratégica e análise criteriosa de riscos, dedica-se à orientação de empresas e empresários na busca por soluções seguras e bem fundamentadas para os desafios do ambiente empresarial.
              </p>
            </div>
          </motion.div>

          {/* Description + bullets */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-display text-xl sm:text-2xl text-off-white leading-snug mb-5">
              Um guia para transformar dúvidas trabalhistas recorrentes em decisões mais seguras.
            </h3>
            <p className="text-base leading-relaxed text-text-secondary mb-2 text-justify">
              O Manual do Empregador foi estruturado para ensinar o que realmente impacta a rotina da empresa, com linguagem clara, foco preventivo e aplicação imediata no dia a dia.
            </p>

            <div className="h-px w-full bg-white/8 my-7" />

            <ul className="space-y-0">
              {bullets.map((bullet, index) => (
                <motion.li
                  key={bullet}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4 border-b border-white/8 py-5 first:pt-0 last:border-0"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-wine" />
                  <p className="text-sm leading-relaxed text-off-white/80">{bullet}</p>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default EbookPresentationSection;
