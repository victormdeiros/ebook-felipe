import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Cpu, Users, ArrowRight, Coffee, MapPin, Star, Zap, ExternalLink } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getContent } from "@/lib/contentStore";
import { CONFIG } from "@/config";
import felipeLopes from "@/felipe.png";
import laisFoto from "@/assets/lais-foto.png";

const speakers = [
  {
    name: "Felipe Lopes",
    role: "Advogado Trabalhista",
    badge: "Direito do Trabalho",
    photo: felipeLopes,
    theme: "wine" as const,
  },
  {
    name: "Lais Leite",
    role: "Advogada & Co-autora",
    badge: "Compliance Trabalhista",
    photo: laisFoto,
    theme: "wine" as const,
  },
  {
    name: "Wagner",
    role: "IA & Marketing",
    badge: "IA & Marketing",
    photo: "/wagner_palestrante.jpeg",
    theme: "gold" as const,
  },
  {
    name: "Victor",
    role: "Automação de Processos com IA",
    badge: "Automação com IA",
    photo: "/palestrante_victor.jpg",
    theme: "gold" as const,
  },
];

const pillars = [
  {
    icon: ShieldCheck,
    label: "Blindagem Jurídica",
    description:
      "Os autores revelam como evitar passivos trabalhistas da contratação à rescisão, com base no Manual do Empregador.",
  },
  {
    icon: Zap,
    label: "Inovação e Eficiência",
    description:
      "Como Automação e IA podem eliminar erros humanos no DP e otimizar a gestão de pessoas na sua empresa.",
  },
  {
    icon: Users,
    label: "Networking Estratégico",
    description:
      "Um ambiente pensado para conectar empresários e gestores que buscam profissionalizar sua gestão.",
  },
];

const themeStyles = {
  wine: {
    border: "border-wine/30",
    shadow: "rgba(138,34,48,0.35)",
    badgeBg: "bg-wine/70 border-wine/40",
    badgeText: "text-off-white/90",
  },
  gold: {
    border: "border-gold/25",
    shadow: "rgba(201,168,76,0.28)",
    badgeBg: "bg-[#1a1408]/80 border-gold/30",
    badgeText: "text-gold",
  },
};

const EventSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addEventToCart, openCart } = useCart();
  const content = getContent();
  const price = content.eventPrice || String(CONFIG.EVENT_PRICE);

  const handleRegister = () => {
    addEventToCart();
    openCart();
  };

  const fade = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay, ease: [0.25, 0, 0, 1] as const },
        };

  return (
    <section
      id="evento"
      className="relative overflow-hidden py-24 lg:py-36"
      style={{
        background:
          "radial-gradient(ellipse 130% 55% at 50% 0%, rgba(62,21,23,0.45) 0%, transparent 58%), #090608",
      }}
    >
      {/* Top glow bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-wine/50 to-transparent pointer-events-none" />

      {/* Background atmosphere */}
      <div className="absolute left-[-8rem] top-1/3 w-[40rem] h-[40rem] rounded-full bg-wine/[0.05] blur-[160px] pointer-events-none" />
      <div className="absolute right-[-8rem] bottom-1/4 w-[36rem] h-[36rem] rounded-full bg-gold/[0.04] blur-[150px] pointer-events-none" />

      <div className="container mx-auto">

        {/* ── Event Header ── */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div {...fade(0)} className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-wine/35 bg-wine/[0.1] px-5 py-2 font-ui text-[0.6rem] tracking-[0.3em] text-wine">
              <Star className="h-3 w-3 fill-wine shrink-0" />
              EVENTO DE LANÇAMENTO EXCLUSIVO
            </span>
          </motion.div>

          <motion.h2
            {...fade(0.08)}
            className="font-display text-5xl sm:text-6xl lg:text-[5rem] font-bold leading-[0.92] text-off-white mb-5"
          >
            Segurança
            <br />
            <span className="text-wine italic">Jurídica 360</span>
          </motion.h2>

          <motion.p
            {...fade(0.14)}
            className="font-ui text-xs tracking-[0.22em] text-gold/75 mb-7 uppercase"
          >
            Blindando sua empresa contra riscos trabalhistas
          </motion.p>

          <motion.p
            {...fade(0.18)}
            className="max-w-xl mx-auto text-base text-text-secondary leading-relaxed"
          >
            Um encontro estratégico com especialistas em Direito Trabalhista, IA e Gestão de Pessoas
            para empresários e gestores que buscam previsibilidade, proteção e eficiência.
          </motion.p>
        </div>

        {/* ── Speakers ── */}
        <motion.p
          {...fade(0.22)}
          className="font-ui text-[0.6rem] tracking-[0.3em] text-white/30 text-center mb-8"
        >
          PALESTRANTES
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-20 lg:mb-28">
          {speakers.map((speaker, index) => {
            const t = themeStyles[speaker.theme];
            return (
              <motion.div
                key={speaker.name}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + index * 0.09, duration: 0.65, ease: [0.25, 0, 0, 1] }}
                className={`relative rounded-2xl overflow-hidden border ${t.border} group`}
                style={{
                  aspectRatio: "3/4",
                  boxShadow: `0 24px 64px -20px ${t.shadow}, 0 0 0 1px rgba(255,255,255,0.03)`,
                }}
              >
                {/* Photo */}
                <img
                  src={speaker.photo}
                  alt={speaker.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />

                {/* Gradient overlay — stronger at bottom for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                {/* Subtle color tint at top */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      speaker.theme === "wine"
                        ? "linear-gradient(to bottom, rgba(138,34,48,0.3) 0%, transparent 40%)"
                        : "linear-gradient(to bottom, rgba(201,168,76,0.15) 0%, transparent 40%)",
                  }}
                />

                {/* Topic badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 font-ui text-[0.55rem] tracking-[0.14em] backdrop-blur-sm ${t.badgeBg} ${t.badgeText}`}
                  >
                    {speaker.badge}
                  </span>
                </div>

                {/* Name & role */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="font-display text-lg sm:text-xl font-semibold text-off-white leading-tight">
                    {speaker.name}
                  </p>
                  <p className="font-body text-xs text-white/55 mt-0.5">{speaker.role}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Venue ── */}
        <motion.div {...fade(0.22)} className="mb-20 lg:mb-28">

          {/* Address row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-gold/25 bg-gold/[0.08] flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="font-ui text-[0.5rem] tracking-[0.28em] text-white/30 uppercase mb-0.5">Local do Evento</p>
                <p className="font-display text-lg sm:text-xl font-semibold text-off-white leading-tight">
                  Rua Buenos Aires, 80 <span className="text-text-muted font-body font-normal text-sm">— Espinheiro, Recife/PE</span>
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Rua+Buenos+Aires,+80,+Espinheiro,+Recife,+PE"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start sm:self-center flex items-center gap-1.5 font-ui text-[0.6rem] tracking-[0.14em] text-gold/60 hover:text-gold border border-gold/15 hover:border-gold/35 rounded-full px-3.5 py-1.5 transition-all duration-200"
            >
              <ExternalLink className="w-3 h-3" />
              VER NO GOOGLE MAPS
            </a>
          </div>

          {/* Photos + Map */}
          <div className="grid lg:grid-cols-2 gap-3" style={{ height: "260px" }}>

            {/* 2×2 photo grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 rounded-xl overflow-hidden">
              {([
                { src: "/local_do_evento/auditorio.jpg",       alt: "Auditório",          label: "AUDITÓRIO" },
                { src: "/local_do_evento/ambiente_coffee.jpg", alt: "Área de networking", label: "NETWORKING" },
                { src: "/local_do_evento/ambiente_network_2.jpg", alt: "Coffee break",    label: "COFFEE BREAK" },
                { src: "/local_do_evento/ambiente_network_3.jpg", alt: "Área externa",    label: "AMBIENTE" },
              ] as { src: string; alt: string; label: string }[]).map(({ src, alt, label }) => (
                <div key={label} className="relative overflow-hidden group">
                  <img
                    src={src}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 font-ui text-[0.45rem] tracking-[0.16em] text-white/65 bg-black/45 backdrop-blur-sm px-2 py-1 rounded-full border border-white/8">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="relative rounded-xl overflow-hidden border border-gold/10 bg-white/[0.02]">
              <iframe
                src="https://maps.google.com/maps?q=Rua+Buenos+Aires,+80,+Espinheiro,+Recife,+PE,+Brasil&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full"
                style={{ filter: "grayscale(1) invert(1) brightness(0.85) contrast(1.05)" }}
                loading="lazy"
                title="Local do evento"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Corner overlay with address */}
              <div className="absolute bottom-0 left-0 right-0 pointer-events-none px-3 py-2.5 bg-gradient-to-t from-black/70 to-transparent">
                <p className="font-body text-[0.65rem] text-white/70">Rua Buenos Aires, 80 · Espinheiro · Recife/PE</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* ── Pillars + CTA ── */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">

          {/* Three pillars */}
          <div>
            <motion.p
              {...fade(0.1)}
              className="font-ui text-[0.6rem] tracking-[0.28em] text-wine mb-10"
            >
              OS TRÊS PILARES DO EVENTO
            </motion.p>

            <div className="space-y-0">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={pillar.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + index * 0.1, duration: 0.55, ease: [0.25, 0, 0, 1] }}
                  className="flex gap-5 py-7 border-b border-white/8 last:border-0"
                >
                  <div className="shrink-0 mt-0.5 w-11 h-11 rounded-xl border border-gold/20 bg-gold/[0.07] flex items-center justify-center">
                    <pillar.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-off-white mb-1.5">
                      {pillar.label}
                    </p>
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Registration card */}
          <motion.div
            {...fade(0.28)}
            className="rounded-2xl overflow-hidden border border-gold/20 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(201,168,76,0.06)]"
            style={{ background: "linear-gradient(160deg, #161008 0%, #0a0805 100%)" }}
          >
            {/* Card header band */}
            <div className="px-7 pt-7 pb-6 border-b border-white/[0.07]">
              <div className="flex items-center justify-between mb-5">
                <span className="font-ui text-[0.55rem] tracking-[0.26em] text-gold/60 uppercase">
                  Inscrição
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-wine/[0.12] border border-wine/25 px-3 py-1 font-ui text-[0.55rem] tracking-[0.16em] text-wine">
                  <span className="w-1.5 h-1.5 rounded-full bg-wine animate-pulse" />
                  VAGAS LIMITADAS
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-lg text-text-muted">R$</span>
                <span className="font-display text-6xl font-bold text-gold leading-none">{price}</span>
              </div>
              <p className="mt-2.5 text-xs text-text-muted leading-relaxed">
                Menos que o custo de uma única multa trabalhista — com o conhecimento para evitar passivos de milhares de reais.
              </p>
            </div>

            {/* Benefits list */}
            <div className="px-7 py-6 space-y-4">
              {[
                { icon: MapPin, text: "Rua Buenos Aires, 80 — Espinheiro, Recife/PE" },
                { icon: Coffee, text: "Coffee Break com networking direcionado" },
                { icon: ShieldCheck, text: "Conteúdo baseado no Manual do Empregador" },
                { icon: Users, text: "Acesso direto aos 4 palestrantes" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-gold/[0.08] border border-gold/15 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-gold/75" />
                  </div>
                  <span className="text-sm text-off-white/80 font-body">{text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-7 pb-7">
              <button
                onClick={handleRegister}
                className="relative w-full flex items-center justify-center gap-2.5 min-h-[54px] rounded-xl bg-gold hover:bg-gold-light active:bg-gold-dark font-ui font-bold text-sm text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(201,168,76,0.6)] overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                GARANTIR MINHA VAGA
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3.5 text-center text-[0.6rem] text-text-muted tracking-wide">
                Pagamento seguro · Confirmação imediata por e-mail
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default EventSection;

