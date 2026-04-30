import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Clock,
  Coffee,
  ExternalLink,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CONFIG } from "@/config";
import { getContent } from "@/lib/contentStore";
import felipeLopes from "@/felipe.png";
import laisFoto from "@/assets/lais-foto.png";

const stats = [
  { value: "2H", label: "de conteúdo direto ao ponto" },
  { value: "4", label: "especialistas no palco" },
  { value: "360°", label: "visão jurídica, DP e IA" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Blindagem Trabalhista",
    text: "Como reduzir riscos antes da contratação, durante a rotina e no desligamento.",
  },
  {
    icon: FileCheck2,
    title: "Processos de DP",
    text: "Rotinas, documentos e pontos de controle que deixam a empresa menos exposta.",
  },
  {
    icon: Bot,
    title: "IA Aplicada à Gestão",
    text: "Onde a tecnologia pode apoiar automação, produtividade e decisão sem improviso.",
  },
  {
    icon: Users,
    title: "Networking Direcionado",
    text: "Conexão com empresários e gestores que vivem os mesmos desafios de gestão.",
  },
];

const speakers = [
  {
    name: "Felipe Lopes",
    role: "Advogado Trabalhista",
    photo: felipeLopes,
    text: "Mais de 20 anos orientando empresas em decisões trabalhistas e análise de risco.",
  },
  {
    name: "Lais Leite",
    role: "Advogada e Co-autora",
    photo: laisFoto,
    text: "Atuação em direito do trabalho empresarial, procedimentos internos e prevenção.",
  },
  {
    name: "Wagner",
    role: "IA e Marketing",
    photo: "/wagner_palestrante.jpeg",
    text: "Aplicações práticas de IA e marketing para acelerar operações sem perder estratégia.",
  },
  {
    name: "Victor",
    role: "Automação com IA",
    photo: "/palestrante_victor.jpg",
    text: "Automação de processos para reduzir tarefas repetitivas e ganhar eficiência.",
  },
];

const checklist = [
  "Como estruturar admissão, rotina e rescisão para minimizar passivos trabalhistas",
  "Os documentos que todo empregador deve ter atualizados para se proteger",
  "Como usar IA para automatizar tarefas repetitivas no Departamento Pessoal",
  "O que fazer quando um colaborador aciona sua empresa na Justiça do Trabalho",
  "Como construir uma cultura de compliance trabalhista na prática do dia a dia",
  "Ferramentas digitais para gestão de pessoas com segurança jurídica",
];

const faqItems = [
  {
    q: "O evento é presencial?",
    a: "Sim, o evento é 100% presencial em Recife/PE, na Rua Buenos Aires, 80 — Espinheiro. Não haverá transmissão online.",
  },
  {
    q: "Haverá gravação ou material de apoio?",
    a: "O evento não será gravado. A proposta é criar um ambiente de imersão e networking presencial. Haverá material de apoio distribuído no local.",
  },
  {
    q: "Quem deve participar?",
    a: "Empresários, sócios, gestores de RH e DP que querem proteger sua empresa de passivos trabalhistas e aplicar boas práticas de gestão de pessoas.",
  },
  {
    q: "Há coffee break?",
    a: "Sim, está incluso no ingresso um coffee break completo e um momento de networking estruturado entre os participantes.",
  },
  {
    q: "Como funciona a inscrição?",
    a: "Após o pagamento confirmado, você receberá a confirmação por e-mail com todos os detalhes do evento, incluindo endereço e horário de acesso.",
  },
  {
    q: "Posso transferir minha inscrição?",
    a: "Sim, é possível transferir a inscrição para outra pessoa com até 48h de antecedência. Basta entrar em contato via WhatsApp.",
  },
];

