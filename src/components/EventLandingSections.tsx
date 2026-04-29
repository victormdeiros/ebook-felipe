import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock, Coffee, ExternalLink, FileCheck2, MapPin, Network, ShieldCheck, Star, Users, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { CONFIG } from "@/config";
import { getContent } from "@/lib/contentStore";
import felipeLopes from "@/felipe.png";
import laisFoto from "@/assets/lais-foto.png";

const stats = [
  { value: "2H", label: "de conteudo direto ao ponto" },
  { value: "4", label: "especialistas no palco" },
  { value: "360", label: "visao juridica, DP e IA" },
];

const learning = [
  { icon: ShieldCheck, title: "Blindagem trabalhista", text: "Como reduzir riscos antes da contratacao, durante a rotina e no desligamento." },
  { icon: FileCheck2, title: "Processos de DP", text: "Rotinas, documentos e pontos de controle que deixam a empresa menos exposta." },
  { icon: Bot, title: "IA aplicada a gestao", text: "Onde a tecnologia pode apoiar automacao, produtividade e decisao sem improviso." },
  { icon: Users, title: "Networking direcionado", text: "Conexao com empresarios e gestores que vivem os mesmos desafios de gestao." },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Blindagem Jurídica",
    text: "Os autores revelam como evitar passivos trabalhistas da contratação à rescisão, com base no Manual do Empregador.",
  },
  {
    icon: Zap,
    title: "Inovação e Eficiência",
    text: "Como Automação e IA podem eliminar erros humanos no DP e otimizar a gestão de pessoas na sua empresa.",
  },
  {
    icon: Network,
    title: "Networking Estratégico",
    text: "Um ambiente pensado para conectar empresários e gestores que buscam profissionalizar sua gestão.",
  },
];

const speakers = [
  { name: "Felipe Lopes", role: "Advogado Trabalhista", badge: "Trabalhista", photo: felipeLopes, text: "Mais de 20 anos orientando empresas em decisoes trabalhistas e analise de risco." },
  { name: "Lais Leite", role: "Advogada e co-autora", badge: "Compliance", photo: laisFoto, text: "Atuacao em direito do trabalho empresarial, procedimentos internos e prevencao." },
  { name: "Wagner", role: "IA e Marketing", badge: "IA & Marketing", photo: "/wagner_palestrante.jpeg", text: "Aplicacoes praticas de IA e marketing para acelerar operacoes sem perder estrategia." },
  { name: "Victor", role: "Automacao com IA", badge: "Automacao", photo: "/palestrante_victor.jpg", text: "Automacao de processos para reduzir tarefas repetitivas e ganhar eficiencia." },
];

const photos = [
  { src: "/local_do_evento/auditorio.jpg", label: "Auditorio" },
  { src: "/local_do_evento/ambiente_coffee.jpg", label: "Coffee break" },
  { src: "/local_do_evento/ambiente_network_2.jpg", label: "Networking" },
  { src: "/local_do_evento/ambiente_network_3.jpg", label: "Ambiente" },
];

