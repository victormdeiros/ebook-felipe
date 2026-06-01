import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coffee,
  ExternalLink,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { CONFIG } from "@/config";
import { useCart } from "@/contexts/CartContext";
import { getWhatsAppUrl } from "@/lib/config";
import { getContent } from "@/lib/contentStore";
import { trackCtaClick, trackWhatsAppClick } from "@/lib/tracking";

const eventHighlights = [
  { icon: CalendarDays, label: "10 de junho", value: "Quarta-feira" },
  { icon: Clock, label: "16h às 18h", value: "2h de conteúdo" },
  { icon: MapPin, label: "Recife/PE", value: "Rua Buenos Aires, 80" },
];

const outcomes = [
  {
    icon: ShieldCheck,
    title: "Reduzir risco trabalhista",
    text: "Pontos de controle para admissão, rotina, documentação e desligamento.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Organizar o DP",
    text: "Processos simples para a empresa parar de depender de improviso.",
  },
  {
    icon: Bot,
    title: "Aplicar IA com critério",
    text: "Automação prática para ganhar eficiência sem abrir mão da segurança.",
  },
  {
    icon: Users,
    title: "Decidir com clareza",
    text: "Visão jurídica, operacional e estratégica em uma conversa objetiva.",
  },
];

const speakers = [
  {
    name: "Felipe Lopes",
    role: "Advogado Trabalhista",
    photo: "/event-speakers/felipe-lopes.webp",
  },
  {
    name: "Lais Leite",
    role: "Direito do Trabalho Empresarial",
    photo: "/event-speakers/lais-leite.webp",
  },
  {
    name: "Wagner Silva",
    role: "IA e Marketing",
    photo: "/event-speakers/wagner-silva.webp",
  },
  {
    name: "Victor Medeiros",
    role: "Automação com IA",
    photo: "/event-speakers/victor-medeiros.webp",
  },
];

const includedItems = [
  "Ingresso presencial",
  "Coffee break",
  "Networking direcionado",
  "Material de apoio",
  "Confirmação por e-mail",
];

const faqItems = [
  {
    q: "O evento é presencial?",
    a: "Sim. O encontro acontece em Recife/PE, na Rua Buenos Aires, 80, Espinheiro.",
  },
  {
    q: "Quem deve participar?",
    a: "Empresários, sócios, gestores de RH e DP que querem reduzir passivos trabalhistas e organizar processos.",
  },
  {
    q: "O que recebo após o pagamento?",
    a: "Você recebe a confirmação por e-mail com os detalhes da inscrição e orientações de acesso ao local.",
  },
  {
    q: "Posso tirar dúvidas antes de comprar?",
    a: "Pode. Use o botão de WhatsApp para falar com a equipe e confirmar se o evento faz sentido para sua empresa.",
  },
];

const whatsappMessage =
  "Olá! Tenho interesse no evento Segurança Jurídica 360 e queria tirar uma dúvida.";