const EventLandingSections = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addEventToCart, openCart } = useCart();
  const content = getContent();
  const price = content.eventPrice || String(CONFIG.EVENT_PRICE);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleRegister = () => {
    addEventToCart();
    openCart();
  };

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.6, delay, ease: [0.25, 0, 0, 1] as const },
        };

  return (
    <>
      {/* ── Stats Bar ─────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto grid grid-cols-3 divide-x divide-white/5">
          {stats.map((item) => (
            <div key={item.value} className="flex flex-col items-center py-10 text-center">
              <p className="font-display text-4xl font-black text-white sm:text-5xl lg:text-6xl">
                {item.value}
              </p>
              <p className="mt-2 max-w-[120px] font-ui text-[0.55rem] uppercase tracking-[0.16em] text-white/40">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Video Section (Bloco 3) ────────────────────── */}
      {/* Top: solid black — eyebrow + title */}
      <section className="bg-[#030405] pb-0 pt-20 lg:pt-28">
        <div className="container mx-auto text-center">
          <motion.div {...reveal()}>
            <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
              UM DIA QUE VAI MUDAR SUA VISÃO
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl lg:text-6xl">
              Mais do que um evento —<br />
              <span className="text-[#dc2626]">uma virada de chave.</span>
            </h2>
          </motion.div>
        </div>

        {/* Video — full width, natural aspect ratio, fades on top & bottom edges */}
        <motion.div {...reveal(0.1)} className="relative mt-12 w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <video
            ref={(el) => {
              if (!el) return;
              const trim = () => {
                if (el.duration && el.currentTime >= el.duration - 3) {
                  el.currentTime = 0;
                }
              };
              el.addEventListener("timeupdate", trim);
            }}
            src="/kling_20260501_作品__973_0 (1).mp4"
            className="h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#030405] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#030405] to-transparent" />
        </motion.div>

        {/* Content below video — still inside same dark section */}
        <div className="container mx-auto pb-16 pt-10 text-center lg:pb-24">
          <motion.p
            {...reveal(0.15)}
            className="mx-auto max-w-xl font-body text-lg leading-relaxed text-white/75 sm:text-xl"
          >
            Em um único dia, você vai sair com clareza jurídica, estratégias práticas e a segurança de quem sabe exatamente como proteger o que construiu.
          </motion.p>

          {/* Highlighted date/time block */}
          <motion.div
            {...reveal(0.22)}
            className="mx-auto mt-12 w-full max-w-3xl overflow-hidden rounded-xl border border-[#dc2626]/25 bg-[#dc2626]/8"
          >
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <div className="flex flex-col items-center py-7">
                <p className="font-ui text-[0.5rem] font-black uppercase tracking-[0.28em] text-[#dc2626]">Data</p>
                <p className="mt-2 whitespace-nowrap font-display font-black uppercase text-white" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)" }}>10 JUN 2026</p>
              </div>
              <div className="flex flex-col items-center py-7">
                <p className="font-ui text-[0.5rem] font-black uppercase tracking-[0.28em] text-[#dc2626]">Horário</p>
                <p className="mt-2 whitespace-nowrap font-display font-black uppercase text-white" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)" }}>16H — 18H</p>
              </div>
              <div className="flex flex-col items-center py-7">
                <p className="font-ui text-[0.5rem] font-black uppercase tracking-[0.28em] text-[#dc2626]">Local</p>
                <p className="mt-2 whitespace-nowrap font-display font-black uppercase text-white" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.5rem)" }}>RECIFE / PE</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Benefits Grid (Bloco 4) ───────────────────── */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28">
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mb-14 text-center">
            <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
              NA JORNADA VOCÊ VAI APRENDER
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
              Conteúdo para proteger,
              <br />
              otimizar e decidir.
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                {...reveal(index * 0.06)}
                className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-7"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-[#dc2626]/12 text-[#dc2626]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-left text-sm leading-relaxed text-white/55">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-width Image Break (Bloco 5) ─────────── */}
      <div className="relative h-[340px] w-full overflow-hidden sm:h-[420px]">
        <img
          src="/local_do_evento/auditorio.jpg"
          alt="Auditório do evento Segurança Jurídica 360"
          className="h-full w-full object-cover brightness-[0.4] grayscale"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-ui text-[0.6rem] uppercase tracking-[0.4em] text-white/50">
            O AMBIENTE
          </p>
          <p className="mt-3 text-center font-display font-black uppercase leading-tight text-white"
            style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)" }}
          >
            Espaço criado para
            <br />
            decisão e resultado.
          </p>
        </div>
      </div>

      {/* ── Speakers Grid (Bloco 6) ───────────────────── */}
      <section id="palestrantes" className="bg-[#080808] py-20 lg:py-28">
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mb-14 text-center">
            <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
              CONHEÇA SEUS MENTORES
            </p>
            <h2 className="font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Especialistas no palco.
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map((speaker, index) => (
              <motion.article
                key={speaker.name}
                {...reveal(index * 0.07)}
                className="overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#111111]"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    className="h-full w-full object-cover object-top grayscale transition-[filter] duration-500 hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <p className="font-display text-xl font-bold text-white">{speaker.name}</p>
                  <p className="font-ui text-[0.58rem] uppercase tracking-[0.18em] text-[#dc2626]">
                    {speaker.role}
                  </p>
                  <p className="mt-3 text-left text-sm leading-relaxed text-white/50">
                    {speaker.text}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Checklist (Bloco 7) ───────────────────────── */}
      <section className="bg-[#050505] py-20 lg:py-28">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl">
            <motion.div {...reveal()} className="mb-12 text-center">
              <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
                O QUE VOCÊ VAI SAIR SABENDO
              </p>
              <h2 className="font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
                Seis pontos que vão
                <br />
                mudar sua gestão.
              </h2>
            </motion.div>

            <ul className="space-y-5">
              {checklist.map((item, index) => (
                <motion.li
                  key={item}
                  {...reveal(index * 0.06)}
                  className="flex items-start gap-4 border-b border-white/5 pb-5 last:border-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dc2626] text-white">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7l4 4 6-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <p className="font-body text-base leading-relaxed text-white/75">{item}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Pricing Card (Bloco 8) ────────────────────── */}
      <section id="inscricao" className="bg-[#0a0a0a] py-20 lg:py-28">
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mb-12 text-center">
            <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
              INSCRIÇÃO ABERTA
            </p>
            <h2 className="font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Garanta sua vaga.
            </h2>
          </motion.div>

          <motion.div {...reveal(0.08)} className="mx-auto max-w-md">
            <div className="overflow-hidden rounded-xl border border-[#dc2626]/30 bg-[#1a1a1a] shadow-[0_0_60px_-20px_rgba(220,38,38,0.3)]">
              <div className="bg-[#dc2626] px-8 py-4 text-center">
                <p className="font-ui text-[0.65rem] font-black uppercase tracking-[0.28em] text-white">
                  INGRESSO ÚNICO
                </p>
              </div>

              <div className="px-8 py-8 text-center">
                <p className="mb-2 font-ui text-[0.58rem] uppercase tracking-[0.18em] text-white/35">
                  INVESTIMENTO
                </p>
                <div className="flex items-start justify-center gap-1">
                  <span className="mt-3 font-display text-2xl font-bold text-white/50">R$</span>
                  <span className="font-display text-8xl font-black leading-none text-white">
                    {price}
                  </span>
                </div>
                <p className="mt-2 font-ui text-[0.58rem] uppercase tracking-[0.14em] text-white/35">
                  pagamento único
                </p>
              </div>

              <div className="border-t border-white/5 px-8 pb-2 pt-6">
                <ul className="space-y-3">
                  {[
                    "Conteúdo presencial exclusivo",
                    "Coffee break completo",
                    "Networking direcionado",
                    "Material de apoio",
                    "Confirmação por e-mail",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-white/65">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dc2626]/15 text-[#dc2626]">
                        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 py-8">
                <button
                  onClick={handleRegister}
                  className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md bg-[#dc2626] font-ui text-sm font-black uppercase tracking-[0.06em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b91c1c] hover:shadow-[0_18px_44px_-10px_rgba(220,38,38,0.6)]"
                >
                  GARANTIR MINHA VAGA
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-3 text-center font-ui text-[0.55rem] uppercase tracking-[0.14em] text-white/25">
                  10 de junho · 16h às 18h · Recife/PE
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Location Info + Map (Bloco 9) ─────────────── */}
      <section id="local" className="bg-[#050505] py-20 lg:py-28">
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mb-12 text-center">
            <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
              LOCAL DO EVENTO
            </p>
            <h2 className="font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Onde acontece.
            </h2>
          </motion.div>

          <motion.div {...reveal(0.06)} className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <p className="font-ui text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                ENDEREÇO
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold text-white">
                Rua Buenos Aires, 80
              </h3>
              <p className="mt-1 font-body text-base text-white/50">
                Espinheiro, Recife — Pernambuco
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: CalendarDays, text: "10 de junho de 2026" },
                  { icon: Clock, text: "16h às 18h (horário de Brasília)" },
                  { icon: Coffee, text: "Coffee break e networking inclusos" },
                  { icon: BriefcaseBusiness, text: "Ambiente para empresários e gestores" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#dc2626]/10 text-[#dc2626]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-white/60">{text}</p>
                  </div>
                ))}
              </div>

              <a
                href="https://maps.google.com/?q=Rua+Buenos+Aires,+80,+Espinheiro,+Recife,+PE"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-ui text-[0.6rem] uppercase tracking-[0.2em] text-[#dc2626] transition-colors hover:text-red-400"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                VER NO GOOGLE MAPS
              </a>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-white/8">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.52154422001!2d-34.896043824992205!3d-8.048160591979087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18efa5548081%3A0x79afe9f082d5c50a!2sR.%20Buenos%20Aires%2C%2080%20-%20Espinheiro%2C%20Recife%20-%20PE%2C%2052020-180!5e0!3m2!1sen!2sbr!4v1777490901503!5m2!1sen!2sbr"
                className="absolute inset-0 h-full w-full"
                style={{ filter: "grayscale(1) invert(1) brightness(0.8) contrast(1.1)" }}
                loading="lazy"
                title="Local do evento Segurança Jurídica 360"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 py-3">
                <p className="font-body text-xs text-white/70">
                  Rua Buenos Aires, 80 · Espinheiro · Recife/PE
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Accordion (Bloco 10) ───────────────────── */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28">
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mb-12 text-center">
            <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
              DÚVIDAS FREQUENTES
            </p>
            <h2 className="font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Perguntas e Respostas.
            </h2>
          </motion.div>

          <div className="mx-auto max-w-[700px]">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.q}
                {...reveal(index * 0.05)}
                className="border-b border-white/8"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-body text-base font-semibold text-white/80">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#dc2626] transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="pb-5">
                    <p className="font-body text-sm leading-relaxed text-white/50">{item.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="bg-[#0d0000] py-20 lg:py-28">
        <div className="container mx-auto text-center">
          <motion.div {...reveal()}>
            <p className="mb-4 block text-center font-ui text-xs font-black uppercase tracking-[0.28em] text-[#dc2626]">
              NÃO PERCA A OPORTUNIDADE
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
              Uma decisão que protege
              <br />
              <span className="text-[#dc2626]">sua empresa por anos.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg font-body text-base leading-relaxed text-white/50">
              10 de junho de 2026 · Recife/PE · Vagas limitadas
            </p>
            <button
              onClick={handleRegister}
              className="group mt-10 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-md bg-[#dc2626] px-10 font-ui text-sm font-black uppercase tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b91c1c] hover:shadow-[0_18px_44px_-10px_rgba(220,38,38,0.55)]"
            >
              GARANTIR MINHA VAGA AGORA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default EventLandingSections;
