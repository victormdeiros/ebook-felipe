import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { VideoScrollHero } from "@/components/ui/video-scroll-hero";
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
        <div className="overflow-hidden rounded-[2.4rem] border border-white/8 bg-black/20">
          <VideoScrollHero
            enableAnimations={!shouldReduceMotion}
            className="-mb-32"
            backgroundSrc={felipePhoto}
            eyebrow="Manual do Empregador"
            title="Decisões mais seguras em cada etapa da relação de trabalho"
            description=""
          />

          <motion.section
            className="relative -mt-8 min-h-[42rem] rounded-t-[2rem] bg-support px-6 py-16 md:px-10"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring", stiffness: 180, damping: 24 }}
          >
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div>
                <h3 className="font-display text-3xl text-off-white md:text-5xl">
                  Um guia para transformar dúvidas trabalhistas recorrentes em decisões mais seguras.
                </h3>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                  O Manual do Empregador foi estruturado para ensinar o que realmente impacta a rotina da empresa, com linguagem clara, foco preventivo e aplicação imediata no dia a dia.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {bullets.map((bullet, index) => (
                  <motion.div
                    key={bullet}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 + index * 0.1, duration: 0.55 }}
                    className="rounded-[1.5rem] border border-white/7 bg-background/35 p-6"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-wine/10 text-wine">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-base leading-relaxed text-off-white/80">{bullet}</p>
                  </motion.div>
                ))}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.42, duration: 0.55 }}
                  className="rounded-[1.5rem] border border-white/7 bg-background/35 p-6 md:col-span-2"
                >
                  <p className="font-ui text-[0.72rem] tracking-[0.22em] text-wine">APLICAÇÃO PRÁTICA</p>
                  <p className="mt-3 text-base leading-relaxed text-text-secondary">
                    Ao longo do material, o empresário entende onde costuma errar, o que precisa padronizar e como conduzir relações de trabalho com mais previsibilidade e menos exposição a passivos.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </section>
  );
};

export default EbookPresentationSection;