const EventLandingSections = () => {
  const { startEventCheckout } = useCart();
  const content = getContent();
  const price = content.eventPrice || String(CONFIG.EVENT_PRICE);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleRegister = (source: string) => {
    trackCtaClick("event_primary_ticket", { source });
    startEventCheckout();
  };

  const handleWhatsAppClick = (source: string) => {
    trackWhatsAppClick({ source });
  };

  return (
    <>
      <section className="border-y border-white/5 bg-[#090909]">
        <div className="container mx-auto grid gap-px bg-white/5 sm:grid-cols-3">
          {eventHighlights.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-[#090909] px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#dc2626]/12 text-[#dc2626]">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-ui text-[0.58rem] uppercase tracking-[0.16em] text-white/35">
                    {label}
                  </p>
                  <p className="mt-1 font-body text-sm font-semibold text-white/80">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#050505] py-14 sm:py-16 lg:py-20">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-ui text-xs font-black uppercase tracking-[0.24em] text-[#dc2626]">
              Para tráfego frio, direto ao ponto
            </p>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
              Menos promessa.
              <br />
              Mais decisão.
            </h2>
            <p className="mt-5 max-w-xl text-left font-body text-base leading-relaxed text-white/60 sm:text-lg">
              Uma tarde para entender quais riscos trabalhistas ainda estão abertos na sua empresa e quais processos
              precisam ser ajustados antes que virem custo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleRegister("value_section")}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md bg-[#dc2626] px-8 font-ui text-sm font-black uppercase tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b91c1c]"
              >
                Participar do grupo VIP
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={getWhatsAppUrl(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleWhatsAppClick("value_section")}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-md border border-white/10 px-8 font-ui text-sm font-bold uppercase tracking-[0.08em] text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {outcomes.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-lg border border-white/8 bg-white/[0.03] p-5">
                <Icon className="h-5 w-5 text-[#dc2626]" />
                <h3 className="mt-4 font-display text-2xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-left text-sm leading-relaxed text-white/55">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="palestrantes" className="bg-[#0a0a0a] py-14 sm:py-16 lg:py-20">
        <div className="container mx-auto">
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-ui text-xs font-black uppercase tracking-[0.24em] text-[#dc2626]">
                Especialistas no palco
              </p>
              <h2 className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">
                Quem conduz.
              </h2>
            </div>
            <p className="max-w-md text-left text-sm leading-relaxed text-white/50 sm:text-right">
              Jurídico, DP, marketing e automação reunidos para tratar o problema como ele aparece na empresa real.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map((speaker) => (
              <article key={speaker.name} className="overflow-hidden rounded-lg border border-white/8 bg-[#111]">
                <div className="aspect-[4/5] overflow-hidden bg-[#1a1a1a]">
                  <img
                    src={speaker.photo}
                    alt={speaker.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top grayscale transition-[filter] duration-300 hover:grayscale-0"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-2xl font-bold text-white">{speaker.name}</h3>
                  <p className="font-ui text-[0.58rem] uppercase tracking-[0.16em] text-[#dc2626]">
                    {speaker.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inscricao" className="bg-[#050505] py-14 sm:py-16 lg:py-20">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="font-ui text-xs font-black uppercase tracking-[0.24em] text-[#dc2626]">
              Inscrição aberta
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
              Garanta a vaga sem passar pelo carrinho.
            </h2>
            <p className="mt-5 max-w-2xl text-left font-body text-base leading-relaxed text-white/60">
              O botão principal abre direto o cadastro da inscrição. Você informa nome, e-mail e WhatsApp, depois segue
              para o pagamento seguro.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {includedItems.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#dc2626]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-[#dc2626]/30 bg-[#161010] p-6 shadow-[0_18px_60px_-28px_rgba(220,38,38,0.6)]">
            <p className="font-ui text-[0.62rem] uppercase tracking-[0.2em] text-[#dc2626]">
              Ingresso único
            </p>
            <div className="mt-4 flex items-start gap-1">
              <span className="mt-2 font-display text-2xl font-bold text-white/45">R$</span>
              <span className="font-display text-7xl font-black leading-none text-white">{price}</span>
              <span className="mt-2 font-display text-2xl font-bold text-white/45">,00</span>
            </div>
            <p className="mt-2 text-left text-sm text-white/45">Pagamento único. Vagas limitadas.</p>

            <button
              id="btn-add-cart-evento"
              onClick={() => handleRegister("pricing_card")}
              className="mt-6 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-md bg-[#dc2626] px-6 font-ui text-sm font-black uppercase tracking-[0.08em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#b91c1c]"
            >
              Participar do grupo VIP
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={getWhatsAppUrl(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleWhatsAppClick("pricing_card")}
              className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md border border-white/10 px-6 font-ui text-xs font-bold uppercase tracking-[0.08em] text-white/60 transition-colors hover:border-white/25 hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Tirar dúvidas antes
            </a>
            <div className="mt-5 flex items-center gap-2 rounded-md border border-white/8 bg-black/20 px-3 py-3 text-left">
              <Coffee className="h-4 w-4 shrink-0 text-[#dc2626]" />
              <p className="text-xs leading-relaxed text-white/50">
                Coffee break incluso e networking com empresários e gestores.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="local" className="bg-[#0a0a0a] py-14 sm:py-16 lg:py-20">
        <div className="container mx-auto grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="font-ui text-xs font-black uppercase tracking-[0.24em] text-[#dc2626]">
              Local do evento
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Recife, Espinheiro.
            </h2>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/[0.03] p-6">
            <p className="font-display text-3xl font-bold text-white">Rua Buenos Aires, 80</p>
            <p className="mt-1 text-left text-sm text-white/55">Espinheiro, Recife - Pernambuco</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://maps.google.com/?q=Rua+Buenos+Aires,+80,+Espinheiro,+Recife,+PE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-white/10 px-5 font-ui text-xs uppercase tracking-[0.08em] text-white/65 transition-colors hover:border-[#dc2626]/60 hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
                Ver rota
              </a>
              <button
                onClick={() => handleRegister("location_section")}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md bg-[#dc2626] px-5 font-ui text-xs font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#b91c1c]"
              >
                Inscrever agora
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#050505] py-14 sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="font-ui text-xs font-black uppercase tracking-[0.24em] text-[#dc2626]">
              Dúvidas frequentes
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase text-white sm:text-5xl">
              Antes de se inscrever.
            </h2>
          </div>

          <div className="divide-y divide-white/8 rounded-lg border border-white/8 bg-white/[0.03]">
            {faqItems.map((item, index) => (
              <div key={item.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >
                  <span className="font-body text-sm font-semibold text-white/80 sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#dc2626] transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-left text-sm leading-relaxed text-white/55">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default EventLandingSections;
