import { motion } from "framer-motion";
import { MessageCircle, ShieldCheck } from "lucide-react";
import ebookMockup from "@/assets/ebook-mockup.png";
import logoBranca from "@/assets/logo-branca.png";
import { CONFIG } from "@/config";

const HeroSection = () => {

  const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIG.WHATSAPP_MSG)}`;

  return (
    <section className="hero-gradient relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Geometric background pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            hsl(357,49%,16%) 0px,
            hsl(357,49%,16%) 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20 flex flex-col md:flex-row items-center gap-12">
        {/* Left – Text */}
        <div className="flex-1 z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent font-ui text-[10px] sm:text-xs tracking-widest px-4 py-2 rounded-full mb-6 uppercase"
          >
            Guia Prático para Empresários
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0, 0, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground text-balance leading-[1.1] mb-6"
          >
            Manual do Empregador
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-off-white/80 leading-relaxed mb-4 max-w-lg font-body"
          >
            Da contratação à rescisão: como estruturar relações de trabalho
            com precaução e estratégia para sua empresa.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg font-body"
          >
            Um guia prático criado por especialistas para ajudar empresários
            a entender e aplicar corretamente as principais regras da legislação
            trabalhista no dia a dia da empresa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-col sm:flex-row gap-4 mb-4"
          >
            <a
              href="#comprar"
              className="font-ui font-bold text-sm bg-accent hover:bg-gold-light text-background px-8 py-4 rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_rgba(201,168,76,0.4)] text-center whitespace-nowrap"
            >
              QUERO ADQUIRIR O E-BOOK →
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui text-sm border border-secondary text-off-white hover:bg-secondary/10 px-8 py-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              FALAR COM UM ADVOGADO
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex items-center gap-4 text-secondary-light text-[11px] font-body"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Seus dados estão seguros. Sem spam.
            </span>
          </motion.div>
        </div>

        {/* Right – Ebook Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0, 0, 1] }}
          className="flex-1 w-full order-first md:order-last flex justify-center md:justify-end perspective-[1000px]"
        >
          <div className="relative group perspective-[1000px]">
            {/* 3D Mockup Container */}
            <div 
              className="relative z-[1] w-[280px] sm:w-[320px] md:w-[400px] lg:w-[480px] transform-gpu hover:rotate-y-[-10deg] rotate-y-[-15deg] rotate-x-[5deg] transition-transform duration-500 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Seal badge overlaying mockup */}
              <div
                className="absolute -top-6 -right-6 z-20 w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-[0_4px_20px_rgba(201,168,76,0.5)] border-4 border-background transform translate-z-12"
              >
                <span className="font-ui text-xs text-background font-bold leading-tight text-center">GUIA<br />PRÁTICO</span>
              </div>
              
              {/* Ebook render */}
              <img
                src={ebookMockup}
                alt="Manual do Empregador - E-book"
                className="w-full relative z-10 drop-shadow-[0_25px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-105 hover:-translate-y-2"
              />
            </div>
            {/* Floor shadow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/60 blur-xl rounded-[100%] scale-y-[0.3]"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
