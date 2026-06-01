import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getWhatsAppUrl } from "@/lib/config";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/tracking";

const eventFacts = [
  { icon: CalendarDays, label: "10 JUN 2026" },
  { icon: Clock, label: "16H ÀS 18H" },
  { icon: MapPin, label: "RECIFE / PE" },
];

const speakers = [
  { name: "Lais Leite", photo: "/event-speakers/lais-leite.webp", pos: "object-top" },
  { name: "Felipe Lopes", photo: "/event-speakers/felipe-lopes.webp", pos: "object-top" },
  { name: "Wagner Silva", photo: "/event-speakers/wagner-silva.webp", pos: "object-top" },
  { name: "Victor Medeiros", photo: "/event-speakers/victor-medeiros.webp", pos: "object-top" },
];

const EventHeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { startEventCheckout } = useCart();

  const handleRegister = () => {
    trackCtaClick("event_primary_ticket", { source: "hero" });
    startEventCheckout();
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick({ source: "event_hero_secondary" });
  };

  const fade = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: [0.25, 0, 0, 1] as const },
        };

  return (
    <section
      id="evento"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[#0d0305] pt-[108px]"
    >
      {/* Maroon ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_65%,rgba(110,8,8,0.55)_0%,transparent_70%)]" />

      {/* Top badge */}
      <motion.div
        {...fade(0.05)}
        className="relative z-20 flex justify-center pt-6"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-1.5 font-ui text-[0.55rem] uppercase tracking-[0.3em] text-white/40">
          EVENTO PRESENCIAL · FELIPE LOPES ADV
        </span>
      </motion.div>

      {/* ── Poster composite: photos + overlaid title ── */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Photos strip */}
        <div className="relative flex flex-1 items-end gap-1.5">
          {speakers.map((s, i) => (
            <motion.div
              key={s.name}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12 + i * 0.08, ease: [0.25, 0, 0, 1] }}
              className="relative min-h-[320px] flex-1 sm:min-h-[420px] lg:min-h-[540px]"
            >
              <img
                src={s.photo}
                alt={s.name}
                loading="eager"
                fetchPriority="high"
                className={`absolute inset-0 h-full w-full object-cover ${s.pos}`}
              />
              {/* Side fade so photos blend into each other */}
              {i < speakers.length - 1 && (
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-r from-transparent to-[#0d0305]/80" />
              )}
              {i > 0 && (
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-l from-transparent to-[#0d0305]/80" />
              )}
            </motion.div>
          ))}

          {/* Heavy bottom gradient so title sits cleanly on top */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#0d0305] via-[#0d0305]/85 to-transparent" />
          {/* Lateral darkening so edges don't float */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0d0305] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0d0305] to-transparent" />

          {/* Title + subtitle — overlaid at the bottom of the photo strip */}
          <motion.div
            {...fade(0.45)}
            className="absolute inset-x-0 bottom-0 px-4 pb-6 text-center sm:pb-8"
          >
            <h1
              className="font-display font-black uppercase leading-[0.88] tracking-tight text-white"
              style={{ fontSize: "clamp(2.8rem, 9vw, 7.5rem)" }}
            >
              SEGURANÇA
              <br />
              <span className="text-[#dc2626]">JURÍDICA 360°</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg font-display text-xl font-black uppercase leading-tight tracking-wide text-white sm:text-2xl lg:text-3xl">
              Blindando sua empresa contra
              <br />
              riscos trabalhistas.
            </p>
          </motion.div>
        </div>

        {/* ── CTAs + facts below the poster ── */}
        <motion.div
          {...fade(0.55)}
          className="relative z-20 flex flex-col items-center gap-6 bg-[#0d0305] pb-14 pt-8"
        >
          {/* CTA buttons */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <button
              onClick={handleRegister}
              className="group flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-[#dc2626] px-10 font-ui text-sm font-black uppercase tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b91c1c] hover:shadow-[0_18px_44px_-10px_rgba(220,38,38,0.55)]"
            >
              PARTICIPAR DO GRUPO VIP
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={getWhatsAppUrl("Olá! Tenho interesse no evento Segurança Jurídica 360 e queria tirar uma dúvida.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-md border border-white/10 px-8 font-ui text-sm font-bold text-white/50 transition-all duration-200 hover:border-white/25 hover:text-white"
            >
              TIRAR DÚVIDAS
            </a>
          </div>

          {/* Event facts pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {eventFacts.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-white/8 bg-black/40 px-4 py-2.5"
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-[#dc2626]" />
                <span className="font-ui text-[0.58rem] uppercase tracking-[0.16em] text-white/65">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Limited spots note */}
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#dc2626]" />
            <p className="font-ui text-xs tracking-wide text-white/25">
              <strong className="text-white/40">Vagas limitadas</strong> — últimas oportunidades de inscrição
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventHeroSection;
