import { motion } from "framer-motion";
import ebookMockup from "@/assets/ebook-mockup.png";
import logoBranca from "@/assets/logo-branca.png";

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("cta-final")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-gradient relative min-h-screen flex items-center overflow-hidden">
      {/* Legal Seal watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.03] animate-slow-spin pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="95" fill="none" stroke="hsl(39,47%,55%)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="85" fill="none" stroke="hsl(39,47%,55%)" strokeWidth="0.3" />
          <text textAnchor="middle" x="100" y="105" fill="hsl(39,47%,55%)" fontSize="6" fontFamily="Montserrat" letterSpacing="4">
            CONTEÚDO JURÍDICO VERIFICADO
          </text>
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <img src={logoBranca} alt="Felipe Lopes Advogados" className="h-12 md:h-16" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <span className="font-ui text-xs text-accent tracking-widest mb-6 block">
              Guia prático para empresários
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-foreground text-balance leading-[1.1] mb-6">
              MANUAL DO<br />EMPREGADOR
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-lg">
              Da contratação à rescisão: como estruturar relações de trabalho com prevenção e estratégia para sua empresa.
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed mb-10 max-w-lg">
              Um guia prático criado por especialistas para ajudar empresários a entender e aplicar corretamente as principais regras da legislação trabalhista no dia a dia da empresa.
            </p>
            <button
              onClick={scrollToForm}
              className="font-ui text-sm bg-primary hover:bg-primary-deep text-primary-foreground px-8 py-4 rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_-5px_rgba(62,21,23,0.5)]"
            >
              BAIXAR O EBOOK
            </button>
          </motion.div>

          {/* Right - Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0, 0, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <img
              src={ebookMockup}
              alt="Manual do Empregador - E-book"
              className="w-[300px] md:w-[400px] drop-shadow-[0_20px_50px_rgba(62,21,23,0.3)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