const EventLandingSections = () => {
  const shouldReduceMotion = useReducedMotion();
  const { addEventToCart, openCart } = useCart();
  const content = getContent();
  const price = content.eventPrice || String(CONFIG.EVENT_PRICE);

  const handleRegister = () => {
    addEventToCart();
    openCart();
  };

  const reveal = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: false,
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.6, delay, ease: [0.25, 0, 0, 1] as const },
        };

  return (
    <>
      <section
        id="save-the-date"
        className="relative overflow-hidden py-20 lg:py-28"
        style={{
          background:
            "radial-gradient(ellipse 130% 55% at 50% 0%, rgba(62,21,23,0.45) 0%, transparent 58%), #090608",
        }}
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-wine/50 to-transparent" />
        <div className="pointer-events-none absolute left-[-8rem] top-1/3 h-[40rem] w-[40rem] rounded-full bg-wine/[0.05] blur-[160px]" />
        <div className="pointer-events-none absolute right-[-8rem] bottom-1/4 h-[36rem] w-[36rem] rounded-full bg-gold/[0.04] blur-[150px]" />

        <div className="container relative z-10 mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div {...reveal()} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.08] px-5 py-2 font-ui text-[0.6rem] tracking-[0.3em] text-gold">
                <Star className="h-3 w-3 shrink-0 fill-gold" />
                EVENTO DE LANCAMENTO EXCLUSIVO
              </span>
            </motion.div>

            <motion.h2
              {...reveal(0.05)}
              className="mb-5 font-display text-5xl font-bold leading-[0.92] text-off-white sm:text-6xl lg:text-[5rem]"
            >
              Seguranca
              <br />
              <span className="italic text-wine">Juridica 360</span>
            </motion.h2>

            <motion.p
              {...reveal(0.1)}
              className="mb-8 text-center font-ui text-xs uppercase tracking-[0.22em] text-gold/75"
            >
              Blindando sua empresa contra riscos trabalhistas
            </motion.p>

            <motion.div {...reveal(0.15)} className="mb-10 flex flex-col items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-5 py-1.5 font-ui text-[0.55rem] uppercase tracking-[0.35em] text-gold">
                <CalendarDays className="h-3 w-3" />
                SAVE THE DATE
              </span>
              <div
                className="inline-flex flex-col items-stretch overflow-hidden rounded-2xl border border-gold/25 shadow-[0_0_60px_-16px_rgba(201,168,76,0.45)] sm:flex-row"
                style={{ background: "rgba(201,168,76,0.04)" }}
              >
                <div className="flex flex-col items-center justify-center gap-0.5 border-b border-gold/15 bg-gold/[0.10] px-8 py-5 sm:border-b-0 sm:border-r sm:px-10">
                  <p className="mb-1 font-ui text-[0.45rem] uppercase tracking-[0.3em] text-gold/50">Data</p>
                  <p className="font-display text-3xl font-bold leading-none tracking-tight text-off-white sm:text-4xl">10 Jun</p>
                  <p className="mt-1 font-display text-lg font-semibold leading-none text-gold">2026</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-0.5 border-b border-white/5 bg-white/[0.03] px-8 py-5 sm:border-b-0 sm:border-r sm:px-10">
                  <p className="mb-1 font-ui text-[0.45rem] uppercase tracking-[0.3em] text-gold/50">Horario</p>
                  <p className="font-display text-3xl font-bold leading-none tracking-tight text-off-white sm:text-4xl">16h &mdash; 18h</p>
                  <p className="mt-1 font-ui text-[0.5rem] tracking-[0.12em] text-gold/50">HORARIO DE BRASILIA</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-0.5 bg-white/[0.02] px-8 py-5 sm:px-10">
                  <p className="mb-1 font-ui text-[0.45rem] uppercase tracking-[0.3em] text-gold/50">Local</p>
                  <p className="font-display text-3xl font-bold leading-none tracking-tight text-off-white sm:text-4xl">Recife</p>
                  <p className="mt-1 flex items-center gap-1 font-ui text-[0.5rem] tracking-[0.12em] text-gold/50">
                    <MapPin className="h-2.5 w-2.5" />
                    PERNAMBUCO &middot; PE
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.p
              {...reveal(0.2)}
              className="mx-auto max-w-xl text-center text-base leading-relaxed text-text-secondary"
            >
              Um encontro estrategico com especialistas em Direito Trabalhista, IA e Gestao de
              Pessoas para empresarios e gestores que buscam previsibilidade, protecao e eficiencia.
            </motion.p>
          </div>
        </div>
      </section>

      <section id="experiencia" className="relative overflow-hidden bg-[#050505] py-16 lg:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,83,18,0.18),transparent_26%),radial-gradient(circle_at_80%_12%,rgba(201,168,76,0.10),transparent_22%)]" />
        <div className="container relative z-10 mx-auto">
          <motion.div {...reveal()} className="grid gap-5 md:grid-cols-3">
            {stats.map((item) => (
              <div key={item.value} className="rounded-lg border border-[#ff6b1a]/35 bg-[#ff5a14] px-6 py-6 text-center shadow-[0_22px_50px_-28px_rgba(255,90,20,0.9)]">
                <p className="font-display text-5xl font-bold leading-none text-white">{item.value}</p>
                <p className="mt-2 text-center font-ui text-[0.62rem] tracking-[0.16em] text-white/85">{item.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div {...reveal(0.08)} className="mt-14 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
              <img src="/local_do_evento/ambiente_network_2.jpg" alt="Participantes em ambiente de networking" className="h-full min-h-[320px] w-full object-cover opacity-85" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-md p-6">
                <p className="font-ui text-[0.62rem] tracking-[0.22em] text-gold">AO VIVO EM RECIFE</p>
                <h2 className="mt-3 font-display text-4xl font-bold leading-[0.95] text-white md:text-5xl">
                  Um ambiente para resolver a rotina antes dela virar passivo.
                </h2>
              </div>
            </div>

            <div>
              <p className="font-ui text-[0.65rem] tracking-[0.24em] text-[#ff7a1a]">NA JORNADA VOCE VAI APRENDER</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {learning.map(({ icon: Icon, title, text }, index) => (
                  <motion.div key={title} {...reveal(0.04 * index)} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-[#ff6b1a] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white">{title}</h3>
                    <p className="mt-2 text-left text-sm leading-relaxed text-white/62">{text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0f0a0c] py-16 lg:py-24">
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-wine/40 to-transparent" />
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-ui text-[0.65rem] tracking-[0.24em] text-gold">OS TRÊS PILARES DO EVENTO</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">Conteúdo para proteger, otimizar e conectar.</h2>
            </div>
            <button onClick={handleRegister} className="flex min-h-[48px] items-center justify-center gap-2 rounded-md px-6 font-ui text-xs font-bold text-white transition-transform hover:-translate-y-0.5" style={{ background: "#14b86f" }}>
              QUERO PARTICIPAR
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }, index) => (
              <motion.div key={title} {...reveal(index * 0.04)} className="rounded-lg border border-white/10 bg-black/40 p-5">
                <div className="mb-5 flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-[#ff6b1a]">{String(index + 1).padStart(2, "0")}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gold/20 bg-gold/[0.08]">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                </div>
                <h3 className="font-display text-2xl font-bold leading-tight text-white">{title}</h3>
                <p className="mt-3 text-left text-sm leading-relaxed text-white/68">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="local" className="relative overflow-hidden bg-[#030405] py-16 lg:py-24">
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-ui text-[0.65rem] tracking-[0.24em] text-[#ff7a1a]">LOCAL DO EVENTO</p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-[0.96] text-white md:text-5xl">
                Estrutura presencial para conteudo, conexao e decisao.
              </h2>
              <div className="mt-6 rounded-lg border border-gold/15 bg-gold/[0.04] p-5">
                <p className="flex items-center gap-2 font-ui text-[0.62rem] tracking-[0.18em] text-gold">
                  <MapPin className="h-4 w-4" />
                  RUA BUENOS AIRES, 80
                </p>
                <p className="mt-2 text-left text-sm leading-relaxed text-white/68">
                  Espinheiro, Recife/PE. Ambiente pensado para aula, coffee break e networking entre empresarios.
                </p>
              </div>
            </div>
            <a
              href="https://maps.google.com/?q=Rua+Buenos+Aires,+80,+Espinheiro,+Recife,+PE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full border border-gold/25 px-4 py-2 font-ui text-[0.6rem] tracking-[0.18em] text-gold/75 transition-all duration-200 hover:border-gold/55 hover:text-gold lg:self-end"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              VER NO GOOGLE MAPS
            </a>
          </motion.div>

          <motion.div {...reveal(0.05)} className="grid gap-3 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.src}
                  {...reveal(index * 0.04)}
                  className={`relative overflow-hidden rounded-lg border border-white/10 bg-black ${
                    index === 0 ? "col-span-2 aspect-[16/7]" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={photo.src}
                    alt={photo.label}
                    className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded bg-black/60 px-3 py-1 font-ui text-[0.55rem] tracking-[0.18em] text-white">
                    {photo.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-lg border border-gold/15 bg-white/[0.02]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.52154422001!2d-34.896043824992205!3d-8.048160591979087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ab18efa5548081%3A0x79afe9f082d5c50a!2sR.%20Buenos%20Aires%2C%2080%20-%20Espinheiro%2C%20Recife%20-%20PE%2C%2052020-180!5e0!3m2!1sen!2sbr!4v1777490901503!5m2!1sen!2sbr"
                className="absolute inset-0 h-full w-full"
                style={{ filter: "grayscale(1) invert(1) brightness(0.85) contrast(1.05)" }}
                loading="lazy"
                title="Local do evento"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 py-3">
                <p className="font-body text-xs text-white/80">
                  Rua Buenos Aires, 80 &middot; Espinheiro &middot; Recife/PE
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="palestrantes" className="relative overflow-hidden bg-[#080508] py-16 lg:py-24">
        <div className="container mx-auto">
          <motion.div {...reveal()} className="mx-auto mb-12 max-w-2xl text-center">
            <p className="font-ui text-[0.65rem] tracking-[0.24em] text-gold">CONHECA SEUS MENTORES</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-white md:text-5xl">Especialistas no palco.</h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map((speaker, index) => (
              <motion.article
                key={speaker.name}
                {...reveal(index * 0.06)}
                className="group overflow-hidden rounded-lg border border-white/10 bg-black transition-colors hover:border-gold/30 hover:bg-gold/[0.03]"
              >
                <div className="h-0.5 w-full bg-gradient-to-r from-gold via-gold/60 to-transparent" />
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={speaker.photo} alt={speaker.name} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                  <span className="absolute left-3 top-3 inline-block rounded-sm border border-gold/30 bg-gold/10 px-2 py-0.5 font-ui text-[0.6rem] tracking-widest text-gold uppercase">
                    {speaker.badge}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-2xl font-bold text-white">{speaker.name}</h3>
                    <p className="font-ui text-[0.58rem] tracking-[0.16em] text-[#ff7a1a]">{speaker.role}</p>
                  </div>
                </div>
                <p className="p-4 text-left text-sm leading-relaxed text-white/62">{speaker.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="inscricao" className="relative overflow-hidden bg-[#0a050b] py-16 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(201,168,76,0.06),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="container relative z-10 mx-auto">
          <motion.div {...reveal()} className="mx-auto mb-8 flex max-w-5xl items-center justify-center gap-3 rounded-lg border border-gold/30 bg-gold/[0.06] px-6 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
            <p className="font-ui text-sm font-bold tracking-wide text-gold uppercase">
              Vagas limitadas &mdash; ultimas oportunidades de inscricao
            </p>
          </motion.div>

          <motion.div {...reveal(0.05)} className="mx-auto grid max-w-5xl overflow-hidden rounded-xl border border-gold/25 bg-black shadow-[0_44px_120px_-36px_rgba(0,0,0,1)] lg:grid-cols-[1fr_0.76fr]">
            <div className="relative min-h-[360px] p-8 sm:p-10">
              <img src="/local_do_evento/ambiente_coffee.jpg" alt="Ambiente do evento" className="absolute inset-0 h-full w-full object-cover opacity-42" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/86 to-black/45" />
              <div className="relative z-10">
                <p className="font-ui text-[0.65rem] tracking-[0.24em] text-gold">INSCRICAO ABERTA</p>
                <h2 className="mt-4 font-display text-5xl font-bold leading-[0.92] text-white md:text-6xl">
                  Garanta sua vaga no Seguranca Juridica 360.
                </h2>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {["Conteudo presencial", "Coffee break incluso", "Networking direcionado", "Confirmacao por e-mail"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm font-semibold text-white/78">
                      <CheckCircle2 className="h-4 w-4 text-[#14b86f]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 bg-[#120a05] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <p className="font-ui text-[0.62rem] tracking-[0.2em] text-white/50">INVESTIMENTO</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-2xl text-gold">R$</span>
                <span className="font-display text-7xl font-bold leading-none text-white">{price}</span>
                <span className="mb-2 font-display text-2xl text-white/45">,00</span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 font-ui text-xs tracking-wider text-text-muted">
                <Clock className="h-3.5 w-3.5 text-gold" />
                Inscricoes encerram em <strong className="text-gold">10 de junho as 14h</strong>
              </p>
              <div className="mt-7 space-y-3">
                {[
                  { icon: CalendarDays, text: "10 de junho de 2026, das 16h as 18h" },
                  { icon: MapPin, text: "Rua Buenos Aires, 80 - Espinheiro" },
                  { icon: Coffee, text: "Coffee break e networking presencial" },
                  { icon: BriefcaseBusiness, text: "Conteudo para empresarios e gestores" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 rounded-md border border-white/8 bg-white/[0.035] p-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-sm leading-relaxed text-white/72">{text}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleRegister} className="mt-7 flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md font-ui text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-10px_rgba(0,220,120,0.65)]" style={{ background: "#14b86f" }}>
                GARANTIR MINHA VAGA
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default EventLandingSections;
