import { motion } from "framer-motion";
import ebookMockup from "@/assets/ebook-mockup.png";

const EbookPresentationSection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gold text-balance mb-8">
            Apresentamos o Manual do Empregador Inteligente
          </h2>
          <p className="text-off-white text-lg font-body leading-relaxed md:text-xl">
            Este e-book foi desenvolvido para ajudar empresários a compreender,
            de forma simples e prática, as principais regras trabalhistas que
            impactam a gestão de funcionários dentro de uma empresa.
            <br /><br />
            Ao longo do material, você encontrará orientações jurídicas fundamentais
            que podem ajudar a evitar erros comuns e reduzir riscos trabalhistas.
          </p>
        </motion.div>

        {/* Centralized Ebook mockup with glow and 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center relative perspective-[1200px]"
        >
          <div className="relative group">
            {/* Golden glow */}
            <div
              className="absolute inset-0 -m-16 rounded-full bg-gold-dim blur-[80px] pointer-events-none"
              aria-hidden="true"
            />
            {/* 3D Mockup Container */}
            <div 
              className="relative z-[1] w-[320px] md:w-[480px] lg:w-[600px] transform-gpu hover:rotate-y-[-5deg] rotate-y-[-10deg] rotate-x-[5deg] transition-transform duration-500 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <img
                src={ebookMockup}
                alt="Manual do Empregador"
                className="w-full relative z-10 drop-shadow-[0_45px_65px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-105 hover:-translate-y-2"
              />
            </div>
            {/* Floor reflection/shadow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/60 blur-xl rounded-[100%] scale-y-[0.3]"></div>
            {/* Subtle light reflection below */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-gold-dim blur-2xl rounded-full mix-blend-screen"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EbookPresentationSection;
