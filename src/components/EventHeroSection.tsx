import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, MapPin, Play, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import felipeLopes from "@/felipe.png";
import laisFoto from "@/assets/lais-foto.png";

const heroSpeakers: Array<{ name: string; title: string; photo?: string }> = [
  { name: "Felipe Lopes", title: "Advogado Trabalhista", photo: felipeLopes },
  { name: "Lais Leite", title: "Advogada e Co-autora", photo: laisFoto },
  { name: "Wagner", title: "IA e Marketing", photo: "/wagner_palestrante.jpeg" },
  { name: "Victor", title: "Automacao com IA", photo: "/palestrante_victor.jpg" },
];

const eventFacts = [
  { icon: CalendarDays, label: "10 JUN 2026" },
  { icon: Clock, label: "16H AS 18H" },
  { icon: MapPin, label: "RECIFE/PE" },
];

const EventHeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addEventToCart, openCart } = useCart();

  const handleRegister = () => {
    addEventToCart();
    openCart();
  };

  const fade = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: [0.25, 0, 0, 1] as const },
        };

  return (
    <section id="evento" className="relative min-h-screen overflow-hidden bg-[#030405] pt-32">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        src="/local_do_evento/vide_do_audiotrio.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(201,168,76,0.12),transparent_50%),radial-gradient(circle_at_15%_80%,rgba(138,34,48,0.18),transparent_45%),linear-gradient(90deg,#030405_0%,rgba(3,4,5,0.88)_42%,rgba(3,4,5,0.3)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />
      <div className="absolute inset-x-0 top-[5.25rem] h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] items-center gap-12 py-12 lg:grid-cols-[1fr_0.92fr]">
        <div className="max-w-3xl">
          <motion.span
            {...fade(0.05)}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.08] px-4 py-2 font-ui text-[0.62rem] tracking-[0.24em] text-gold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            EVENTO PRESENCIAL FELIPE LOPES ADV
          </motion.span>

          <motion.h1
            {...fade(0.12)}
            className="font-display text-[3.45rem] font-bold leading-[0.88] text-white sm:text-[5.2rem] lg:text-[6.8rem]"
          >
            Redefina a
            <span className="block text-[#ff6b1a]">seguranca</span>
            <span className="block text-gold">trabalhista</span>
          </motion.h1>

          <motion.p
            {...fade(0.2)}
            className="mt-7 max-w-2xl text-left font-body text-base font-semibold leading-relaxed text-white md:text-lg"
          >
            Uma jornada presencial para empresarios e gestores que querem proteger a empresa,
            organizar o DP e aplicar IA com criterio na rotina trabalhista.
          </motion.p>

          <motion.div {...fade(0.28)} className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {eventFacts.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
                <Icon className="h-4 w-4 shrink-0 text-[#ff7a1a]" />
                <span className="font-ui text-[0.62rem] tracking-[0.14em] text-white">{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div {...fade(0.36)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleRegister}
              className="group flex min-h-[56px] items-center justify-center gap-2 rounded-md px-8 font-ui text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(0,220,120,0.65)]"
              style={{ background: "#14b86f" }}
            >
              GARANTIR MINHA VAGA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#experiencia"
              className="flex min-h-[56px] items-center justify-center gap-2 rounded-md border border-gold/30 bg-gold/[0.04] px-8 font-ui text-sm font-bold text-gold transition-all duration-200 hover:border-gold/60 hover:bg-gold/10"
            >
              <Play className="h-4 w-4" />
              VER A EXPERIENCIA
            </a>
          </motion.div>

          <motion.div {...fade(0.44)} className="mt-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            <p className="font-ui text-xs tracking-wide text-text-muted">
              <strong className="text-gold">Vagas limitadas</strong> — ultimas oportunidades de inscricao
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.25, 0, 0, 1] }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="absolute -inset-8 bg-gold/10 blur-[90px]" />
          <div className="relative grid grid-cols-2 gap-3">
            {heroSpeakers.map((speaker) => (
              <div
                key={speaker.name}
                className="group relative overflow-hidden rounded-xl border border-gold/20 bg-black"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d0d10]">
                  {speaker.photo ? (
                    <img
                      src={speaker.photo}
                      alt={speaker.name}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#1a1a20] to-[#0d0d10]">
                      <span className="font-display text-5xl text-gold/20">{speaker.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="font-display text-lg leading-tight text-white">{speaker.name}</p>
                    <p className="font-ui text-[0.6rem] uppercase tracking-[0.18em] text-gold">{speaker.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-ui text-[0.65rem] uppercase tracking-[0.2em] text-text-muted">
            4 especialistas no palco &middot; Recife/PE
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 overflow-hidden border-y border-white/10 bg-black/55 py-3 backdrop-blur-md">
        <div className="flex gap-8 whitespace-nowrap font-ui text-[0.62rem] tracking-[0.24em] text-white/65">
          <span>DIREITO TRABALHISTA &middot; GESTAO DE PESSOAS &middot; INTELIGENCIA ARTIFICIAL &middot; PROCESSOS &middot; NETWORKING &middot; PREVENCAO DE RISCOS &middot;</span>
          <span>DIREITO TRABALHISTA &middot; GESTAO DE PESSOAS &middot; INTELIGENCIA ARTIFICIAL &middot; PROCESSOS &middot; NETWORKING &middot; PREVENCAO DE RISCOS &middot;</span>
        </div>
      </div>
    </section>
  );
};

export default EventHeroSection;
