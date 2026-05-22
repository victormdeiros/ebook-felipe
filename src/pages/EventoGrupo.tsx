import { useEffect } from "react";
import { Calendar, Users, Search, CheckCircle2, MessageCircle, Shield, FileWarning } from "lucide-react";
import { trackPageView, gtmPush } from "@/lib/tracking";

const speakers = [
  { 
    name: "Lais Leite",      
    role: "Direito Trabalhista",      
    photo: "/event-speakers/lais-leite.webp",                    
    pos: "50% 18%" 
  },
  { 
    name: "Felipe Lopes",    
    role: "Advogado Trabalhista",      
    photo: "/event-speakers/felipe-lopes.webp",                 
    pos: "50% 18%" 
  },
  { 
    name: "Wagner Silva",    
    role: "IA e Marketing",        
    photo: "/event-speakers/wagner-silva.webp",  
    pos: "50% 20%" 
  },
  { 
    name: "Victor Medeiros", 
    role: "Automação com IA",       
    photo: "/event-speakers/victor-medeiros.webp",   
    pos: "50% 20%" 
  },
];

// ──────────────────────────────────────────────────────────────────────────
// Página: Grupo de Orientação Trabalhista — Evento Segurança Jurídica 360°
// Baseado na estrutura de: https://rkinternacional.com.br/grupo/
// ──────────────────────────────────────────────────────────────────────────

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/L8tq26hTf4d54k7eGiTmRt"; 

// Paleta dedicada inspirada no tema original de /evento (Vermelho e Vinho Escuro)
const palette = {
  bgDark: "#0d0305",
  bgPitch: "#050505",
  bgCard: "rgba(255, 255, 255, 0.03)",
  redAccent: "#dc2626",
  redAccentHover: "#b91c1c",
  textWhite: "#ffffff",
  textMuted: "rgba(255, 255, 255, 0.6)",
  textSoft: "rgba(255, 255, 255, 0.85)",
  creamBg: "#EDE3D0",
  creamTextDark: "#0d0305",
};

const pageStyles = `
  .grupo-page {
    background: ${palette.bgDark};
    color: ${palette.textSoft};
    font-family: 'Inter', system-ui, sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
  }
  .grupo-page ::selection {
    background: ${palette.redAccent}40;
    color: ${palette.textWhite};
  }
  .grupo-page .font-serif {
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
  }
  .grupo-page .hero-title {
    font-size: clamp(2rem, 4.8vw, 3.8rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
  }
  .grupo-page .underline-highlight {
    background-image: linear-gradient(to top, ${palette.redAccent}44 0%, ${palette.redAccent}44 38%, transparent 38%);
    padding: 0 0.12em;
  }
  .grupo-page .neon-blob {
    position: absolute;
    width: 38rem;
    height: 38rem;
    pointer-events: none;
    border-radius: 9999px;
    filter: blur(60px);
    background: radial-gradient(circle, rgba(220, 38, 38, 0.09) 0%, transparent 70%);
    z-index: 0;
  }
  .grupo-page .btn-shine {
    position: relative;
    overflow: hidden;
    box-shadow: 0 16px 36px -12px rgba(220, 38, 38, 0.45), inset 0 -2px 0 rgba(0,0,0,0.2);
  }
  .grupo-page .btn-shine::before {
    content: "";
    position: absolute; inset: 0;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.9s ease;
  }
  .grupo-page .btn-shine:hover::before { transform: translateX(100%); }

  .grupo-page .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .grupo-page .reveal.is-visible { opacity: 1; transform: translateY(0); }

  .grupo-page .grain-overlay {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.06; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>");
  }
  .grupo-page .red-strip {
    width: 80px; height: 3px;
    background: ${palette.redAccent};
    position: relative;
  }
`;

const EventoGrupo = () => {
  useEffect(() => {
    document.title = "Grupo Segurança Jurídica 360° | Orientação Trabalhista";
    const cleanup = trackPageView();
    gtmPush({ event: "view_grupo_evento_page" });

    // Scroll reveal IntersectionObserver
    const els = document.querySelectorAll(".grupo-page .reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      cleanup?.();
      document.title = "Manual do Empregador – E-book";
    };
  }, []);

  const handleCtaClick = (placement: string) => {
    gtmPush({ event: "cta_click", placement, target: "whatsapp_group" });
  };

  return (
    <div className="grupo-page">
      <style>{pageStyles}</style>

      {/* ───── Header Info (Dark Minimal) ───── */}
      <header className="py-4 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center text-[9px] md:text-xs font-bold tracking-[0.18em] md:tracking-[0.22em] uppercase opacity-60 gap-3 md:gap-12 text-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#dc2626]" />
            <span>Encontro Presencial · 10 de junho às 16h</span>
          </div>
          <div className="flex items-center gap-2 border-t md:border-none pt-2 md:pt-0 w-full md:w-auto justify-center" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <Users className="w-3.5 h-3.5 flex-shrink-0 text-[#dc2626]" />
            <span>Conduzido por 4 especialistas</span>
          </div>
          <div className="flex items-center gap-2 border-t md:border-none pt-2 md:pt-0 w-full md:w-auto justify-center" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <Users className="w-3.5 h-3.5 flex-shrink-0 text-[#dc2626]" />
            <span>Vagas Limitadas</span>
          </div>
        </div>
      </header>

      {/* ───── Hero Section (Split Layout) ───── */}
      <section className="relative min-h-[85vh] flex flex-col lg:flex-row overflow-hidden">
        <div className="neon-blob top-0 left-0" style={{ transform: "translate(-45%, -45%)" }} />
        <div className="grain-overlay" />

        {/* Hero Content (Left half on Desktop) */}
        <div className="relative z-10 w-full lg:w-[55%] flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 py-16 text-center lg:text-left bg-[#0d0305]">
          <div className="max-w-xl mx-auto lg:mx-0 w-full">
            <div
              className="reveal is-visible inline-block bg-[#dc2626] text-white px-3 py-1 rounded-sm text-[10px] font-bold tracking-widest uppercase mb-6"
            >
              Acesso Exclusivo
            </div>

            <h1 className="hero-title reveal is-visible font-serif font-black mb-6 md:mb-8 text-white leading-tight">
              Sua empresa pode estar a um <span className="underline-highlight">passivo trabalhista</span> de virar uma dor de cabeça.
            </h1>

            <p
              className="reveal is-visible text-base md:text-lg lg:text-xl opacity-80 max-w-xl mb-10 md:mb-12 font-medium leading-relaxed text-zinc-300"
            >
              Entre no grupo conduzido por <strong className="text-white font-bold">quatro especialistas</strong> em direito trabalhista, Departamento Pessoal e gestão — e receba orientações práticas antes que um pequeno erro vire um processo.
            </p>

            <div className="reveal is-visible">
              <a
                href={WHATSAPP_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCtaClick("hero")}
                className="btn-shine font-black py-3.5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-4 text-sm md:text-lg w-full max-w-sm"
                style={{ background: palette.redAccent, color: "#fff" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = palette.redAccentHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = palette.redAccent)}
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                QUERO ENTRAR NO GRUPO
              </a>
              <p
                className="mt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-400 block"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Orientação Premium com 4 Especialistas do Evento
              </p>
            </div>
          </div>
        </div>

        {/* Hero Interactive Widescreen 4-Speaker Banner (Right half on Desktop, Stacked below on Mobile) */}
        <div className="relative z-0 w-full lg:w-[45%] min-h-[360px] sm:min-h-[460px] lg:min-h-0 bg-[#050505] flex">
          <div className="flex h-full w-full gap-[2px] overflow-hidden">
            {speakers.map((s) => (
              <div
                key={s.name}
                className="relative flex-1 group overflow-hidden transition-all duration-500 ease-out hover:flex-[1.4] bg-[#141414] h-full"
              >
                <img
                  src={s.photo}
                  alt={s.name}
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  style={{ objectPosition: s.pos }}
                />
                
                {/* Visual mask gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/35 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300" />
                
                {/* Horizontal side gradient overlay to blend into left text section (only on desktop) */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0d0305] to-transparent hidden lg:block pointer-events-none" />

                {/* Info Text */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-left transition-transform duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <p className="font-serif font-black italic text-base sm:text-xl lg:text-2xl text-white leading-tight">
                    {s.name}
                  </p>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#dc2626] mt-1">
                    {s.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Section 2: Para Quem É (3 Cards Layout) ───── */}
      <section className="py-16 md:py-32 px-6 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 md:mb-24 reveal">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block text-[#dc2626]">
              Para quem foi pensado
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black italic mb-6 text-white">
              Para quem é este grupo?
            </h2>
            <div className="red-strip mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: Search,
                title: "Quem desconfia de algum erro",
                body: "Você acha que algo no contrato, na jornada ou na rescisão pode estar errado — mas não sabe por onde começar a busca ou se o risco ainda existe.",
              },
              {
                icon: FileWarning,
                title: "Quem quer evitar processos",
                body: "Entenda as regras práticas do Direito Trabalhista para não cometer erros recorrentes que custam caro em acordos ou audiências trabalhistas.",
              },
              {
                icon: CheckCircle2,
                title: "Quem busca o caminho seguro",
                body: "Orientação extremamente clara sobre quais documentos realmente importam e como funciona o passo a passo do DP estratégico moderno.",
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <div
                key={title}
                className="reveal group bg-white/[0.03] p-8 rounded-3xl border border-white/10 hover:border-[#dc2626]/30 transition-all duration-350"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-12 h-12 bg-[#dc2626]/10 rounded-full flex items-center justify-center mb-6 text-[#dc2626]"
                >
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4 uppercase tracking-tighter text-white">
                  {title}
                </h3>
                <p className="text-sm opacity-60 leading-relaxed font-medium text-zinc-300">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Section 3: Final Call Section (Beige/Cream background, contrasting) ───── */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden" style={{ background: palette.creamBg, color: palette.creamTextDark }}>
        {/* Background glow overlay */}
        <div
          className="absolute -top-32 -right-20 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${palette.redAccent} 0%, transparent 70%)` }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span
            className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 md:mb-6 block text-[#dc2626]"
          >
            Próxima Etapa
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black italic mb-8 leading-tight">
            Pare de gerir <span style={{ textDecoration: "underline", textDecorationColor: palette.redAccent }}>no escuro</span>.
          </h2>

          <div className="reveal space-y-6 md:space-y-8 mb-12 md:mb-16 opacity-90 text-base md:text-lg lg:text-xl font-medium max-w-2xl mx-auto text-zinc-800">
            <p>
              O grupo de WhatsApp é o ponto de partida ideal para você revisar a rotina trabalhista da sua empresa antes que ela se torne uma dor de cabeça cara.
            </p>
            <p className="font-black" style={{ color: palette.redAccent }}>
              Se você quer segurança jurídica real na sua operação, este é o próximo passo.
            </p>
          </div>

          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleCtaClick("final")}
            className="btn-shine font-black py-4 px-10 md:py-5 md:px-14 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 flex items-center justify-center gap-4 mx-auto text-lg md:text-xl w-fit shadow-2xl"
            style={{ background: palette.creamTextDark, color: palette.creamBg }}
          >
            <MessageCircle className="w-6 h-6 flex-shrink-0" />
            ENTRAR NO GRUPO AGORA
          </a>
          
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#dc2626] opacity-70">
            Acesso Imediato ao Grupo no WhatsApp
          </p>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer
        className="py-10 px-6 border-t text-center"
        style={{ background: palette.bgDark, borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="max-w-7xl mx-auto opacity-40">
          <p className="text-[9px] md:text-xs uppercase tracking-[0.5em] font-bold text-white">
            © 2026 MANUAL DO EMPREGADOR. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EventoGrupo;
